const { get } = require('../routes/api-routes');
const db = require('../services/db-service');


const getKeys = {
   
    select: 'SELECT * FROM layouts LEFT JOIN elements ON layouts.layout_id = elements.layout_id',
    selectByID:'SELECT * FROM layouts LEFT JOIN elements ON layouts.layout_id = elements.layout_id WHERE layouts.layout_id = $1',
    insertLayout:'INSERT INTO layouts (layout_id, erstelldatum, user_id_ersteller, name) VALUES ($1, $2, $3, $4)',
    insertElement: 'INSERT INTO elements (element_id, layout_id, typ, uri, pos_x, pos_y, size_x, size_y, source, style) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
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
    const { layout_id, erstelldatum, user_id_ersteller, name } = layout;
    await db.executeQuery(getKeys.insertLayout, [layout_id, erstelldatum, user_id_ersteller, name]);
  },

    insertElement: async (element) => {
        const {
            element_id, layout_id, typ, uri,
            pos_x, pos_y, size_x, size_y,
            source, style
        } = element;

        await db.executeQuery(getKeys.insertElement, [
            element_id, layout_id, typ, uri,
            pos_x, pos_y, size_x, size_y,
            source, style
        ]);
    },

//HELPER FUNCTION TO MAP THE ELEMENTS IN THE ARRAY
saveLayoutWithElements: async (layoutData, elementsArray) => {
    //wait for layout header being inserted!!!
    await module.exports.insertLayout(layoutData);

    //loop elements and save them
    if (elementsArray && elementsArray.length > 0) {
        for (const el of elementsArray) {

            //frontend to db
            const elementToSave = {
                element_id: el.id,                  // Frontend: id
                layout_id: layoutData.layout_id,    // From Layout
                typ: el.type,                       // Frontend: type
                uri: el.content,                    // Frontend: content -> DB: uri
                pos_x: el.x,                        // Frontend: x
                pos_y: el.y,                        // Frontend: y
                size_x: el.w,                       // Frontend: w
                size_y: el.h,                       // Frontend: h
                source: el.source,                  // Frontend: source
                style: JSON.stringify(el.style)     // Frontend: style (convert Obj to String)
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