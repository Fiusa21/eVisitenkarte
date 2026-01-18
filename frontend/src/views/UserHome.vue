<template>
  <div class="user-home">
    <div class="site-header">
      <div class="header-content">
        <h1>uxitra GmbH</h1>
        <p>eVisitenkarten Editor</p>
      </div>
    </div>
    
    <div class="main-content-wrapper">
      
      <div class="user-info-card">
        <div class="user-info">

          <div
            v-for="field in userInfoFields"
            :key="field.key"
            class="info-group"
          >
            <label class="field-label">{{ field.label }}</label>
            <div class="display-field">
              {{ userProfile[field.key] || 'Nicht hinterlegt' }}
            </div> 
          </div>

          <div class="info-group">
            <label class="field-label">Adresse</label>
            <div class="display-field">
              {{ formattedAddress || 'Nicht hinterlegt' }}
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-layouts-container">
        <LayoutCard
          v-for="layout in layouts"
          :key="layout.id"
          :layout="layout"
          :user-profile="userProfile"
          @open="openLayoutModal"
        />
      </div>
    </div>

    <!-- Modal -->
    <LayoutPreviewModal 
      ref="modalRef"
      :layout="selectedLayout" 
      :user-profile="userProfile"
      @close="closeLayoutModal"
    >
      <template #actions>
        <button class="send-button" @click="sendImage" :disabled="isSending">
          {{ isSending ? 'Wird gesendet...' : 'Send to display' }}
        </button>
      </template>
    </LayoutPreviewModal>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ApiService from '@/services/api-service';
import LayoutService from '@/services/frontend-layout-service';
import LayoutCard from '@/components/LayoutCard.vue';
import LayoutPreviewModal from '@/components/LayoutPreviewModal.vue';
import * as htmlToImage from 'html-to-image';
import Pica from 'pica';
import { useUserProfile } from '@/composables/userProfile';

export default {
  name: 'UserHome',
  components: {
    LayoutCard,
    LayoutPreviewModal
  },
  setup() {
    const { userProfile, formattedAddress, userInfoFields } = useUserProfile();

    const isSending = ref(false);
    const modalRef = ref(null);

    //pica for high quality down scaling
    const pica = Pica();

    const sendImage = async () => {
      const canvasElement = modalRef.value?.canvasRef?.value;
      if (!canvasElement) return;

      isSending.value = true;
      try {
        //capture original
        const sourceCanvas = await htmlToImage.toCanvas(canvasElement, {
          pixelRatio: 1,
          cacheBust: true,
          backgroundColor: '#ffffff'
        });

        // 2. Prepare the Downscaled Canvas (1x)
        const targetW = Math.floor(sourceCanvas.width / 3);
        const targetH = Math.floor(sourceCanvas.height / 3);
        const downscaledCanvas = document.createElement('canvas');
        downscaledCanvas.width = targetW;
        downscaledCanvas.height = targetH;

        // 3. Use Pica to Resize (High Quality Lanczos3 Filter)
        await pica.resize(sourceCanvas, downscaledCanvas, {
          unsharpAmount: 80, // Slightly sharpens text edges
          unsharpRadius: 0.6,
          unsharpThreshold: 2
        });

        // 4. Create Rotated Canvas (Swapping W/H)
        const rotatedCanvas = document.createElement('canvas');
        const ctx = rotatedCanvas.getContext('2d');
        rotatedCanvas.width = targetH;
        rotatedCanvas.height = targetW;

        ctx.translate(rotatedCanvas.width, 0);
        ctx.rotate(90 * Math.PI / 180);
        ctx.drawImage(downscaledCanvas, 0, 0);



        // 6. Convert & Send
        const blob = await new Promise(r => rotatedCanvas.toBlob(r, 'image/png'));

        // DEBUG DOWNLOAD
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pro-epaper.png`;
        link.click();

        const buffer = await blob.arrayBuffer();
        await ApiService.uploadImage(buffer);

        alert("Sent high-quality dithered image!");
      } catch (error) {
        console.error(error);
      } finally {
        isSending.value = false;
      }
    };


    const layouts = ref([]);
    const selectedLayout = ref(null);

    // Layouts von der Datenbank laden und gruppieren
    onMounted(async () => {
      try {
        layouts.value = await LayoutService.loadAllLayouts();
        console.log('Layouts geladen:', layouts.value);
      } catch (error) {
        console.error('Fehler beim Laden der Layouts:', error);
      }
    });

    const openLayoutModal = (layout) => {
      selectedLayout.value = layout;
    };

    const closeLayoutModal = () => {
      selectedLayout.value = null;
    };

    return { 
      layouts,
      userProfile,
      userInfoFields,
      formattedAddress,
      selectedLayout,
      openLayoutModal,
      closeLayoutModal,
      sendImage,
      isSending,
      modalRef
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


.main-content-wrapper{
  display: flex;
  justify-content: flex-start; 
  align-items: flex-start; 
  gap: 200px; 
  margin-top: 15px;
  padding: 0 30px;
  width: 90%; 

}

.user-info-card {
  background-color: rgba(0, 0, 0, 0.2); 
  padding: 15px;
  border-radius: 8px;
  flex-basis: 350px; 
  flex-shrink: 0; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 15px; 
}

.info-group {
  display: flex;
  flex-direction: column; 
  gap: 5px; 
}

.field-label {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  padding-left: 2px;
}

.display-field {
  background-color: #ffffff;
  color: black;
  padding: 1px 5px;
  border-radius: 8px;
  font-size: 1.0rem;
  line-height: 1.5;
  min-height: 1.5em; 
  border: none;
  white-space: pre-line;
}

.dashboard-layouts-container {
  flex-grow: 1; 
  display: flex;
  flex-wrap: wrap; 
  gap:30px; 
  justify-content: flex-start; 
  max-height: 565px; 
  overflow-y: auto;
  padding-bottom: 20px;
  padding-top: 20px;
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
  transform: scale(0.333333);
  transform-origin: top left;
}

.preview-element {
  position: absolute;
  pointer-events: none;
  overflow: hidden;
}

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

.send-button {
  position: absolute;
  top: 400px;
  right: 0;
  background: lawngreen;
  border: none;
  border-radius: 10%;
  width: 200px;
  height: 35px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-weight: bold;
  font-family: Dosis;
}

.send-button:hover {
  background: lawngreen;
  transform: scale(1.1);
  border: white;
  border-style: solid;
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
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}
</style>