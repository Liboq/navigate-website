import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { Site, Category } from '@/types/site';

export async function POST(req: Request) {
  try {
    const { url, categoryName, image, title, description, color, icon } = await req.json();
    
    // 检查必要的字段
    if (!url || !categoryName || !image || !title) {
      return NextResponse.json(
        { error: '缺少必要的信息' }, 
        { status: 400 }
      );
    }

    // 检查图片URL是否有效（不是默认图片）
    if (image === 'https://cdn.liboqiao.top/markdown/image-20241224160126995.png') {
      return NextResponse.json(
        { error: '截图获取失败' }, 
        { status: 400 }
      );
    }

    const [sites, categories] = await Promise.all([
      kv.get<Site[]>('sites') ?? [],
      kv.get<Category[]>('categories') ?? []
    ]) as [Site[], Category[]];

    // 检查URL是否已存在
    if (sites.some(site => site.url === url)) {
      return NextResponse.json(
        { error: '该网站已经添加过了' }, 
        { status: 400 }
      );
    }

    // 查找分类ID
    const category = categories.find(cat => cat.name === categoryName);
    if (!category) {
      return NextResponse.json(
        { error: '分类不存在' }, 
        { status: 400 }
      );
    }

    // 添加新网站
    const newSite: Site = {
      url,
      title,
      description,
      image,
      color,
      categoryId: category.id,
      icon: icon
    };

    const updatedSites = [...sites, newSite];
    await kv.set('sites', updatedSites);
    
    // 返回组织后的数据
    const organizedData = categories.map(cat => ({
      category: cat.name,
      items: updatedSites.filter(site => site.categoryId === cat.id)
    }));

    return NextResponse.json(organizedData);
  } catch (error) {
    console.error('Error in scrape API:', error);
    return NextResponse.json({ error: '添加网站失败' }, { status: 500 });
  }
} 