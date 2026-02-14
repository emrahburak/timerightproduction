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
