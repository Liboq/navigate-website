import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { SiteCategory } from '@/types/site';

export async function POST(req: Request) {
  try {
    const { category } = await req.json();
    const sitesPath = path.join(process.cwd(), 'data', 'sites.json');
    const sites = JSON.parse(await fs.readFile(sitesPath, 'utf-8').catch(() => '[]')) as SiteCategory[];

    // 检查分类是否已存在
    if (sites.some(site => site.category === category)) {
      return NextResponse.json(
        { error: '该分类已存在' },
        { status: 400 }
      );
    }

    // 添加新分类
    sites.push({
      category,
      items: []
    });

    // 保存更新后的数据
    await fs.writeFile(sitesPath, JSON.stringify(sites, null, 2));
    
    return NextResponse.json(sites);
  } catch {
    return NextResponse.json({ error: '添加分类失败' }, { status: 500 });
  }
} 