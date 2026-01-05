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
            @click="openLayoutModal(layout)"
            >
              <div class="card-preview-wrapper">
                <div
                  class="card-preview"
                  :style="[ { backgroundColor: layout.backgroundColor }, getPreviewStyle(layout) ]"
                >
                  <div
                    v-for="element in layout.elements"
                    :key="element.id"
                    class="preview-element"
                    :style="{
                      position: 'absolute',
                      left: element.x + 'px',
                      top: element.y + 'px',
                      width: element.w + 'px',
                      height: element.h + 'px'
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
            </div>
            <div class="add-layout" @click="createNewLayout">+</div>
        </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedLayout" class="modal-overlay" @click="closeLayoutModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeLayoutModal">✕</button>
        
        <div
          class="modal-canvas"
          :style="{ backgroundColor: selectedLayout.backgroundColor }"
        >
          <div :style="getModalStyle(selectedLayout)">
            <div
              v-for="element in selectedLayout.elements"
              :key="element.id"
              class="modal-element"
              :style="{
                position: 'absolute',
                left: element.x + 'px',
                top: element.y + 'px',
                width: element.w + 'px',
                height: element.h + 'px'
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
        
        <div class="modal-info">
          <h3>{{ selectedLayout.name }}</h3>
          <div class="modal-buttons">
            <button class="btn-bearbeiten" @click="editLayout(selectedLayout.id)">Bearbeiten</button>
            <button class="btn-loeschen" @click="deleteLayoutConfirm(selectedLayout.id)">Löschen</button>
          </div>
        </div>
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
    const selectedLayout = ref(null);
    
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
    const getElementComponent = (element) => {
      const type = element.type || element;
      switch (type) {
        case 'rectangle': return RectangleElement;
        case 'circle': return CircleElement;
        case 'triangle': return TriangleElement;
        case 'text': return TextElement;
        default: return null;
      }
    };

    // Lade und skaliere Layouts
    const loadLayouts = async () => {
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
    };

    // Lade Layouts von der Datenbank
    onMounted(() => {
      loadLayouts();
    });

    const getPreviewStyle = (layout) => {
      if (!layout || !layout.elements || !layout.elements.length) return {};

      const xs = layout.elements.flatMap(el => [el.x, el.x + el.w]);
      const ys = layout.elements.flatMap(el => [el.y, el.y + el.h]);

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const contentWidth = Math.max(1, maxX - minX);
      const contentHeight = Math.max(1, maxY - minY);

      const scaleX = 888 / contentWidth;
      const scaleY = 384 / contentHeight;
      const wrapperScale = 296 / 888; // equals 128/384

      return {
        transform: `translate(${-minX}px, ${-minY}px) scale(${scaleX}, ${scaleY}) scale(${wrapperScale})`,
        transformOrigin: 'top left'
      };
    };

    const getModalStyle = (layout) => {
      if (!layout || !layout.elements || !layout.elements.length) return {};

      const xs = layout.elements.flatMap(el => [el.x, el.x + el.w]);
      const ys = layout.elements.flatMap(el => [el.y, el.y + el.h]);

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const contentWidth = Math.max(1, maxX - minX);
      const contentHeight = Math.max(1, maxY - minY);

      const scaleX = 888 / contentWidth;
      const scaleY = 384 / contentHeight;

      return {
        transform: `translate(${-minX}px, ${-minY}px) scale(${scaleX}, ${scaleY})`,
        transformOrigin: 'top left'
      };
    };

    const openLayoutModal = (layout) => {
      selectedLayout.value = layout;
    };

    const closeLayoutModal = () => {
      selectedLayout.value = null;
    };

    const editLayout = (id) => {
      console.log("Öffne Layout ID:", id);
      closeLayoutModal();
      router.push({ name: 'layout-editor', params: { id } });
    };

    const deleteLayoutConfirm = async (id) => {
      if (confirm('Möchten Sie dieses Layout wirklich löschen?')) {
        try {
          await ApiService.deleteLayout(id);
          closeLayoutModal();
          // Lade Layouts neu
          await loadLayouts();
        } catch (error) {
          console.error('Fehler beim Löschen des Layouts:', error);
        }
      }
    };
    
    const createNewLayout = () => {
      console.log("Navigiere zum Editor für neues Layout");
      // Weiterleitung zum Editor ohne ID (löst das NameLayout-Modal aus)
      router.push({ name: 'layout-editor' });
    };


    return { 
      layouts,
      selectedLayout,
      userProfile,
      getElementComponent,
      getPreviewStyle,
      getModalStyle,
      openLayoutModal,
      closeLayoutModal,
      editLayout,
      deleteLayoutConfirm,
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

.business-cards {
  width: 296px; 
  height: 128px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.business-cards:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.card-preview-wrapper {
  width: 296px;
  height: 128px;
  overflow: hidden;
  position: relative;
}

.card-preview {
  width: 888px;
  height: 384px;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.preview-element {
  position: absolute;
  pointer-events: none;
  overflow: hidden;
}

.add-layout {
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
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  border: 2px dashed #666;
  background-color: rgba(168, 168, 168, 0.15);
  color: #333;
}

.add-layout:hover {
  transform: translateY(-4px); 
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  background-color: rgba(168, 168, 168, 0.3);
  border-color: black;
  color: black;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-weight: bold;
}

.close-button:hover {
  background: white;
  transform: scale(1.1);
}

.modal-canvas {
  width: 888px;
  height: 384px;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
}

.modal-element {
  position: absolute;
}

.modal-info {
  color: white;
  text-align: center;
  font-family: 'Dosis', sans-serif;
}

.modal-info h3 {
  margin: 0 0 15px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-bearbeiten {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-bearbeiten:hover {
  background-color: #0056b3;
}

.btn-loeschen {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-loeschen:hover {
  background-color: #c82333;
}
</style>