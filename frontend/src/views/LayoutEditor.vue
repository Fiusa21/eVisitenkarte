<template>
  <div class="layout-editor">
    <div class="site-header">
      <div class="header-content">
        <h1>uxitra GmbH</h1>
        <p>eVisitenkarten Editor</p>
      </div>
    </div>

    <div class="editor-main-content">
      <div class="toolbox">
        <div class="tabs">
          <button @click="activeTab = 'text'" :class="{ 'active-tab': activeTab === 'text' }">Texte & Daten</button>
          <button @click="activeTab = 'shapes'" :class="{ 'active-tab': activeTab === 'shapes' }">Formen</button>
        </div>

        <div v-if="activeTab === 'text'" class="tab-content data-options">
          <h2>Nutzer Daten</h2>
          <button
            v-for="option in UserData"
            :key="option.key"
            @click="addElementToCanvas('text', option.key)"
            class="toolbox-btn dynamic-btn"
          >
            {{ option.label }} ({{ userProfile[option.key] }})
          </button>

          <h2>Statischer Text</h2>
          <button @click="addElementToCanvas('text', 'Ihr Text')" class="toolbox-btn static-btn">
            Individueller Text
          </button>
        </div>

        <div>
          <h2>Geometrische Formen</h2>
          <button @click="addElementToCanvas('rectangle')" class="toolbox-btn shape-btn">Rechteck</button>
          <button @click="addElementToCanvas('circle')" class="toolbox-btn shape-btn">Kreis (Form)</button>
          <button @click="addElementToCanvas('triangle')" class="toolbox-btn shape-btn">Dreieck (Form)</button>
        </div>
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
            :draggable="true"
            :resizable="true"
            :parent="true"
            @dragging="(l, t) => handleDragResize(item, { x: l, y: t, w: item.w, h: item.h })"
            @drag-stop="(l, t) => handleDragResize(item, { x: l, y: t, w: item.w, h: item.h })"
            @resizing="(l, t, w, h) => handleDragResize(item, { x: l, y: t, w: w, h: h })"
            @resize-stop="(l, t, w, h) => handleDragResize(item, { x: l, y: t, w: w, h: h })"
            @drag-end="(l, t) => handleDragResize(item, { x: l, y: t, w: item.w, h: item.h })"
            @resize-end="(l, t, w, h) => handleDragResize(item, { x: l, y: t, w: w, h: h })"
          >
            <div :class="`card-element card-element-${item.type}`" :style="item.style">
              {{ item.content }}
            </div>
            
          </Vue3DraggableResizable>
          
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';

export default {
  name: 'layout-editor',
  components: {
    Vue3DraggableResizable
  },
  setup(){
    const scale = 3;

    const cardElements = ref([
      {
        id: 1,
        type: 'text',
        content: 'Beispieltext',
        x: 50 * scale,
        y: 50 * scale,
        w: 80 * scale,
        h: 10 * scale,
        style: { fontSize: '14px', color: 'black' }
      },
      {
        id: 2,
        type: 'rectangle',
        content: 'black box',
        x: 100 * scale,
        y: 80 * scale,
        w: 90 * scale,
        h: 30 * scale,
        style: { color: 'black' }
      }
    ]);

    const handleDragResize = (item, {x, y, w, h}) => {
      //Suche index des Elements im Array
      const idx = cardElements.value.findIndex(i => i.id === item.id);
      
      //Wenn nicht gefunden, abbrechen
      if (idx === -1) return;

      //Zur sicherheit überprüfen
      // 1. falls null/undefined übergene wird, 
      // 2. x,y niemals negativ, für w,h mindestens 1 für resize
      // 3. x,y falls keine Zahl übergeben wird, alten Wert behalten
      const nx = typeof x === 'number' ? Math.max(0, x) : cardElements.value[idx].x;
      const ny = typeof y === 'number' ? Math.max(0, y) : cardElements.value[idx].y;
      const nw = typeof w === 'number' ? Math.max(1, w) : cardElements.value[idx].w;
      const nh = typeof h === 'number' ? Math.max(1, h) : cardElements.value[idx].h;

      //Reaktivitätsproblem umgehen
      //1. altes Objekt kopieren und neue Werte zuweisen
      //2. .splice() verwendet um altes objekt zu ersetzen
      //3. Nicht nur Eigenschaften sondern ganzes Objekt wird ersetzt
      cardElements.value.splice(idx, 1, Object.assign({}, cardElements.value[idx], {
        x: nx,
        y: ny,
        w: nw,
        h: nh
      }));
    };

    //TODO: Hinzufügen/Entfernen von elementen

    return {
      cardElements,
      handleDragResize
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

.toolbox {
  width: 300px;
  background-color: #2e2e2e;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertikal zentrieren */
  align-items: stretch;
  margin-left: 0;
  max-height: calc(100vh - 160px);
  overflow: auto;
}

.tabs {
  display: flex;
  margin-bottom: 15px;
  border-bottom: 2px solid #444;
}

.tabs button {
  flex: 1;
  padding: 15px 10px;
  background-color: #3a3a3a;
  color: #bbb;
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-weight: 500;
}

.tabs button:hover {
  background-color: #444;
}

.tabs .active-tab {
  background-color: #007bff; /* Primärfarbe */
  color: white;
  border-bottom: 2px solid #007bff;
}

.tab-content {
  padding: 0 20px;
}
.tab-content h2 {
  font-size: 1.1em;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #ccc;
}
.toolbox-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s, transform 0.1s;
}

.dynamic-btn {
  background-color: #1e88e5; /* Blau */
  color: white;
}
.dynamic-btn:hover {
  background-color: #1565c0;
  transform: translateY(-1px);
}

.static-btn {
  background-color: #5cb85c; /* Grün */
  color: white;
}
.static-btn:hover {
  background-color: #4cae4c;
}

.shape-btn {
  background-color: #ff9800; /* Orange */
  color: #333;
}
.shape-btn:hover {
  background-color: #fb8c00;
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
  border: 1px dashed #ccc;
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