import { MediaItem, MediaType } from './types';

const PHOTOS_BASE = [
  "https://picsum.photos/seed/ios1/800/1200",
  "https://picsum.photos/seed/ios2/800/1200",
  "https://picsum.photos/seed/ios3/800/1200",
  "https://picsum.photos/seed/ios4/800/1200",
  "https://picsum.photos/seed/ios5/800/1200",
  "https://picsum.photos/seed/ios6/800/1200",
  "https://picsum.photos/seed/ios7/800/1200",
  "https://picsum.photos/seed/ios8/800/1200",
  "https://picsum.photos/seed/ios9/800/1200",
];

const DATES = [
  "Today, 9:41 AM",
  "Yesterday, 4:20 PM",
  "Monday, 11:11 AM",
  "Sunday, 8:30 PM",
];

const LOCATIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Tokyo, Japan",
  "Paris, France",
];

export const MOCK_MEDIA: MediaItem[] = Array.from({ length: 20 }).map((_, i) => {
  const isVideo = i % 5 === 0; // Every 5th item is a 'video'
  const type = isVideo ? MediaType.VIDEO : MediaType.PHOTO;
  
  // Using a darker placeholder for video simulation
  const url = isVideo 
    ? `https://picsum.photos/seed/vid${i}/800/1200?grayscale` 
    : `https://picsum.photos/seed/img${i}/800/1200`;

  return {
    id: `media-${i}`,
    type,
    url,
    date: DATES[i % DATES.length],
    location: LOCATIONS[i % LOCATIONS.length],
    isFavorite: false,
  };
});