import { NextResponse } from 'next/server';
import { uploadToTencentCOS } from '@/lib/upload';
export async function POST(req: Request) {
    const body = await req.json();
    try {
        // 上传到腾讯云COS
        const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const imageUrl = await uploadToTencentCOS(
            `data:image/jpeg;base64,${body.screenshot}`,
            filename
        );
        return NextResponse.json({
            title: body.title || body.url,
            description: body.description || '暂无描述',
            screenshot: {
                url: imageUrl
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
