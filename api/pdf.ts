import type { VercelRequest, VercelResponse } from '@vercel/node';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Use POST com { html }' });
    }

    const html: string = (req.body && (req.body as any).html) || (typeof req.body === 'string' ? (req.body as string) : '');
    if (!html || typeof html !== 'string') {
      return res.status(400).json({ error: 'HTML ausente' });
    }

    const isVercel = Boolean(process.env.VERCEL);
    const executablePath = await chromium.executablePath();

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: isVercel ? executablePath : undefined,
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
  } catch (error) {
    console.error('PDF FAIL', error);
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: 'Falha ao gerar PDF', detail: message });
  }
}
