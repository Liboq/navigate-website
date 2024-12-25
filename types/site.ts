export interface Site {
  url: string;
  title: string;
  description: string;
  image: string;
  color: string;
  icon?: string;
  isTop?: boolean;
}

export interface SiteCategory {
  category: string;
  items: Site[];
}
