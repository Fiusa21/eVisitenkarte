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

      <div>
        <button @click="saveTemplate">Speichern</button>
      </div>

      <div class="canvas-container">
        <div class="canvas">

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
            @dragging="(x, y) => handleDragResize(item, { x, y })"
            @drag-end="(pos) => handleDragResize(item, pos)"
            @resize-end="(pos) => handleDragResize(item, pos)"
          >
            <component :is="elementComponent(item)" :item="item" :user-profile="userProfile"/>
            
          </Vue3DraggableResizable>
          
        </div>
      </div>
    </div>

  </div>
</template>

<script>
//TODO: Raspberry PI Connection
import { ref } from 'vue';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';

import RectangleElement from '../elements/RectangleElement.vue'; 
import CircleElement from '../elements/CircleElement.vue'; 
import TriangleElement from '../elements/TriangleElement.vue'; 
import TextElement from '../elements/TextElement.vue';
import ToolBox from '../components/ToolBox.vue';

export default {
  name: 'layout-editor',
  components: {
    Vue3DraggableResizable,
    ToolBox
  },
  setup(){
    const scale = 3;
    //simulierte Nutzerdaten
    const userProfile = {
      first_name: 'Max',
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

    const cardElements = ref([]);

    const measureTextSize = (text, fontSize = 16, fontFamily = 'Dosis') => {
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
        style: {}
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

    //Logik für drag/resize (Verbessert)
    const handleDragResize = (item, pos) => {
      const idx = cardElements.value.findIndex(i => i.id === item.id);
      if (idx === -1) return;

      const el = cardElements.value[idx];

      const nx = typeof pos.x === 'number' ? pos.x : el.x;
      const ny = typeof pos.y === 'number' ? pos.y : el.y;
      const nw = typeof pos.w === 'number' ? pos.w : el.w;
      const nh = typeof pos.h === 'number' ? pos.h : el.h;

      el.x = nx;
      el.y = ny;
      el.w = nw;
      el.h = nh;

      console.log("Update:", nx, ny, nw, nh);
    };

    //Beispiel für Speichern (Später API Call)
    const saveTemplate = () => {
      console.log('--- Template-Daten zur Speicherung ---');
      console.log(JSON.stringify(cardElements.value, null, 2));
      console.log('--- Ende Template-Daten ---');
    };

    //Handler für Toolbox add-element Event
    const handleAddElement = (payload) => {
      addElementToCanvas(payload.type, payload.content);
    };

    //TODO: Hinzufügen/Entfernen von elementen

    return {
      scale, 
      userProfile, 
      dynamicTextOptions, 
      cardElements, 
      addElementToCanvas, 
      elementComponent, 
      handleDragResize, 
      saveTemplate,
      handleAddElement
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
  /* For draggable items */
  position: relative;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;  
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