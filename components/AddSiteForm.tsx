'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { 
  Select, 
  SelectContent,
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Store, Plus } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface AddSiteFormProps {
    onSubmit: (category: string, url: string) => void;
    categories: string[];
    onAddCategory: (category: string) => void;
}

export function AddSiteForm({ categories, onSubmit, onAddCategory }: AddSiteFormProps) {
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isAddingCategory && newCategory) {
                onAddCategory(newCategory);
                setCategory(newCategory);
                setIsAddingCategory(false);
                setNewCategory('');
                return;
            }
            onSubmit(category, url);
        } catch (error) {
            console.error(error);
            alert('添加失败');
        } finally {
            setLoading(false);
            setUrl('');
            setCategory('');
        }
    };

    return (
        <Card className="p-4 mb-8">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 min-w-0">
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                        分类
                    </Label>
                    <div className="flex gap-2">
                        {!isAddingCategory ? (
                            <>
                                <Select
                                    value={category}
                                    onValueChange={(value) => setCategory(value)}
                                >
                                    <SelectTrigger className="w-full md:w-[180px] bg-white border-2 border-pink-300">
                                        <SelectValue placeholder="选择类型" />
                                    </SelectTrigger>
                                    <SelectContent 
                                        className="bg-white border-2 border-pink-100 rounded-md shadow-lg"
                                        position="popper"
                                        align="start"
                                        side="bottom"
                                    >
                                        {categories.map((category, index) => (
                                            <SelectItem 
                                                key={index} 
                                                value={category}
                                                className="cursor-pointer hover:bg-pink-50"
                                            >
                                                <div className="flex items-center">
                                                    <Store className="mr-2 h-4 w-4 text-pink-500" />
                                                    {category}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    className='border-pink-500 shrink-0'
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddingCategory(true)}
                                >
                                    <Plus className="h-4 w-4 text-pink-500" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="输入新分类名称"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="shrink-0"
                                    onClick={() => setIsAddingCategory(false)}
                                >
                                    取消
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <Label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                        网站地址
                    </Label>
                    <Input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full"
                        placeholder="https://example.com"
                        required={!isAddingCategory}
                    />
                </div>
                <div className="flex items-end">
                    <Button
                        type="submit"
                        disabled={loading || (isAddingCategory ? !newCategory : !category) || (!isAddingCategory && !url)}
                        variant="secondary"
                        className="w-full md:w-auto px-4 py-2 bg-green-200 text-white rounded-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? '添加中...' : isAddingCategory ? '添加分类' : '添加网站'}
                    </Button>
                </div>
            </form>
        </Card>
    );
} 