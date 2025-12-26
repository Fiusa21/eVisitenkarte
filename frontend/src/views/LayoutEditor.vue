<template>
  <div class="layout-editor">
    <!-- Modal für neues Layout -->
    <div v-if="showNameModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Neues Layout erstellen</h2>
        <p>Bitte gib einen Namen für das neue Layout ein:</p>
        <input 
          v-model="layoutName" 
          type="text" 
          class="layout-name-input" 
          placeholder="z.B. Layout Merketing, etc."
          @keyup.enter="confirmLayoutName"
          autofocus
        />
        <div class="modal-actions">
          <button @click="confirmLayoutName" class="btn-confirm">Bestätigen</button>
        </div>
      </div>
    </div>

    <div class="site-header">
      <div class="header-content">
        <h1>uxitra GmbH</h1>
        <p>eVisitenkarten Editor</p>
      </div>
    </div>

    <div class="editor-main-content">
      <ToolBox 
        :user-profile="userProfile"
        :dynamic-text-options="dynamicTextOptions"
        @add-element="handleAddElement"
      />

      <div class="canvas-container">
        <div class="canvas" :style="{ backgroundColor: canvasBgColor }">
          <!-- Logik für drag/resize -->
          <Vue3DraggableResizable
            v-for="item in cardElements"
            :key="item.id"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :minW="10"
            :minH="10"
            :parent="true"
            :class="{ 'selected': selectedElement && selectedElement.id === item.id }"
            @click="selectElement(item)"
            @drag-end="(pos) => {item.x = pos.x; item.y = pos.y;}" 
            @resize-end="(pos) => {item.x = pos.x; item.y = pos.y; item.w = pos.w; item.h = pos.h;}"
          >
            <!-- Rendert die Elementkomponente-->
            <component :is="elementComponent(item)" :item="item" :user-profile="userProfile"/>
            
          </Vue3DraggableResizable>
          
        </div>
      </div>

      <PropertyEditor
        :selected-element="selectedElement"
        :canvas-bg-color="canvasBgColor"
        @update-element="updateElement"
        @delete-element="deleteElement"
        @update-canvas-bg="updateCanvasBg"
      />
    </div>

    <button @click="saveTemplate" class="save-btn-fixed">Template Speichern</button>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';

import RectangleElement from '../elements/RectangleElement.vue'; 
import CircleElement from '../elements/CircleElement.vue'; 
import TriangleElement from '../elements/TriangleElement.vue'; 
import TextElement from '../elements/TextElement.vue';
import ToolBox from '../components/ToolBox.vue';
import PropertyEditor from '../components/PropertyEditor.vue';
import ApiService from '../services/api-service.js';

