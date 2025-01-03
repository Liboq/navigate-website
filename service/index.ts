import { Site } from '@/types/site';

interface OrganizedData {
  category: string;
  items: Site[];
}

export async function getScreen(url: string) {
  try {
    const response = await fetch(`/api/screen?url=${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Screenshot error:', error);
    throw new Error('获取截图失败');
  }
}
export async function uploadScreen(data: { screenshot: string,title:string,description:string }) {
  const response = await fetch(`/api/screenshot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function addSite(params: {
  url: string;
  categoryName: string;
  image: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}) {
  try {
    const response = await fetch('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '添加失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Add site error:', error);
    throw error;
  }
}

export async function addCategory(name: string) {
  try {
    const response = await fetch('/api/sites/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '添加分类失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Add category error:', error);
    throw error;
  }
}

export async function toggleSiteTop(categoryName: string, siteUrl: string) {
  try {
    const response = await fetch('/api/sites/toggle-top', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryName, url: siteUrl }),
    });

    if (!response.ok) {
      throw new Error('操作失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Toggle top error:', error);
    throw error;
  }
}

export async function getSites(): Promise<OrganizedData[]> {
  try {
    const response = await fetch('/api/sites');
    if (!response.ok) {
      throw new Error('获取网站列表失败');
    }
    return await response.json();
  } catch (error) {
    console.error('Get sites error:', error);
    throw error;
  }
}
