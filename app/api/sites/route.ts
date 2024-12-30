import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { Site, Category } from '@/types/site';

export async function GET() {
  try {
    const [sites, categories] = await Promise.all([
      kv.get<Site[]>('sites') || [],
      kv.get<Category[]>('categories') || []
    ]) as [Site[], Category[]];
    
    if(!categories){
      return NextResponse.json([], { status: 200 });
    }
    
    // 组织数据结构返回
    const organizedData = categories.map(category => ({
      category: category.name,
      items: (sites&&sites?.filter(site => site.categoryId === category.id)) || []
    }));

    return NextResponse.json(organizedData);
  } catch (error){
    console.log(error);
    
    return NextResponse.json([], { status: 500 });
  }
}
