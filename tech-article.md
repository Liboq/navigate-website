# 从零搭建一个现代化的个人导航网站：技术实践与经验分享

>发现了一个强大的工具 [Microlink](https://microlink.io/)。它不仅能够智能获取网站截图，还可以自动提取网站的元数据信息。基于这个发现，我构建了一个现代化的个人导航网站，让网站收藏管理变得更加优雅和高效。

## 前言

分享如何使用 Next.js 14 和 Tailwind CSS 构建一个功能完整的个人导航网站。

## 技术栈选择

### 1. Next.js 14

选择 Next.js 14 作为核心框架的原因：

- App Router 提供更好的路由管理
- 服务端组件优化性能
- API Routes 简化后端开发
- 内置的图片优化功能

### 2. Tailwind CSS

使用 Tailwind CSS 的优势：

- 原子化 CSS，提高开发效率
- 完全可定制的设计系统
- JIT 编译，优化生产环境体积
- 响应式设计更简单直观

### 3. shadcn/ui

选择 shadcn/ui 的考虑：

- 高度可定制的组件库
- 源代码可控
- Radix UI 的可访问性支持
- 现代化的设计风格

## 核心功能实现

### 1. 自动获取网站信息

```typescript
// 使用 Microlink API 获取网站信息
function getScreenshotUrl(url: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(
    url
  )}&screenshot=true`;
}

// 实现网站信息获取
async function fetchSiteInfo(url: string) {
  const res = await fetch(getScreenshotUrl(url));
  const site = await res.json();
  return {
    title: site.data.title,
    description: site.data.description,
    image: site.data.screenshot.url,
  };
}
```

### 2. 本地图片存储

```typescript
async function downloadImage(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const fileName = `${Date.now()}.png`;
  const filePath = path.join(process.cwd(), "public", "screenshots", fileName);

  // 确保目录存在
  await fs.mkdir(path.join(process.cwd(), "public", "screenshots"), {
    recursive: true,
  });

  // 写入文件
  await fs.writeFile(filePath, Buffer.from(buffer));
  return `/screenshots/${fileName}`;
}
```

### 3. 响应式导航栏实现

```typescript
export function SidebarNav({ categories }: SidebarNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");

  // 监听滚动，更新当前分类
  useEffect(() => {
    const handleScroll = () => {
      for (const category of categories) {
        const element = document.getElementById(
          category.replace(/\s+/g, "-").toLowerCase()
        );
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 150 && bottom >= 150) {
            setActiveCategory(category);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  // 平滑滚动实现
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(
      category.replace(/\s+/g, "-").toLowerCase()
    );
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };
}
```

### 4. 渐变色卡片设计

```typescript
// 随机渐变色生成
const colorCombinations = [
  "from-pink-500 to-rose-300",
  "from-purple-500 to-indigo-300",
  "from-blue-500 to-cyan-300",
  // ...更多颜色组合
] as const;

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colorCombinations.length);
  return colorCombinations[randomIndex];
}

// 卡片组件实现
<Card
  className={cn(
    "group relative overflow-hidden rounded-xl border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2",
    site.isTop && "ring-2 ring-pink-500"
  )}
>
  <div
    className={cn("absolute inset-0 bg-gradient-to-br opacity-80", site.color)}
  />
  {/* 卡片内容 */}
</Card>;
```

## 性能优化

### 1. 图片优化

- 使用 Next.js Image 组件自动优化
- 实现图片懒加载
- 本地缓存网站截图

### 2. 状态管理

- 使用 React 状态管理网站数据
- 实现数据持久化存储
- 优化状态更新逻辑

### 3. 动画性能

- 使用 CSS transforms 代替位置动画
- 添加 will-change 提示
- 优化动画帧率

## 项目难点与解决方案

### 1. 移动端适配

- 使用 Tailwind 的响应式类
- 实现自适应布局
- 优化触摸交互

### 2. 数据持久化

- 使用本地 JSON 文件存储
- 实现数据备份机制
- 处理并发写入问题

### 3. 网站信息获取

- 处理跨域问题
- 实现错误重试机制
- 优化请求性能

## 未来展望

1. 添加用户系统
2. 实现数据同步
3. 添加更多自定义选项
4. 优化性能和用户体验

## 总结

通过这个项目，我们不仅实现了一个功能完整的导航网站，还实践了现代前端开发的多个重要概念。项目的源码已经开源，欢迎大家参考和贡献。

## 相关链接

- [项目源码](https://github.com/Liboq/navigate-website)
- [问题反馈](https://github.com/Liboq/navigate-website/issues)

---

如果你觉得这个项目对你有帮助，欢迎给个 Star ⭐️

## preview
[预览](https://strong-navigation.vercel.app/)

![image](https://cdn.liboqiao.top/markdown/image-20241225210549759.png)
![mobile-image](https://cdn.liboqiao.top/markdown/image-20241225210842581.png)
