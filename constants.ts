import { MediaItem, MediaType } from './types';

const LOCATIONS = [
  "北京市 · 故宫博物院",
  "上海市 · 外滩",
  "深圳市 · 深圳湾公园",
  "杭州市 · 西湖",
  "成都市 · 春熙路",
  "重庆市 · 洪崖洞",
  "广州市 · 小蛮腰",
  "西安市 · 钟楼",
  "武汉市 · 黄鹤楼",
  "南京市 · 夫子庙",
  "拉萨 · 布达拉宫",
  "三亚 · 亚龙湾",
  "东京 · 涩谷",
  "京都 · 岚山",
  "巴黎 · 埃菲尔铁塔",
  "伦敦 · 大本钟",
  "纽约 · 曼哈顿",
  "冰岛 · 蓝湖",
  "洛杉矶 · 圣莫尼卡",
  "悉尼 · 歌剧院"
];

const DATES = [
  "今天 14:30",
  "昨天 09:15",
  "周一 18:20",
  "周日 11:11",
  "2023年10月5日",
  "2023年9月12日",
  "2023年5月20日",
  "2023年1月1日"
];

// Create a larger pool of 50 items to simulate a full phone gallery
export const MOCK_POOL: MediaItem[] = Array.from({ length: 50 }).map((_, i) => {
  const isVideo = i % 6 === 0; // Every 6th item is a 'video'
  const type = isVideo ? MediaType.VIDEO : MediaType.PHOTO;
  
  // Using varying seeds to get different images
  const url = isVideo 
    ? `https://picsum.photos/seed/vid_new_${i}/800/1200?grayscale` 
    : `https://picsum.photos/seed/img_new_${i}/800/1200`;

  return {
    id: `media-${i}`,
    type,
    url,
    date: DATES[i % DATES.length],
    location: LOCATIONS[i % LOCATIONS.length],
    isFavorite: false,
  };
});

export const getRandomSubset = (count: number): MediaItem[] => {
  // Randomly shuffle the full pool and pick 'count' items
  const shuffled = [...MOCK_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};