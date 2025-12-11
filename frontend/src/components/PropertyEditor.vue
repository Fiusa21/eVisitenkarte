<template>
  <div class="property-editor">
    <h3>Eigenschaften</h3>

    <!-- Canvas Hintergrundfarbe -->
    <div class="property-section">
      <label>Canvas Hintergrund</label>
      <div class="color-picker">
        <button 
          @click="$emit('update-canvas-bg', 'white')"
          :class="{ active: canvasBgColor === 'white' }"
          class="color-btn white"
        >
          Weiß
        </button>
        <button 
          @click="$emit('update-canvas-bg', 'black')"
          :class="{ active: canvasBgColor === 'black' }"
          class="color-btn black"
        >
          Schwarz
        </button>
      </div>
    </div>

    <div v-if="!selectedElement" class="no-selection">
      <p>Kein Element ausgewählt</p>
      <p class="hint">Klicke auf ein Element im Canvas, um es zu bearbeiten</p>
    </div>

    <!-- Element Spezifische Properties -->
    <div v-else class="element-properties">
      <div class="property-section">
        <label>Element-Typ</label>
        <p class="element-type">{{ elementTypeLabel }}</p>
      </div>

      <!-- Text Input für statische Text-Elemente -->
      <div v-if="selectedElement.type === 'text' && selectedElement.source === 'static'" class="property-section">
        <label>Text bearbeiten</label>
        <input 
          type="text" 
          :value="selectedElement.content"
          @input="$emit('update-element', { ...selectedElement, content: $event.target.value })"
          class="text-input"
          placeholder="Text eingeben..."
        />
      </div>

      <!-- Info für dynamische Text Elemente -->
      <div v-if="selectedElement.type === 'text' && selectedElement.source === 'dynamic'" class="property-section">
        <label>Datenfeld</label>
        <p class="dynamic-info">{{ selectedElement.content }} (dynamisch)</p>
      </div>

      <!-- Farbe ändern (Shapes und Text) -->
      <div class="property-section">
        <label>Farbe</label>
        <div class="color-picker">
          <button 
            @click="updateColor('black')"
            :class="{ active: currentColor === 'black' }"
            class="color-btn black"
          >
            Schwarz
          </button>
          <button 
            @click="updateColor('white')"
            :class="{ active: currentColor === 'white' }"
            class="color-btn white"
          >
            Weiß
          </button>
        </div>
      </div>

      <!-- Position und Größe -->
      <div class="property-section">
        <label>Position & Größe</label>
        <div class="info-grid">
          <div class="info-item">
            <span>X:</span> {{ Math.round(selectedElement.x) }}px
          </div>
          <div class="info-item">
            <span>Y:</span> {{ Math.round(selectedElement.y) }}px
          </div>
          <div class="info-item">
            <span>Breite:</span> {{ Math.round(selectedElement.w) }}px
          </div>
          <div class="info-item">
            <span>Höhe:</span> {{ Math.round(selectedElement.h) }}px
          </div>
        </div>
      </div>

      <!-- Löschen Button -->
      <div class="property-section">
        <button @click="$emit('delete-element', selectedElement.id)" class="delete-btn">
          Element löschen
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PropertyEditor",
  props: {
    selectedElement: {
      type: Object,
      default: null
    },
    canvasBgColor: {
      type: String,
      default: 'white'
    }
  },
  emits: ['update-element', 'delete-element', 'update-canvas-bg'],
  computed: {
    elementTypeLabel() {
      if (!this.selectedElement) return '';
      const types = {
        text: 'Text',
        rectangle: 'Rechteck',
        circle: 'Kreis',
        triangle: 'Dreieck'
      };
      return types[this.selectedElement.type] || this.selectedElement.type;
    },
    currentColor() {
      if (!this.selectedElement || !this.selectedElement.style) return 'black';
      return this.selectedElement.style.color || 'black';
    }
  },
  methods: {
    updateColor(color) {
      if (!this.selectedElement) return;
      
      const updatedElement = {
        ...this.selectedElement,
        style: {
          ...this.selectedElement.style,
          color: color
        }
      };
      
      this.$emit('update-element', updatedElement);
    }
  }
};
</script>

<style scoped>
.property-editor {
  width: 280px;
  background-color: #2e2e2e;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.property-editor h3 {
  margin: 0;
  font-size: 1.3em;
  color: #fff;
  border-bottom: 2px solid #444;
  padding-bottom: 10px;
}

.property-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.property-section label {
  font-size: 0.9em;
  font-weight: 600;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.no-selection {
  text-align: center;
  padding: 40px 20px;
  color: #888;
}

.no-selection p {
  margin: 5px 0;
}

.hint {
  font-size: 0.85em;
  font-style: italic;
}

.element-type {
  background-color: #3a3a3a;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 0;
  color: #fff;
  font-weight: 500;
}

.text-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #3a3a3a;
  color: #fff;
  font-size: 1em;
  font-family: 'Dosis', sans-serif;
}

.text-input:focus {
  outline: none;
  border-color: #007bff;
}

.dynamic-info {
  background-color: #1e88e5;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 0;
  color: #fff;
  font-size: 0.9em;
}

.color-picker {
  display: flex;
  gap: 10px;
}

.color-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  font-family: 'Dosis', sans-serif;
}

.color-btn.white {
  background-color: #fff;
  color: #000;
}

.color-btn.black {
  background-color: #000;
  color: #fff;
  border-color: #444;
}

.color-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.color-btn.active {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.info-item {
  background-color: #3a3a3a;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 0.9em;
}

.info-item span {
  color: #aaa;
  font-weight: 600;
}

.delete-btn {
  width: 100%;
  padding: 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1em;
  transition: background-color 0.2s;
  font-family: 'Dosis', sans-serif;
}

.delete-btn:hover {
  background-color: #c82333;
}
</style>
