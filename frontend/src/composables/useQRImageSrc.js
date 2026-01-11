/**
 * Composable for handling QR code image generation and rendering
 * Provides a unified way to get the correct image source for QR codes across all views
 */

export function useQRImageSrc() {
  /**
   * Generate the correct image source for an element
   * For QR codes: generates API URL from stored URL string
   * For logos: returns the company-logos path
   * For data URLs: returns them as-is
   * 
   * @param {Object} element - The element with type and content properties
   * @returns {string} The correct image source URL
   */
  const getImageSrc = (element) => {
    // QR codes: generate from stored URL string
    if (element.type === 'qr') {
      const encoded = encodeURIComponent(element.content);
      return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=png&data=${encoded}&color=000000&bgcolor=FFFFFF`;
    }
    
    // Logos and other images
    if (element.type === 'logo') {
      return `/company-logos/${element.content}`;
    }
    
    // Data URLs (for backward compatibility)
    if (typeof element.content === 'string' && element.content.startsWith('data:')) {
      return element.content;
    }
    
    // Fallback for other image types
    return `/company-logos/${element.content}`;
  };

  return {
    getImageSrc
  };
}
