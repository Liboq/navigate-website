'use client'

import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

interface SidebarNavProps {
  categories: string[]
}

export function SidebarNav({ categories }: SidebarNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => {
      for (const category of categories) {
        if (!category) continue;
        const elementId = category?.replace(/\s+/g, '-').toLowerCase() || '';
        const element = document.getElementById(elementId);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect()
          if (top <= 150 && bottom >= 150) {
            setActiveCategory(category)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [categories])

  const scrollToCategory = (category: string) => {
    if (!category) return;
    const elementId = category?.replace(/\s+/g, '-').toLowerCase() || '';
    const element = document.getElementById(elementId);
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsOpen(false)
    setActiveCategory(category)
  }

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      <nav className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white/80 backdrop-blur-sm shadow-lg z-40 transition-transform duration-300 ease-in-out",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="space-y-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={cn(
                  "w-full text-left px-4 py-2 rounded-lg transition-all duration-300",
                  activeCategory === category
                    ? "bg-pink-100 text-pink-600 font-medium transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

