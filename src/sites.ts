export type SiteCategory = '亚洲写真' | '日韩写真' | '中国写真' | '艺术写真';

export type PhotoSite = {
  id: string;
  name: string;
  url: string;
  category: SiteCategory;
  description: string;
  badge: string;
  note?: string;
};

export const categories = ['全部', '亚洲写真', '日韩写真', '中国写真', '艺术写真'] as const;
export type CategoryFilter = (typeof categories)[number];

export const sites: PhotoSite[] = [
  { id: 'v2ph', name: 'V2PH', url: 'https://www.v2ph.com', category: '亚洲写真', description: '亚洲写真与模特相册聚合，按系列浏览。', badge: '精选' },
  { id: 'asiaontop', name: 'AsiaOnTop', url: 'https://asiaontop.com', category: '亚洲写真', description: '亚洲模特写真图集，提供系列分类。', badge: '亚洲' },
  { id: 'asiaontop-alt', name: 'AsiaOnTop（备用域名）', url: 'https://asiaon.top', category: '亚洲写真', description: 'AsiaOnTop 备用访问地址。', badge: '备用' },
  { id: 'buondua', name: 'Buondua', url: 'https://buondua.com', category: '日韩写真', description: '亚洲模特写真系列，页面简洁。', badge: '日韩' },
  { id: 'mrcong', name: 'MrCong', url: 'https://www.mrcong.com', category: '亚洲写真', description: '亚洲写真图集，分类和系列较丰富。', badge: '图集' },
  { id: 'asiansister', name: 'AsianSister', url: 'https://asiansister.com', category: '亚洲写真', description: '亚洲模特相册集合。', badge: '亚洲' },
  { id: 'misskon', name: 'MissKon', url: 'https://misskon.org', category: '日韩写真', description: '日韩模特写真与艺术向相册。', badge: '日韩' },
  { id: 'ddtuku', name: '大东图库', url: 'https://www.ddtuku.com', category: '中国写真', description: '国模、日韩模特及系列写真图集。', badge: '中文' },
  { id: 'xiuren', name: 'XiuRen', url: 'https://xiuren.org', category: '中国写真', description: '秀人系列写真聚合入口。', badge: '中文' },
  { id: 'aituzu', name: '爱图组 Aituzu', url: 'https://www.aituzu.com', category: '中国写真', description: '写真与 COS 图集。', badge: '中文' },
  { id: '4kup', name: '4KUP', url: 'https://4kup.net', category: '日韩写真', description: '亚洲模特高清写真图集。', badge: '高清' },
  { id: 'metart', name: 'MetArt', url: 'https://www.metart.com', category: '艺术写真', description: '艺术摄影与模特作品，部分内容需订阅。', badge: '订阅' },
  { id: 'watch4beauty', name: 'Watch4Beauty', url: 'https://www.watch4beauty.com', category: '艺术写真', description: '艺术摄影作品与模特系列，部分内容需订阅。', badge: '订阅' },
  { id: 'putricinta', name: 'PutriCinta', url: 'https://putricinta.com', category: '艺术写真', description: '东南亚模特艺术摄影系列。', badge: '艺术' },
];
