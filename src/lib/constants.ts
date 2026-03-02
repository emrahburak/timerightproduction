import { showcaseStackImages } from '@/data/showcaseStack';

export const CDN_BASE_URL = 'https://cdn.timerightproduction.org';

export const getInstructorImageUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '/placeholder-thumbnail.webp';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/images/instructor/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const getGalleryImageUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '/placeholder-thumbnail.webp';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/images/gallery/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const getHeroImageUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '/placeholder-thumbnail.webp';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/images/hero/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const getAboutImageUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '/placeholder-thumbnail.webp';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/images/about/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const getServiceImageUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '/placeholder-thumbnail.webp';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/images/services/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const getVideoUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/videos/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const getShowcaseStackUrl = (
  componentName: string,
  filename: string
): string => {
  const imageConfig = showcaseStackImages.find(
    (item) => item.component === componentName
  );

  if (!imageConfig || !imageConfig.image) {
    return '/placeholder-thumbnail.webp';
  }

  const normalizedFilename = imageConfig.image.replace(/^\/+/, '');
  const path = `/images/showcasestack/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const getThumbnailImageUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '/placeholder-thumbnail.webp';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/images/thumbnaills/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const getRitmImageUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '/placeholder-thumbnail.webp';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/images/ritm/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};
