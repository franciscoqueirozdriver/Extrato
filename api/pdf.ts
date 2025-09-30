import type { VercelRequest, VercelResponse } from '@vercel/node';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

async function readRaw(req: VercelRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Use POST com {html}' });
    }

    const ctype = String(req.headers['content-type'] || '').toLowerCase();
    let html = '';

    if (ctype.includes('application/json')) {
      const body = (req.body ?? {}) as any;
      if (typeof body?.html === 'string') {
        html = body.html;
      }
    } else {
      html = await readRaw(req);
    }

    if (!html || html.length < 20) {
      return res.status(400).json({ error: 'HTML ausente' });
    }

    chromium.setHeadlessMode = true;
    chromium.setGraphicsMode = false;

    const browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '16mm', bottom: '16mm', left: '12mm', right: '12mm' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="extrato.pdf"');
    return res.status(200).send(Buffer.from(pdf));
  } catch (err: any) {
    console.error('PDF FAIL', err);
    return res.status(500).json({ error: 'Falha ao gerar PDF', detail: String(err?.message || err) });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb'
    }
  }
};
