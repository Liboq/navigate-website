import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { SiteCategory } from '@/types/site';

async function downloadImage(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const fileName = `${Date.now()}.png`;
    const filePath = path.join(process.cwd(), 'public', 'screenshots', fileName);
    
    // 确保目录存在
    await fs.mkdir(path.join(process.cwd(), 'public', 'screenshots'), { recursive: true });
    
    // 写入文件
    await fs.writeFile(filePath, Buffer.from(buffer));
    return `/screenshots/${fileName}`;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { url, category, image, title, description, color } = await req.json();
    
    // 读取现有数据
    const sitesPath = path.join(process.cwd(), 'data', 'sites.json');
    const sites = JSON.parse(await fs.readFile(sitesPath, 'utf-8').catch(() => '[]')) as SiteCategory[];
    
    // 检查URL是否已存在
    const isUrlExists = sites.some(cat => 
      cat.items.some(item => item.url === url)
    );

    if (isUrlExists) {
      return NextResponse.json(
        { error: '该网站已经添加过了' }, 
        { status: 400 }
      );
    }
    
    // 下载图片到本地
    const localImagePath = await downloadImage(image);
    
    // 查找或创建分类
    let categoryGroup = sites.find(s => s.category === category);
    if (!categoryGroup) {
      categoryGroup = { category, items: [] };
      sites.push(categoryGroup);
    }

    // 添加新网站
    categoryGroup.items.push({
      url,
      title,
      description,
      image: localImagePath,
      color
    });

    // 保存更新后的数据
    await fs.writeFile(sitesPath, JSON.stringify(sites, null, 2));
    
    return NextResponse.json(sites);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '添加网站失败' }, { status: 500 });
  }
} 