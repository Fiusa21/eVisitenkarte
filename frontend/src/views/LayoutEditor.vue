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
          <button @click="activeTab = 'text'" :class="{ 'active-tab': activeTab === 'text' }">Nutzer Daten</button>
          <button @click="activeTab = 'shapes'" :class="{ 'active-tab': activeTab === 'shapes' }">Formen</button>
        </div>

        <div v-if="activeTab === 'text'" class="tab-content data-options">
          <button
            v-for="option in dynamicTextOptions"
            :key="option.key"
            @click="addElementToCanvas('text', option.key)"
            class="toolbox-btn dynamic-btn"
          >
            {{ option.label }} 
          </button>

          <button @click="addElementToCanvas('text', 'Ihr Text')" class="toolbox-btn static-btn">
            + Individueller Text
          </button>
        </div>

        

        <div v-if="activeTab === 'shapes'" class="tab-content data-optons">
          <button @click="addElementToCanvas('rectangle')" class="toolbox-btn shape-btn">Rechteck</button>
          <button @click="addElementToCanvas('circle')" class="toolbox-btn shape-btn">Kreis</button>
          <button @click="addElementToCanvas('triangle')" class="toolbox-btn shape-btn">Dreieck</button>
        </div>
      </div>

      <div>
        <button @click="saveTemplate" class="save-btn">Speichern</button>
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
            <div class="element-wrapper">

              <button class="delete-btn" @click.stop="removeElement(item.id)">✕</button>

              <div :class="`card-element card-element-${item.type}`" :style="item.style">
              {{ item.content }}
              </div>
            </div> 
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

export default {
  name: 'layout-editor',
  components: {
    Vue3DraggableResizable
  },
  setup(){
    const scale = 3;
    const activeTab = ref('text'); //Important for reactivity of Button in Toolbox

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

    //Beispiel für Speichern (Später API Call)
    const saveTemplate = () => {
      console.log('--- Template-Daten zur Speicherung ---');
      console.log(JSON.stringify(cardElements.value, null, 2));
      console.log('--- Ende Template-Daten ---');
    };

    //Logik zum Hinzufügen von Elementen
    const addElementToCanvas = (type, content = '') => {
      let newElement = {
        id: Date.now(),
        type: type,
        //Position bestimmen
        x: 50 * scale + (cardElements.value.length * 10),
        y: 50 * scale + (cardElements.value.length * 10),
        w: 50 * scale,
        h: 50 * scale,
        content: content,
        source: content in userProfile ? 'dynamic' : 'static',
        style: {}
      };

      //Switch-Anweisung für Unterscheidung nach 'type'
      switch (type){
        case 'text':
          newElement.w = 100 * scale;
          newElement.h = 10 * scale;
          newElement.style = { fontSize: '14px', color: 'black'};
          break;
        case 'rectangle':
          newElement.w = 80 * scale;
          newElement.h = 40 * scale;
          newElement.style = { backgroundColor: 'black' };
          break;
        case 'circle':
          newElement.w = 40 * scale;
          newElement.h = 40 * scale;
          newElement.style = { backgroundColor: 'black', borderRadius: '50%' }; //Kreis-Style
          break;
        case 'triangle':
          newElement.w = 50 * scale;
          newElement.h = 50 * scale;
          //Für Dreieck Css Dreieck Style
          newElement.style = { 
            backgroundColor: 'transparent', 
            borderBottom: `${40 * scale}px solid black`,
            borderLeft: `${20 * scale}px solid transparent`,
            borderRight: `${40 * scale}px solid transparent`,
            width: '0',
            height: '0'
          };
          newElement.content = ''; //Kein Inhalt für Dreieck
          break;
        default:
          console.warn(`Unbekanter Elementtyp: ${type}`);
      }
      cardElements.value.push(newElement);
    };

    //Logik zum Entfernen von Elementen
      const removeElement = (id) => {
      const index = cardElements.value.findIndex(el => el.id === id);
      if (index !== -1) cardElements.value.splice(index, 1);
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

    return {
      activeTab,
      userProfile,
      dynamicTextOptions,
      cardElements,
      removeElement,
      handleDragResize,
      addElementToCanvas,
      saveTemplate
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

.static-btn {
  background-color: #5cb85c;
  color: white;
}

.dynamic-btn:hover {
  background-color: #1565c0;
  transform: translateY(-1px);
}

.shape-btn {
  background-color: #ff9800; /* Orange */
  color: #333;
}
.shape-btn:hover {
  background-color: #fb8c00;
}

.delete-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border: none;
  background: #ff3b3b;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.delete-btn:hover {
  background: #d62828;
}

.element-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
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