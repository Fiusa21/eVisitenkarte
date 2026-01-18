const db = require('../services/db-service');


const getKeys = {
   
    select: 'SELECT * FROM layouts LEFT JOIN elements ON layouts.layout_id = elements.layout_id',
    selectByID:'SELECT * FROM layouts LEFT JOIN elements ON layouts.layout_id = elements.layout_id WHERE layouts.layout_id = $1',
    insertLayout:'INSERT INTO layouts (erstelldatum, user_id_ersteller, name) VALUES ($1, $2, $3) RETURNING layout_id;',
    insertElement: 'INSERT INTO elements (element_id, typ, uri, layout_id, pos_x, pos_y, size_x, size_y, source, style) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    updateLayout: 'UPDATE layouts SET erstelldatum = $2, user_id_ersteller = $3, name = $4 WHERE layout_id = $1',
    updateElement: 'UPDATE elements SET element_id = $1, typ = $3, uri = $4, pos_x = $5, pos_y = $6, size_x = $7, size_y = $8 WHERE layout_id = $2',
    deleteLayout: 'DELETE FROM layouts WHERE layout_id = $1',
    deleteElement: 'DELETE FROM elements WHERE layout_id = $1',
};

//INTERNAL HELPER
async function _insertElementsInternal(client, layoutId, elementsArray) {
    if (!elementsArray || elementsArray.length === 0) return;
    for (const el of elementsArray) {
        await client.query(getKeys.insertElement, [
            el.id, el.type, el.content, layoutId,
            el.x, el.y, el.w, el.h, el.source, JSON.stringify(el.style)
        ]);
    }
}

module.exports = {
    getAllLayouts: async () => {
        const result = await db.executeQuery(getKeys.select);
        return result;
    },

    getLayoutById: async (id) => {
        const result = await db.executeQuery(getKeys.selectByID, [id]);
        return result;
    },


    createLayoutWithElements: async (layoutData, elementsArray) => {
        const client = await db.pool.connect(); // Get a client from the pool
        try {
            await client.query('BEGIN'); // Start Transaction


            const res = await client.query(getKeys.insertLayout, [
                layoutData.erstelldatum,
                layoutData.user_id_ersteller,
                layoutData.name
            ]);


            const newLayoutId = res.rows[0].layout_id;


            await _insertElementsInternal(client, newLayoutId, elementsArray);

            await client.query('COMMIT');
            return newLayoutId;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release(); // Return client to pool
        }
    },

    updateLayoutWithElements: async (layoutData, elementsArray) => {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            await client.query(getKeys.updateLayout, [
                layoutData.id,
                layoutData.erstelldatum,
                layoutData.user_id_ersteller,
                layoutData.name
            ]);

            // 2. Clean slate: Delete all old elements for this layout
            await client.query(getKeys.deleteElement, [layoutData.id]);

            // 3. Re-insert the new set of elements
            await _insertElementsInternal(client, layoutData.id, elementsArray);

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

},



  updateLayout: async (layout) => {
    const { layout_id, erstelldatum, user_id_ersteller, name } = layout;
    await db.executeQuery(getKeys.updateLayout, [layout_id, erstelldatum, user_id_ersteller, name]);
  },

  updateElement: async (element) => {
    const { element_id, layout_id, typ, uri, pos_x, pos_y, size_x, size_y } = element;
    await db.executeQuery(getKeys.updateElement, [element_id, layout_id, typ, uri, pos_x, pos_y, size_x, size_y]);
  },    
  deleteLayout: async (id) => {
    await db.executeQuery(getKeys.deleteLayout, [id]);
  },

  deleteElement: async (id) => {
    await db.executeQuery(getKeys.deleteElement, [id]);
  }
};