<template>
  <div class="toolbox">
    <div class="tabs">
      <button @click="activeTab = 'text'" :class="{ 'active-tab': activeTab === 'text' }">Nutzer Daten</button>
      <button @click="activeTab = 'shapes'" :class="{ 'active-tab': activeTab === 'shapes' }">Formen</button>
    </div>

    <div v-if="activeTab === 'text'" class="tab-content data-options">
      <button
        v-for="option in dynamicTextOptions"
        :key="option.key"
        @click="$emit('add-element', { type: 'text', content: option.key })"
        class="toolbox-btn dynamic-btn"
      >
        {{ option.label }} ({{ userProfile[option.key] }})
      </button>

      <button @click="$emit('add-element', { type: 'text', content: 'Ihr Text' })" class="toolbox-btn static-btn">
        + Individueller Text
      </button>
    </div>

    <div v-if="activeTab === 'shapes'" class="tab-content data-options">
      <button @click="$emit('add-element', { type: 'rectangle' })" class="toolbox-btn shape-btn">Rechteck</button>
      <button @click="$emit('add-element', { type: 'circle' })" class="toolbox-btn shape-btn">Kreis</button>
      <button @click="$emit('add-element', { type: 'triangle' })" class="toolbox-btn shape-btn">Dreieck</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ToolBox",
  props: {
    userProfile: Object,
    dynamicTextOptions: Array
  },
  emits: ['add-element'],
  setup() {
    const activeTab = ref("text");
    return { activeTab };
  }
};
</script>
<style scoped>
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

</style>