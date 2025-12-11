const { get } = require('../routes/api-routes');
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

module.exports = {
  getAllLayouts: async () => {
    const result = await db.executeQuery(getKeys.select);
    return result;
  },

  getLayoutById: async (id) => {
    const result = await db.executeQuery(getKeys.selectByID, [id]);
    return result;
  },

    insertLayout: async (layout) => {
        const { erstelldatum, user_id_ersteller, name } = layout;

        const res = await db.executeQuery(getKeys.insertLayout, [erstelldatum, user_id_ersteller, name]);
        // DEBUG: Uncomment this to see exactly what the DB returns
        console.log("Database Result:", res);
        //NOTE: access Layout_id from the autoincrement out of the query return!!!
        return res[0].layout_id;
    },

    insertElement: async (element) => {
        const {
            element_id, typ, uri, layout_id,
            pos_x, pos_y, size_x, size_y,
            source, style
        } = element;

        await db.executeQuery(getKeys.insertElement, [
            element_id, typ, uri, layout_id,
            pos_x, pos_y, size_x, size_y,
            source, style
        ]);
    },
//TODO: TRANSACTION
//HELPER FUNCTION TO MAP THE ELEMENTS IN THE ARRAY
    saveLayoutWithElements: async (layoutData, elementsArray) => {

        // 1. Capture the returned ID into a variable
        const newLayoutId = await module.exports.insertLayout(layoutData);

        //DEBUG
        console.log("Created Layout ID:", newLayoutId); // Debug check

        if (elementsArray && elementsArray.length > 0) {
            for (const el of elementsArray) {

                const elementToSave = {
                    layout_id: newLayoutId,             // <--- HERE IS THE FIX
                    element_id: el.id,
                    typ: el.type,
                    uri: el.content,
                    pos_x: el.x,
                    pos_y: el.y,
                    size_x: el.w,
                    size_y: el.h,
                    source: el.source,
                    style: JSON.stringify(el.style)
                };

                await module.exports.insertElement(elementToSave);
            }
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