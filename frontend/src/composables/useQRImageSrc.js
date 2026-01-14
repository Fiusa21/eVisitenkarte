import QRCode from 'qrcode';

export function useQRImageSrc() {
  const qrCache = new Map();

  /**
   * Generiert QR-Code Bild und cached es
   * @param {string} url - Die URL für den QR-Code
   * @returns {Promise<string>} Data URL des QR-Codes
   */
  const generateQRDataUrl = async (url) => {
    // Cache prüfen um Performance zu verbessern
    if (qrCache.has(url)) {
      return qrCache.get(url);
    }

    try {
      const dataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        width: 220,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      qrCache.set(url, dataUrl);
      return dataUrl;
    } catch (error) {
      console.error('QR-Code Generierungsfehler:', error);
      return '';
    }
  };

  /**
   * Gibt die korrekte Bildquelle für ein Element zurück
   * Für QR: generiert lokal, für Logos: gibt Pfad zurück
   * @param {Object} element - Element mit type und content Properties
   * @returns {Promise<string>} Die Bild-URL oder Data URL
   */
  const getImageSrc = async (element) => {
    // QR codes: lokal generiert
    if (element.type === 'qr') {
      return await generateQRDataUrl(element.content);
    }

    // Logos und andere Bilder
    if (element.type === 'logo') {
      return `/company-logos/${element.content}`;
    }

    // Data URLs (für Rückwärtskompatibilität)
    if (typeof element.content === 'string' && element.content.startsWith('data:')) {
      return element.content;
    }

    // Fallback für andere Bildtypen
    return `/company-logos/${element.content}`;
  };

  return {
    getImageSrc,
    generateQRDataUrl,
    clearCache: () => qrCache.clear()
  };
}
