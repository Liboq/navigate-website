'use client'

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Heart, Star, Sparkles, Github, Calculator, BookOpen, Code, Database, Palette, LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import TypewriterEffect from "@/components/typewriter-effect"
import { SidebarNav } from "@/components/sidebar-nav"
import { SiteCategory } from "@/types/site"
import { AddSiteForm } from "@/components/AddSiteForm"

// 添加颜色组合数组
const colorCombinations = [
  "from-pink-500 to-rose-300",
  "from-purple-500 to-indigo-300",
  "from-blue-500 to-cyan-300",
  "from-green-500 to-emerald-300",
  "from-yellow-500 to-orange-300",
  "from-red-500 to-pink-300",
  "from-indigo-500 to-purple-300",
  "from-gray-700 to-gray-900",
  "from-blue-400 to-cyan-400",
  "from-teal-500 to-green-300",
] as const;

// 获取随机颜色组合的函数
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colorCombinations.length);
  return colorCombinations[randomIndex];
}

function getScreenshotUrl(url: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true`
}

const IconMap: Record<string, LucideIcon> = {
  'Github': Github,
  'Code': Code,
  'BookOpen': BookOpen,
  'Calculator': Calculator,
  'Palette': Palette,
  'Database': Database,
} as const;

export default function Page() {
  const [siteData, setSiteData] = useState<SiteCategory[]>([])
  const categories = siteData.map(category => category.category) || []

  const handleAddCategory = async (newCategory: string) => {
    try {
      if (categories.includes(newCategory)) {
        alert('该分类已存在');
        return;
      }

      const response = await fetch('/api/sites/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: newCategory }),
      });

      if (!response.ok) {
        throw new Error('添加分类失败');
      }

      const data = await response.json();
      setSiteData(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : '添加分类失败');
    }
  };

  const handleUpdateSites = async (category: string, url: string) => {
    try {
      // 检查是否是新分类
      if (!categories.includes(category)) {
        // 如果是新分类，先创建分类
        const newCategory: SiteCategory = {
          category,
          items: []
        };
        setSiteData([...siteData, newCategory]);
      }

      const res = await fetch(getScreenshotUrl(url))
      const site = await res.json()
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url, 
          category, 
          image: site.data.screenshot.url, 
          title: site.data.title, 
          description: site.data.description,
          color: getRandomColor()
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '添加失败');
      }

      const data = await response.json();
      setSiteData(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : '添加网站失败');
    }
  }
  useEffect(() => {
    // 获取自定义网站
    const fetchCustomSites = async () => {
      const response = await fetch('/api/sites');
      const data = await response.json();

      // 在这里处理截图
      if (data && data.length > 0) {
        const updatedSites = await Promise.all(
          data.map(async (category: SiteCategory) => ({
            ...category,
            items: await Promise.all(
              category.items.map(async (site) => {
                if (!site.image) {
                  try {
                    const response = await fetch(getScreenshotUrl(site.url))
                    const data = await response.json()
                    return { 
                      ...site, 
                      image: data.data.screenshot.url, 
                      description: data.data.description,
                      color: site.color || getRandomColor() // 如果没有颜色就随机选择一个
                    }
                  } catch (error) {
                    console.error(`Failed to fetch screenshot for ${site.url}:`, error)
                    return site
                  }
                }
                return site
              })
            )
          }))
        )
        setSiteData(updatedSites)
      } else {
        setSiteData(data)
      }
    }
    fetchCustomSites();
  }, []) // 只在组件挂载时执行一次

  // 添加置顶处理函数
  const handleToggleTop = async (categoryName: string, siteUrl: string) => {
    try {
      const response = await fetch('/api/sites/toggle-top', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          category: categoryName, 
          url: siteUrl 
        }),
      });

      if (!response.ok) {
        throw new Error('操作失败');
      }

      const data = await response.json();
      setSiteData(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : '操作失败');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-64 h-64 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-1/2 -left-4 w-64 h-64 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-4 right-1/2 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <SidebarNav categories={categories} />

      <main className="relative transition-all duration-300 px-4 py-12
        md:ml-64 // 桌面端左边距
        md:px-8  // 桌面端水平内边距
      ">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 inline-block mb-4">
            ✨ Pikachu的秘密基地 ⚡
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            探索有趣的前端世界~
          </p>
          <div className="flex justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-sparkle" />
            <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
            <Heart className="w-5 h-5 text-pink-400 animate-bounce" />
          </div>
          <TypewriterEffect text="你好！我是Liboq，来自长沙的前端开发工程师，拥有三年开发经验。" />
        </div>
        <AddSiteForm 
          onSubmit={handleUpdateSites} 
          categories={categories} 
          onAddCategory={handleAddCategory}
        />

        {siteData.map((category) => (
          <div key={category.category} id={category.category.replace(/\s+/g, '-').toLowerCase()} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items
                .sort((a, b) => {
                  if (a.isTop === b.isTop) return 0;
                  return a.isTop ? -1 : 1;
                })
                .map((site) => (
                  <Card
                    key={site.url}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2",
                      site.isTop && "ring-2 ring-pink-500"
                    )}
                  >
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-80",
                      site.color
                    )} />

                    <CardHeader className="p-0">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={site.image || "https://cdn.liboqiao.top/markdown/image-20241224160126995.png"}
                          alt={`Screenshot of ${site.title}`}
                          fill
                          className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    </CardHeader>

                    <CardContent className="relative p-6">
                      <div className="flex items-center gap-3 mb-3">
                        {site.icon && (() => {
                          const Icon = IconMap[site.icon];
                          return Icon ? <Icon className="w-6 h-6 text-white" /> : null;
                        })()}
                        <CardTitle className="text-2xl font-bold text-white">
                          {site.title}
                        </CardTitle>
                      </div>
                      <p className="text-white/90">{site.description}</p>
                    </CardContent>

                    <CardFooter className="relative p-6 pt-0">
                      <Link
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
                      >
                        访问网站
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </CardFooter>

                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => handleToggleTop(category.category, site.url)}
                        className="bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transform group-hover:rotate-12 transition-all duration-300"
                      >
                        {site.isTop ? (
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ) : (
                          <Star className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transform group-hover:rotate-12 transition-all duration-300">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

