import ApiService from './api-service';

/**
 * Transforms a flat array of joined layout/element data into a nested structure.
 * Groups elements by layout_id and creates layout objects with associated elements.
 * @param {Array<Object>} rows - The flat array of rows returned from the API with joined layout/element data.
 * @returns {Array<Object>} - Array of layouts with their elements.
 */
function processLayoutAndElements(rows) {
  const layoutsMap = new Map();

  rows.forEach(row => {
    const layoutId = row.layout_id;

    if (!layoutsMap.has(layoutId)) {
      layoutsMap.set(layoutId, {
        id: layoutId,
        layout_id: layoutId,
        name: row.name || 'Unbenanntes Layout',
        backgroundColor: row.backgroundColor || 'white',
        elements: []
      });
    }

    if (row.element_id) {
      const layout = layoutsMap.get(layoutId);
      const element = {
        id: row.element_id,
        type: row.typ,
        x: parseFloat(row.pos_x) || 0,
        y: parseFloat(row.pos_y) || 0,
        w: parseFloat(row.size_x) || 50,
        h: parseFloat(row.size_y) || 50,
        content: row.uri,
        source: row.source,
        style: row.style || { color: 'black' }
      };
      layout.elements.push(element);
    }
  });

  return Array.from(layoutsMap.values());
}

/**
 * Fetches all layouts from the API and processes them into a nested structure.
 * @returns {Promise<Array<Object>>} - Array of processed layouts with their elements.
 * @throws {Error} - If the API call fails.
 */
async function loadAllLayouts() {
  try {
    const data = await ApiService.getAllLayouts();
    return processLayoutAndElements(data);
  } catch (error) {
    console.error('Fehler beim Laden der Layouts:', error);
    throw error;
  }
}

export default {
  processLayoutAndElements,
  loadAllLayouts
};