export default {
  name: 'layout-editor',
  components: {
    Vue3DraggableResizable,
    ToolBox,
    PropertyEditor
  },
  setup(){
    const scale = 3;
    const cardElements = ref([]);
    const selectedElement = ref(null);
    const canvasBgColor = ref('white');
    const layoutName = ref('');
    const showNameModal = ref(false);
    const layoutId = ref(null); // Wird beim Erstellen des Layouts vom Backend gesetzt
    const route = useRoute();

    //simulierte Nutzerdaten
    const userProfile = {
      first_name: 'Maximilian',
      last_name: 'Mustermann',
      company: 'uxitra GmbH',
      title: 'Software Entwickler',
      email: 'mamu01@example.de',
      phone_number: '07161 14009',
      mobile_number: '+49 1525 2864577',
      adress: 'Beispielstraße 12, 12345 Musterstadt'
    };

    //Textfelder inhalte
    const dynamicTextOptions = ([
      { key: 'first_name', label: 'Vorname'},
      { key: 'last_name', label: 'Nachname'},
      { key: 'company', label: 'Firma'},
      { key: 'title', label: 'Titel'},
      { key: 'email', label: 'E-Mail'},
      { key: 'phone_number', label: 'Telefon'},
      { key: 'mobile_number', label: 'Mobil'},
      { key: 'adress', label: 'Adresse' }
    ]);

    //Messung Textgröße
    const measureTextSize = (text, fontSize, fontFamily = 'Dosis') => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `${fontSize}px ${fontFamily}`;
      const metrics = context.measureText(text);
      const width = metrics.width;
      const height = fontSize;
      return { width, height };
    };

    //Logik zum Hinzufügen von Elementen
    const addElementToCanvas = (type, content = '') => {
      let w = 50 * scale;
      let h = 50 * scale;

      if(type === 'text'){
        const size = measureTextSize(userProfile[content] || content, 16, 'Dosis');
        w = (size.width + 20) * 1.5;
        h = (size.height + 10) * 1.5;
      }
      
      let newElement = {
        id: Date.now(),
        type: type,

        //Position bestimmen
        x: 50 * scale + (cardElements.value.length * 10),
        y: 50 * scale + (cardElements.value.length * 10),
        w: w,
        h: h,
        content: content,
        source: content in userProfile ? 'dynamic' : 'static',
        style: { color: canvasBgColor.value === 'black' ? 'white' : 'black' }
      };
      cardElements.value.push(newElement);
    };

    //Switch Anweisung für Type
    const elementComponent = (item) =>{ 
      switch (item.type){ 
        case 'rectangle': return RectangleElement; 
        case 'circle': return CircleElement; 
        case 'triangle': return TriangleElement; 
        case 'text': return TextElement; 
        default: console.warn(`Unbekanter Elementtyp: ${type}`);
      }
    };

    // Layout aktualisieren
    const saveTemplate = async () => {
      if (!layoutId.value) {
        alert('Bitte erstellen Sie zunächst ein Layout mit einem Namen!');
        return;
      }

      const layoutData = {
        layout_id: layoutId.value,
        name: layoutName.value,
        elements: cardElements.value,
        backgroundColor: canvasBgColor.value,
      };

      console.log('--- Aktualisiere Layout ---');
      console.log(JSON.stringify(layoutData, null, 2));

      try {
        await ApiService.updateLayout(layoutData);
        alert('Layout erfolgreich aktualisiert!');
      } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert(`Fehler beim Speichern: ${error.message}`);
      }
    };

    //Handler für Toolbox addElement Event
    const handleAddElement = (payload) => {
      addElementToCanvas(payload.type, payload.content);
    };

    //Handler für selectedElement
    const selectElement = (item) => {
      selectedElement.value = item;
    };

    //Handler für updateElement
    const updateElement = (updatedItem) => {
      const idx = cardElements.value.findIndex(el => el.id === updatedItem.id);
      if (idx !== -1) {
        cardElements.value[idx] = updatedItem;
        selectedElement.value = updatedItem;
      }
    };

    //Handler für deleteElement
    const deleteElement = (id) => {
      const idx = cardElements.value.findIndex(el => el.id === id);
      if (idx !== -1) {
        cardElements.value.splice(idx, 1);
        selectedElement.value = null;
      }
    };

    //Handler für Canvas Hintergrundfarbe
    const updateCanvasBg = (color) => {
      canvasBgColor.value = color;

      const contrastColor = color === 'black' ? 'white' : 'black';
      cardElements.value.forEach(element => {
        if (element.style) {
      element.style.color = contrastColor;
        }
      });
    };

    // Prüfe beim Laden ob neues Layout (ohne ID) oder existierendes Layout (mit ID)
    onMounted(async () => {
      const layoutIdFromRoute = route.params.id;
      if (!layoutIdFromRoute) {
        // Kein ID-Parameter = neues Layout → Modal anzeigen
        showNameModal.value = true;
      } else {
        // Mit ID-Parameter = existierendes Layout laden
        console.log('Lade existierendes Layout mit ID:', layoutIdFromRoute);
        try {
          // Lade alle Layouts und filter nach der gewünschten ID
          const allLayoutsData = await ApiService.getAllLayouts();
          
          // Gruppiere Elemente nach layout_id
          const layoutsMap = new Map();
          allLayoutsData.forEach(row => {
            const id = row.layout_id;
            if (!layoutsMap.has(id)) {
              layoutsMap.set(id, {
                layout_id: id,
                name: row.name,
                backgroundColor: row.backgroundcolor || 'white',
                elements: []
              });
            }
            
            if (row.element_id) {
              const layout = layoutsMap.get(id);
              layout.elements.push({
                id: row.element_id,
                type: row.typ,
                x: parseFloat(row.pos_x) || 0,
                y: parseFloat(row.pos_y) || 0,
                w: parseFloat(row.size_x) || 50,
                h: parseFloat(row.size_y) || 50,
                content: row.uri,
                source: row.source,
                style: row.style || { color: 'black' }
              });
            }
          });
          
          // Finde das gesuchte Layout
          const layoutData = layoutsMap.get(layoutIdFromRoute);
          
          if (!layoutData) {
            throw new Error(`Layout mit ID ${layoutIdFromRoute} nicht gefunden`);
          }
          
          console.log('Layout-Daten vom Backend:', layoutData);
          
          // Lade die Daten
          layoutId.value = layoutData.layout_id;
          layoutName.value = layoutData.name || '';
          cardElements.value = layoutData.elements || [];
          canvasBgColor.value = layoutData.backgroundColor || 'white';
          
          console.log('Layout erfolgreich geladen mit ID:', layoutId.value, 'Name:', layoutName.value, 'Elemente:', cardElements.value.length);
        } catch (error) {
          console.error('Fehler beim Laden des Layouts - Full Error:', error);
          console.error('Error Message:', error.message);
          console.error('Error Stack:', error.stack);
          alert(`Fehler beim Laden des Layouts: ${error.message || 'Unbekannter Fehler'}`);
        }
      }
    });

    // Modal bestätigen
    const confirmLayoutName = async () => {
      if (layoutName.value.trim() === '') {
        alert('Bitte gib einen Layout-Namen ein!');
        return;
      }

      const layoutData = {
        name: layoutName.value,
        backgroundColor: canvasBgColor.value,
        elements: []
      };

      try {
        const response = await ApiService.insertLayout(layoutData);
        // Backend sollte die neue layout_id in der Response zurückgeben
        layoutId.value = response.layout_id || response.id || response;
        showNameModal.value = false;
        console.log('Layout erstellt mit ID:', layoutId.value);
        console.log('Willkommen! Du kannst jetzt Elemente hinzufügen und speichern.');
      } catch (error) {
        console.error('Fehler beim Erstellen des Layouts:', error);
        alert(`Fehler beim Erstellen des Layouts: ${error.message}`);
      }
    };

    return {
      scale, 
      userProfile, 
      dynamicTextOptions, 
      cardElements, 
      selectedElement,
      canvasBgColor,
      layoutName,
      showNameModal,
      addElementToCanvas, 
      elementComponent, 
      saveTemplate,
      handleAddElement,
      selectElement,
      updateElement,
      deleteElement,
      updateCanvasBg,
      confirmLayoutName
    }
  }
}

