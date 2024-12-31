# 🚀 Pikachu导航

一个使用 Next.js 14 和 Tailwind CSS 构建的现代化个人导航网站。

## ✨ 特性

- 🎨 现代化的 UI 设计，带有流畅的动画效果
- 📱 完全响应式，支持移动端和桌面端
- 🔍 分类管理网站链接
- ⭐ 支持网站置顶功能
- 🖼️ 自动获取网站截图和描述
- 🎯 平滑滚动和导航高亮
- 🌈 随机渐变色卡片背景
- 💾 使用 Upstash Redis 数据存储
- ☁️ 腾讯云 COS 图片存储

## 🛠️ 技术栈

- **框架**: [Next.js 14](https://nextjs.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com/)
- **图标**: [Lucide Icons](https://lucide.dev/)
- **数据库**: [Upstash Redis](https://upstash.com/)
- **对象存储**: [腾讯云 COS](https://cloud.tencent.com/product/cos)
- **截图服务**: [Puppeteer](https://pptr.dev/)
- **通知**: [Sonner](https://sonner.emilkowal.ski/)

## 🚀 快速开始

1. 克隆仓库
```bash
git clone https://github.com/Liboq/navigation-website.git
cd navigation-website
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量
```bash
# .env.local
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
TENCENT_SECRET_ID=your_secret_id
TENCENT_SECRET_KEY=your_secret_key
TENCENT_BUCKET=your_bucket_name
TENCENT_REGION=your_region
```

4. 运行开发服务器
```bash
pnpm dev
```

5. 构建生产版本
```bash
npx vercel --prod 
```

## 📁 项目结构

```
navigation-website/
├── app/                    # Next.js 应用目录
│   ├── api/               # API 路由
│   │   ├── screen/       # 截图服务
│   │   ├── screenshot/   # 截图处理
│   │   ├── scrape/      # 网站信息获取
│   │   └── sites/       # 网站管理
│   └── page.tsx         # 主页面
├── components/           # React 组件
├── lib/                 # 工具函数
├── service/            # API 服务封装
├── types/              # TypeScript 类型
└── public/            # 静态资源
```

## 🔧 主要功能

### 网站管理
- 添加新网站到指定分类
- 创建新分类
- 网站置顶功能
- 自动获取网站截图和描述

### 导航功能
- 分类导航栏
- 平滑滚动
- 当前分类高亮
- 移动端响应式菜单

### 数据存储
- Upstash Redis 数据存储
- 腾讯云 COS 图片存储
- 自动保存网站截图

## 🌟 预览

![桌面端预览](https://cdn.liboqiao.top/markdown/image-20241225210549759.png)
![移动端预览](https://cdn.liboqiao.top/markdown/image-20241225210842581.png)

## 📄 许可证

[MIT License](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 👨‍💻 作者

[Liboq](https://github.com/Liboq)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
