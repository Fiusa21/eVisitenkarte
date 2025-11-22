<template>
  <div class="layout-editor">
    <div class="site-header">
      <div class="header-content">
        <h1>uxitra GmbH</h1>
        <p>eVisitenkarten Editor</p>
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
  padding: 30px 0;
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