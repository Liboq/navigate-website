import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { SiteCategory } from '@/types/site';

export async function POST(req: Request) {
  try {
    const { category, url } = await req.json();
    const sitesPath = path.join(process.cwd(), 'data', 'sites.json');
    const sites = JSON.parse(await fs.readFile(sitesPath, 'utf-8').catch(() => '[]')) as SiteCategory[];

    // 查找并更新置顶状态
    const categoryGroup = sites.find(s => s.category === category);
    if (categoryGroup) {
      const site = categoryGroup.items.find(item => item.url === url);
      if (site) {
        site.isTop = !site.isTop;
      }
    }

    // 保存更新后的数据
    await fs.writeFile(sitesPath, JSON.stringify(sites, null, 2));
    
    return NextResponse.json(sites);
  } catch {
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
} 