import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { SiteCategory } from '@/types/site';

export async function GET() {
  try {
    const sitesPath = path.join(process.cwd(), 'data', 'sites.json');
    const sites = JSON.parse(await fs.readFile(sitesPath, 'utf-8').catch(() => '[]')) as SiteCategory[];
    return NextResponse.json(sites);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
