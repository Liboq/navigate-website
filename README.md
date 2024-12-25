# 个人导航网站 (Personal Navigation Website)

✨ 一个使用 Next.js 14 和 Tailwind CSS 构建的现代化个人导航网站。

## 🌟 特性

- 🎨 现代化的 UI 设计，带有流畅的动画效果
- 📱 完全响应式，支持移动端和桌面端
- 🔍 分类管理网站链接
- ⭐ 支持网站置顶功能
- 🖼️ 自动获取网站截图和描述
- 🎯 平滑滚动和导航高亮
- 🌈 随机渐变色卡片背景
- 💾 本地 JSON 数据存储

## 🛠️ 技术栈

- **框架**: [Next.js 14](https://nextjs.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com/)
- **图标**: [Lucide Icons](https://lucide.dev/)
- **动画**: CSS Animations & Transitions
- **截图服务**: [Microlink API](https://microlink.io/)

## 🚀 快速开始

1. 克隆仓库
```bash
git clone https://github.com/yourusername/navigation-website.git
cd navigation-website
```
2. 安装依赖
```bash
pnpm install
```

3. 运行开发服务器
``` bash
pnpm dev
```

4. 构建生产版本
```bash
pnpm build
```

## 📁 项目结构

```
navigation-website/
├── app/                    # Next.js 应用目录
│   ├── api/               # API 路由
│   │   ├── scrape/       # 截图和网站信息获取
│   │   ├── sites/        # 网站管理
│   │   └── category/     # 分类管理
│   ├── page.tsx          # 主页面
│   └── _document.tsx     # 自定义文档
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   ├── AddSiteForm.tsx   # 添加网站表单
│   ├── SidebarNav.tsx    # 侧边导航栏
│   └── TypewriterEffect.tsx # 打字机效果
├── public/               # 静态资源
│   └── screenshots/      # 网站截图存储
├── data/                 # 数据文件
│   └── sites.json       # 网站数据存储
├── types/               # TypeScript 类型定义
│   └── site.ts         # 网站相关类型定义
├── lib/                 # 工具函数
│   └── utils.ts        # 通用工具函数
├── styles/             # 样式文件
│   └── globals.css     # 全局样式
├── LICENSE             # MIT 许可证
├── next.config.mjs     # Next.js 配置
├── package.json        # 项目依赖
├── postcss.config.js   # PostCSS 配置
├── tailwind.config.ts  # Tailwind 配置
├── tsconfig.json       # TypeScript 配置
└── README.md          # 项目文档
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
- 使用本地 JSON 文件存储数据
- 自动保存网站截图到本地


### 自定义主题
修改 `tailwind.config.ts` 文件来自定义主题颜色和其他样式。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 👨‍💻 作者

[Liboq](https://github.com/Liboq)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
## preview

![image](https://cdn.liboqiao.top/markdown/image-20241225210549759.png)
![mobile-image](https://cdn.liboqiao.top/markdown/image-20241225210842581.png)
