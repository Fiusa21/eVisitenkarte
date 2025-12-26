<template>
  <div class="admin-home">
    <div class="site-header">
      <div class="header-content">
        <h1>uxitra GmbH</h1>
        <p>eVisitenkarten Editor</p>
      </div>
    </div>
    <div class="layout-wrapper">
        <div class="layouts">
            <div
            v-for="layout in layouts"
            :key="layout.id"
            class="business-cards"
            @click="openLayout(layout.id)"
            >
              <div class="card-preview" :style="{ backgroundColor: layout.backgroundColor }">
                <div
                  v-for="element in layout.elements"
                  :key="element.id"
                  class="preview-element"
                  :style="{
                    position: 'absolute',
                    left: (element.x / 3) + 'px',
                    top: (element.y / 3) + 'px',
                    width: (element.w / 3) + 'px',
                    height: (element.h / 3) + 'px'
                  }"
                >
                  <component
                    :is="getElementComponent(element.type)"
                    :item="element"
                    :user-profile="userProfile"
                  />
                </div>
              </div>
            </div>
            <div class="add-layout" @click="createNewLayout">+</div>
        </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '@/services/api-service';
import TextElement from '@/elements/TextElement.vue';
import RectangleElement from '@/elements/RectangleElement.vue';
import CircleElement from '@/elements/CircleElement.vue';
import TriangleElement from '@/elements/TriangleElement.vue';

// Add logic here later, e.g., fetching user-specific data
export default {
  name: 'AdminHome',
  components: {
    TextElement,
    RectangleElement,
    CircleElement,
    TriangleElement
  },
  setup() {
    const router = useRouter();
    const layouts = ref([]);
    
    // Mock user profile für dynamische Text-Felder
    const userProfile = computed(() => ({
      first_name: 'Max',
      last_name: 'Mustermann',
      company: 'uxitra GmbH',
      title: 'Developer',
      email: 'max@example.de',
      phone_number: '07161 14009',
      mobile_number: '+49 1525 2864577',
      adress: 'Musterstraße 1'
    }));
    
    // Element-Komponente basierend auf Typ zurückgeben
    const getElementComponent = (type) => {
      switch (type) {
        case 'rectangle': return RectangleElement;
        case 'circle': return CircleElement;
        case 'triangle': return TriangleElement;
        case 'text': return TextElement;
        default: return null;
      }
    };

    // Lade Layouts von der Datenbank
    onMounted(async () => {
      try {
        const data = await ApiService.getAllLayouts();
        
        // Gruppiere Elemente nach layout_id
        const layoutsMap = new Map();
        
        data.forEach(row => {
          const layoutId = row.layout_id;
          
          if (!layoutsMap.has(layoutId)) {
            layoutsMap.set(layoutId, {
              id: layoutId,
              layout_id: layoutId,
              name: row.name || 'Unbenanntes Layout',
              backgroundColor: row.backgroundcolor || 'white',
              elements: []
            });
          }
          
          // Füge Element zum Layout hinzu
          if (row.element_id) {
            const layout = layoutsMap.get(layoutId);
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
        
        layouts.value = Array.from(layoutsMap.values());
        console.log('Layouts geladen:', layouts.value);
      } catch (error) {
        console.error('Fehler beim Laden der Layouts:', error);
      }
    });

    const openLayout = (id) => {
      console.log("Öffne Layout ID:", id);
      router.push({ name: 'layout-editor', params: { id } });
    };
    
    const createNewLayout = () => {
      console.log("Navigiere zum Editor für neues Layout");
      // Weiterleitung zum Editor ohne ID (löst das NameLayout-Modal aus)
      router.push({ name: 'layout-editor' });
    };


    return { 
      layouts, 
      userProfile,
      getElementComponent,
      openLayout,
      createNewLayout
    };
  }
}
</script>

<style scoped>
/*
TODO: Medie queries für alle Bildschirmgrößen 
*/

.site-header{
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

.layout-wrapper{
    max-width: 1024px;
    margin: 0 auto;
    margin-top: 25px;   
}

.layouts {
  flex-grow: 1; 
  display: flex;
  flex-wrap: wrap;
  gap:30px; 
  justify-content: flex-start; 
  align-items: center;
  max-height: auto; 
  max-width: 1024px;
  overflow-y: auto;
  padding: 0 30px;
  margin-top: 25px;
  padding-top: 10px;
}

.business-cards, .add-layout {
  width: 296px; 
  height: 128px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  font-size: 1.2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

.business-cards:hover, .add-layout:hover {
  transform: translateY(-8px); 
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}

.business-cards:active, .add-layout:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.business-cards {
  padding: 0;
  position: relative;
}

.card-preview {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.preview-element {
  position: absolute;
  pointer-events: none;
}

.add-layout {
  border: 2px dashed #666;
  background-color: rgba(168, 168, 168, 0.15);
  color: #333;
}

.add-layout:hover {
  background-color: rgba(168, 168, 168, 0.3);
  border-color: black;
  color: black;
}
</style>