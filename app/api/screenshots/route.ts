import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { Screenshot } from '@/types/site';

// 获取图片
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const siteUrl = searchParams.get('url');

  if (!siteUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const screenshot = await kv.hget<Screenshot>('screenshots', siteUrl);
    return NextResponse.json(screenshot);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: 'Failed to get screenshot' }, { status: 500 });
  }
}

// 保存图片
export async function POST(req: Request) {
  try {
    const { siteUrl, imageData } = await req.json();

    const screenshot: Screenshot = {
      id: `ss_${Date.now()}`,
      siteUrl,
      imageData,
      createdAt: new Date().toISOString()
    };

    await kv.hset('screenshots', {
      [siteUrl]: screenshot
    });

    return NextResponse.json(screenshot);
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: 'Failed to save screenshot' }, { status: 500 });
  }
} 