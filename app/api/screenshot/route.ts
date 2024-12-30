import { NextResponse } from 'next/server';
import { uploadToTencentCOS } from '@/lib/upload';

const MAX_RETRIES = 3;

async function fetchWithRetry(url: string, retries = MAX_RETRIES) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempt ${i + 1}: Fetching screenshot for ${url}`);

            const baseUrl = process.env.NODE_ENV === 'production'
                ? `https://strong-navigation.vercel.app/`
                : 'http://localhost:3000';

            const response = await fetch(`${baseUrl}/api/screen?url=${encodeURIComponent(url)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.log(response, 'response');
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Attempt ${i + 1} response data:`, data);

            return data;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === retries - 1) throw error;
            const waitTime = 1000 * Math.pow(2, i);
            console.log(`Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
    throw new Error('All retry attempts failed');
}

export async function POST(req: Request) {
    const body = await req.json();

    try {
        const { url } = body;

        const response = await fetchWithRetry(url);

        if (!response.screenshot) {
            throw new Error('No screenshot data received');
        }

        // 上传到腾讯云COS
        const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const imageUrl = await uploadToTencentCOS(
            `data:image/jpeg;base64,${response.screenshot}`,
            filename
        );

        return NextResponse.json({
            data: {
                title: response.title || url,
                description: response.description || '暂无描述',
                screenshot: {
                    url: imageUrl
                }
            }
        });

    } catch (error) {
        console.error('Screenshot error:', error);
        return NextResponse.json(
            { error: "超时了！请重试" },
            { status: 500 }
        );
    }
}
