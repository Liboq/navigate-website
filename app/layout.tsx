import "@/styles/globals.css"
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({ subsets: ["latin"] })

export const metadata = {
  title: "✨ 项目导航",
  description: "我的项目网站导航页面",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={quicksand.className}>{children}</body>
    </html>
  )
}

