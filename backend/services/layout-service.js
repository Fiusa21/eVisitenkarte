/**
 * Transforms a flat array of joined layout/element data into a nested structure.
 * @param {Array<Object>} rows - The flat array of rows returned from the joined DB query.
 * @returns {Array<Object>} - The nested array of layouts, each containing an array of elements.
 */
function processLayoutAndElements(rows) {
    const layoutsMap = new Map();

    rows.forEach(row => {
        const layoutId = row.layout_id;
        
        if (!layoutsMap.has(layoutId)) {
            layoutsMap.set(layoutId, {
                layout_id: layoutId,
                // Layout Metadata
                erstelldatum: row.erstelldatum,           // maps to DB column
                user_id_ersteller: row.user_id_ersteller,// maps to DB column
                name: row.name,                           // maps to DB column
                elements: [] // Array to hold all associated elements
            });
        }

        const layout = layoutsMap.get(layoutId);

        if (row.element_id !== null) {
            layout.elements.push({
                element_id: row.element_id,
                // Element Properties 
                type: row.typ,         // Mapped to 'type'
                uri: row.uri,
                position: {
                    x: row.pos_x,      // Mapped to position.x
                    y: row.pos_y       // Mapped to position.y
                },
                size: {
                    x: row.size_x,     // Mapped to size.x
                    y: row.size_y      // Mapped to size.y
                }
            });
        }
    });

    return Array.from(layoutsMap.values());
}

module.exports = { processLayoutAndElements };