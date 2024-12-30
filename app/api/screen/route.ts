import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";

const timeOut = 60;

export const maxDuration = timeOut;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: "超时了！请重试" }, { status: 400 });
    }

    let browser = null;

    try {
        console.time("screenshot");

        const options = {
            args: [
                ...chromium.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--deterministic-fetch',
                '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials',
            ],
            defaultViewport: {
                width: 1280,
                height: 720,
                deviceScaleFactor: 1,
            },
            executablePath: process.env.NODE_ENV === 'production'
                ? await chromium.executablePath()
                : process.platform === 'win32'
                    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                    : '/usr/bin/google-chrome',
            headless: true
        };

        browser = await puppeteer.launch(options);
        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(timeOut * 1000);
        await page.setDefaultTimeout(timeOut * 1000);

        await page.goto(url, {
            waitUntil: ["domcontentloaded", "networkidle0"],
            timeout: timeOut * 1000,
        });

        const title = (await page.title()) || "未知标题";
        const description = await page
            .$eval('meta[name="description"]', (element) =>
                element.getAttribute("content")
            )
            .catch(() => "暂无描述");
        const screenshot = await page.screenshot({
            type: "jpeg",
            quality: 80,
            encoding: "base64",
        });

        console.timeEnd("screenshot");
        return NextResponse.json({ screenshot, title, description });
    } catch (error) {
        console.error('Screenshot error:', error);
        return NextResponse.json({
            error: "Error generating screenshot",
            message: error instanceof Error ? error.message : 'Error generating screenshot',
        }, { status: 500 });
    } finally {
        if (browser !== null) {
            await browser.close().catch(console.error);
        }
    }
}
