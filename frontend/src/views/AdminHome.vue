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
            <LayoutCard
              v-for="layout in layouts"
              :key="layout.id"
              :layout="layout"
              :user-profile="userProfile"
              @open="openLayoutModal"
            />
            <div class="add-layout" @click="createNewLayout">+</div>
        </div>
    </div>

    <!-- Modal -->
    <LayoutPreviewModal 
      :layout="selectedLayout" 
      :user-profile="userProfile"
      @close="closeLayoutModal"
    >
      <template #actions>
        <div class="modal-buttons">
          <button class="btn-bearbeiten" @click="editLayout(selectedLayout.id)">Bearbeiten</button>
          <button class="btn-loeschen" @click="deleteLayoutConfirm(selectedLayout.id)">Löschen</button>
        </div>
      </template>
    </LayoutPreviewModal>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '@/services/api-service';
import LayoutService from '@/services/frontend-layout-service';
import LayoutCard from '@/components/LayoutCard.vue';
import LayoutPreviewModal from '@/components/LayoutPreviewModal.vue';

// Add logic here later, e.g., fetching user-specific data
export default {
  name: 'AdminHome',
  components: {
    LayoutCard,
    LayoutPreviewModal
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

    const loadLayouts = async () => {
      try {
        layouts.value = await LayoutService.loadAllLayouts();
        console.log('Layouts geladen:', layouts.value);
      } catch (error) {
        console.error('Fehler beim Laden der Layouts:', error);
      }
    };

    // Lade Layouts von der Datenbank
    onMounted(() => {
      loadLayouts();
    });

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