'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Chrome } from 'lucide-react'

const searchEngines = [
    { name: '百度', url: 'https://www.baidu.com/s?wd=', icon: <Chrome /> },
    { name: '谷歌', url: 'https://www.google.com/search?q=', icon: <Chrome /> },
    { name: '必应', url: 'https://www.bing.com/search?q=', icon: <Chrome /> },
]

export function SearchEngines() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEngine, setSelectedEngine] = useState(searchEngines[0])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            window.open(selectedEngine.url + encodeURIComponent(searchTerm), '_blank')
        }
    }

    return (
        <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
            <div className="relative flex items-center bg-white rounded-full shadow-lg overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500">
                <Select
                    value={selectedEngine.url}
                    onValueChange={(value) => setSelectedEngine(searchEngines.find(engine => engine.url === value)!)}
                >
                    <SelectTrigger className="w-[140px] border-none bg-transparent focus:ring-0">
                        <SelectValue>
                            <span className="flex items-center">
                                <span className="mr-2 text-2xl">{selectedEngine.icon}</span>
                                <span>{selectedEngine.name}</span>
                            </span>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {searchEngines.map((engine) => (
                            <SelectItem key={engine.name} value={engine.url}>
                                <span className="flex items-center">
                                    <span className="mr-2 text-2xl">{engine.icon}</span>
                                    <span>{engine.name}</span>
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    type="text"
                    placeholder="输入搜索关键词..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow border-none focus:ring-0 text-lg"
                />
                <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                    <Search className="h-5 w-5 text-gray-500" />
                </Button>
            </div>
        </form>
    )
}

