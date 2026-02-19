export const CDN_BASE_URL = 'https://cdn.timerightproduction.org';

export const getInstructorImageUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '/placeholder-instructor.webp';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/images/instructor/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const getGalleryImageUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '/placeholder-gallery.webp';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/images/gallery/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const getHeroImageUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '/placeholder-hero.webp';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/images/hero/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};

export const getAboutImageUrl = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '/placeholder-about.webp';
  }

  const normalizedFilename = filename.replace(/^\/+/, '');
  const path = `/images/about/${normalizedFilename}`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${CDN_BASE_URL}/${normalizedPath}`;
};
