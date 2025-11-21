export enum MediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
}

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  date: string;
  location?: string;
  isFavorite: boolean;
  width?: number;
  height?: number;
}

export type TabType = 'all' | 'photos' | 'videos';