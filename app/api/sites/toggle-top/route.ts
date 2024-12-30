import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { Site, Category } from '@/types/site';

export async function POST(req: Request) {
  try {
    const { categoryName, url } = await req.json();
    const [sites, categories] = await Promise.all([
      kv.get<Site[]>('sites') ?? [],
      kv.get<Category[]>('categories') ?? []
    ]) as [Site[], Category[]];

    // 查找并更新置顶状态
    const category = categories.find(cat => cat.name === categoryName);
    if (!category) {
      return NextResponse.json(
        { error: '分类不存在' }, 
        { status: 400 }
      );
    }

    const siteIndex = sites.findIndex(site => 
      site.url === url && site.categoryId === category.id
    );

    if (siteIndex !== -1) {
      const updatedSites = [...sites];
      updatedSites[siteIndex] = {
        ...updatedSites[siteIndex],
        isTop: !updatedSites[siteIndex].isTop
      };
      
      await kv.set('sites', updatedSites);

      // 返回组织后的数据
      const organizedData = categories.map(cat => ({
        category: cat.name,
        items: updatedSites.filter(site => site.categoryId === cat.id)
      }));

      return NextResponse.json(organizedData);
    }

    return NextResponse.json(
      { error: '网站不存在' }, 
      { status: 400 }
    );
  } catch {
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
} 