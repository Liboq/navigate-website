export interface Site {
  url: string;
  title: string;
  description: string;
  image: string;
  color: string;
  icon?: string;
  isTop?: boolean;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  order?: number;
}

export interface Screenshot {
  id: string;
  siteUrl: string;
  imageData: string;
  createdAt: string;
}
