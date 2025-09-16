
import placeholderImages from '@/lib/placeholder-images.json';

type ImageMap = { [key: string]: string };

/**
 * Retrieves an image URL for a given crop name.
 * It first checks for a specific mapping in placeholder-images.json.
 * If no mapping is found, it generates a consistent placeholder URL using picsum.photos.
 * This approach avoids using local image paths that might not exist and ensures every crop has an image.
 *
 * @param cropName - The name of the crop (e.g., "Apple", "Tomato").
 * @returns A URL for the crop image.
 */
export const getImageUrl = (cropName: string): string => {
  const imageMap = placeholderImages as ImageMap;
  const normalizedCropName = cropName.trim().toLowerCase();
  
  // Check for a direct match in the JSON file.
  for (const key in imageMap) {
    if (key.toLowerCase() === normalizedCropName) {
      return imageMap[key];
    }
  }

  // Generate a consistent seed from the crop name for a stable random image
  const seed = normalizedCropName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Fallback to a dynamic placeholder from picsum.photos if no specific one is found.
  return `https://picsum.photos/seed/${seed}/400/300`;
};

    