<template>
  <div class="layout-editor">
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
          <!-- 
          Logik für drag/resize: im Template mit Inline-Funktionen
          Werte werden direkt updated: @drag-end und @resize-end aktualisieren item.x, item.y, item.w, item.h
          -->
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

    <!--Save Button-->
    <button @click="saveTemplate" class="save-btn-fixed">Template Speichern</button>

  </div>
</template>

<script>
import { ref } from 'vue';
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
    const scale = 3; //Skalierung
    const cardElements = ref([]); //Array aller Elemente 
    const selectedElement = ref(null); //Ausgewähltes Element
    const canvasBgColor = ref('white'); //Canvas Background

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

    //fields to display {key: Claim-Namen from Token, label: Label in UI}
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

    const measureTextSize = (text, fontSize, fontFamily = 'Dosis') => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `${fontSize}px ${fontFamily}`;
      const metrics = context.measureText(text);
      const width = metrics.width;
      const height = fontSize; // grobe Annahme für Höhe
      return { width, height };
    };

    //Logik zum Hinzufügen von Elementen
    const addElementToCanvas = (type, content = '') => {
      let w = 50 * scale;
      let h = 50 * scale;

      // nur für Text: w und h auf Textgröße setzen und 1.5x größer spawnen
      if(type === 'text'){
        const size = measureTextSize(userProfile[content] || content, 16, 'Dosis');
        w = (size.width + 20) * 1.5;   // Text-Breite + Padding, 50% größer
        h = (size.height + 10) * 1.5;  // Text-Höhe + Padding, 50% größer
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
        style: { color: canvasBgColor.value === 'black' ? 'white' : 'black' } // Kontrast zur Canvas Farbe
      };
      cardElements.value.push(newElement);
    };

    //Switch-Anweisung für Unterscheidung nach 'type' 
    const elementComponent = (item) =>{ 
      switch (item.type){ 
        case 'rectangle': return RectangleElement; 
        case 'circle': return CircleElement; 
        case 'triangle': return TriangleElement; 
        case 'text': return TextElement; 
        default: console.warn(`Unbekanter Elementtyp: ${type}`);
      }
    };

    //Test
    //Beispiel für Speichern
    const saveTemplate = async () => {
      const layoutData = {
        elements: cardElements.value,
        backgroundColor: canvasBgColor.value,
      };

      console.log('--- Speichere Layout ---');
      console.log(JSON.stringify(layoutData, null, 2));

      try {
        await ApiService.insertLayout(layoutData);
        alert('Layout erfolgreich gespeichert!');
      } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert(`Fehler beim Speichern: ${error.message}`);
      }
    };

    //Handler für Toolbox add-element Event
    const handleAddElement = (payload) => {
      addElementToCanvas(payload.type, payload.content);
    };

    //Handler für Element-Auswahl
    const selectElement = (item) => {
      selectedElement.value = item;
    };

    //Handler für Element-Update vom PropertyEditor
    const updateElement = (updatedItem) => {
      const idx = cardElements.value.findIndex(el => el.id === updatedItem.id);
      if (idx !== -1) {
        cardElements.value[idx] = updatedItem;
        selectedElement.value = updatedItem; // Aktualisiere auch die Auswahl
      }
    };

    //Handler für Element-Löschen
    const deleteElement = (id) => {
      const idx = cardElements.value.findIndex(el => el.id === id);
      if (idx !== -1) {
        cardElements.value.splice(idx, 1);
        selectedElement.value = null; // Deselektiere nach Löschen
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

    return {
      scale, 
      userProfile, 
      dynamicTextOptions, 
      cardElements, 
      selectedElement,
      canvasBgColor,
      addElementToCanvas, 
      elementComponent, 
      saveTemplate,
      handleAddElement,
      selectElement,
      updateElement,
      deleteElement,
      updateCanvasBg
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
  align-items: center; /* Toolbox und Canvas vertikal zentrieren */
  margin-top: 20px; /* Fügt eine visuelle Trennung zum Header hinzu */
  padding: 0 20px; /* Abstand zum Seitenrand */
  min-height: calc(100vh - 220px); /* genug Höhe für vertikale Zentrierung */
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
  justify-content: center; /* horizontal zentrieren */
  align-items: center; /* vertical zentrieren */
  padding: 30px 0;
  min-width: 0; /* verhindert Überlauf in flexbox */
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

/* Ausgewähltes Element hervorheben */
.selected {
  outline: 2px solid #007bff !important;
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
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
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