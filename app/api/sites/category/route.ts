import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { Category } from '@/types/site';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const categories: Category[] = await kv.get('categories') ?? [];

    // 检查分类是否已存在
    if (categories.some(cat => cat.name === name)) {
      return NextResponse.json(
        { error: '该分类已存在' },
        { status: 400 }
      );
    }

    // 创建新分类
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name,
      order: categories.length
    };

    const updatedCategories = [...categories, newCategory];
    await kv.set('categories', updatedCategories);

    return NextResponse.json(updatedCategories);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: '添加分类失败' }, { status: 500 });
  }
} 