</script>

<style scoped>
/*
TODO: Medie queries für alle Bildschirmgrößen 
*/

.layout-editor {
  display: flex;
  flex-direction: column; 
  align-items: center;
  width: 100%;
}

.editor-main-content {
  display: flex;
  width: 100%;
  max-width: 1400px;
  gap: 30px;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px;
  min-height: calc(100vh - 220px);
}

.site-header{
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center; 
  padding-top: 20px;
  padding-bottom: 50px;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.site-header h1{
  font-size: 5em;
  font-family: 'Dosis', sans-serif;
  font-weight: 500;
  margin: 0;
  padding: 0;
  line-height: 1;  
}

.site-header p{
  font-size: 1.5em;
  font-family: 'Dosis', sans-serif;
  font-weight: 300;
  margin: 0;
  padding: 0;
  margin-top: -5px;
}

.canvas-container{
  flex-grow: 1;
  display: flex;
  justify-content: center; 
  align-items: center;
  padding: 30px 0;
  min-width: 0;
}

.canvas{
  height: 384px;
  width: 888px;
  position: relative;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;  
  transition: background-color 0.3s;
}

.selected {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  z-index: 100;
}

.save-btn-fixed {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 14px 40px;
  background-color: #06c933;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-family: 'Dosis', sans-serif;
  z-index: 1000;
}

.save-btn-fixed:hover {
  background-color: #05b02d;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #2e2e2e;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  min-width: 400px;
  max-width: 500px;
  color: white;
  font-family: 'Dosis', sans-serif;
}

.modal-content h2 {
  margin: 0 0 15px 0;
  font-size: 1.8em;
  font-weight: 600;
  color: #4a9eff;
}

.modal-content p {
  margin: 0 0 25px 0;
  font-size: 1.1em;
  color: #ccc;
}

.layout-name-input {
  width: 100%;
  padding: 12px;
  font-size: 1.1em;
  border: 2px solid #555;
  border-radius: 6px;
  background: #1e1e1e;
  color: white;
  font-family: 'Dosis', sans-serif;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.layout-name-input:focus {
  outline: none;
  border-color: #4a9eff;
}

.modal-actions {
  margin-top: 25px;
  display: flex;
  justify-content: center;
}

.btn-confirm {
  padding: 10px 30px;
  font-size: 1.1em;
  font-weight: 600;
  background: #4a9eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Dosis', sans-serif;
}

.btn-confirm:hover {
  background: #3a8fef;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.4);
}

.card-element{
  cursor: grab;
  padding: 5px;
  box-sizing: border-box;
  text-align: left;
  background-color: white;
}

.card-element-text{
  font-family: 'Dosis', sans-serif;
  white-space: nowrap;
}

.card-element-rectangle{
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: black;
}
</style>