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
        <div
          v-for="layout in layouts"
          :key="layout.id"
          class="business-cards"
          @click="openLayoutModal(layout)"
        >
          <div class="card-preview-wrapper">
            <div class="card-preview" :style="{ backgroundColor: layout.backgroundColor }">
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
                  :is="getElementComponent(element)"
                  :item="element"
                  :user-profile="userProfile"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedLayout" class="modal-overlay" @click="closeLayoutModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeLayoutModal">✕</button>
        <button class="send-button" @click="sendImage">Send to display</button>

        <div id="target-canvas" ref="canvasRef" class="modal-canvas" :style="{ backgroundColor: selectedLayout.backgroundColor }">
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
              :is="getElementComponent(element)"
              :item="element"
              :user-profile="userProfile"
            />
          </div>
        </div>

        <div class="modal-info">
          <h3>{{ selectedLayout.name }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import KeycloakService from '@/services/keycloak-service';
import ApiService from '@/services/api-service';
import TextElement from '@/elements/TextElement.vue';
import RectangleElement from '@/elements/RectangleElement.vue';
import CircleElement from '@/elements/CircleElement.vue';
import TriangleElement from '@/elements/TriangleElement.vue';
import * as htmlToImage from 'html-to-image';
import Pica from 'pica';

export default {
  name: 'UserHome',
  components: {
    TextElement,
    RectangleElement,
    CircleElement,
    TriangleElement
  },
  setup() {

    const canvasRef = ref(null);
    const isSending = ref(false);

    //pica for high quality down scaling
    const pica = Pica();

    const sendImage = async () => {
      const element = canvasRef.value || document.getElementById('target-canvas');
      if (!element) return;

      isSending.value = true;
      try {
        //capture original
        const sourceCanvas = await htmlToImage.toCanvas(element, {
          pixelRatio: 1,
          cacheBust: true,
          backgroundColor: '#ffffff'
        });

        // 2. Prepare the Downscaled Canvas (1x)
        const targetW = sourceCanvas.width / 3;
        const targetH = sourceCanvas.height / 3;
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


    //Take from user profile fields in keycloak
    const userProfileRef = KeycloakService.getIdTokenParsed();

    //Computed Property to access user profile data
    const userProfile = computed(() =>  userProfileRef.value || {});

    //Compute the address
    const formattedAddress = computed(() => {
      //addressClaim saves address object from token
      const addressClaim = userProfile.value.address;
      if(!addressClaim || typeof addressClaim !== 'object') {
        return '';
      }
      //fetch components of address
      const street = addressClaim.street_address || '';
      const postalCode = addressClaim.postal_code || '';
      const locality = addressClaim.locality || '';

      //Combine components into single string
      const parts = [
        street,
        `${postalCode} ${locality}`.trim()
      ].filter(p => p); //filters out falsy (empty) values
      return parts.join('\n'); //Adds new line
    });

    //fields to display {key: Claim-Namen from Token, label: Label in UI}
    const userInfoFields = ([
      { key: 'first_name', label: 'Vorname'},
      { key: 'last_name', label: 'Nachname'},
      { key: 'company', label: 'Firma'},
      { key: 'title', label: 'Titel'},
      { key: 'email', label: 'E-Mail'},
      { key: 'phone_number', label: 'Telefon'},
      { key: 'mobile_number', label: 'Mobil'},
    ]);

    const layouts = ref([]);
    const selectedLayout = ref(null);

    // Element-Komponente basierend auf Typ zurückgeben
    const getElementComponent = (element) => {
      switch (element.type) {
        case 'rectangle': return RectangleElement;
        case 'circle': return CircleElement;
        case 'triangle': return TriangleElement;
        case 'text': return TextElement;
        default: return null;
      }
    };

    // Modal öffnen
    const openLayoutModal = (layout) => {
      selectedLayout.value = layout;
    };

    // Modal schließen
    const closeLayoutModal = () => {
      selectedLayout.value = null;
    };


    // Layouts von der Datenbank laden und gruppieren
    onMounted(async () => {
      try {
        const data = await ApiService.getAllLayouts();
        
        // Gruppiere flache Element-Liste nach layout_id
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
          
          if (row.element_id) {
            const layout = layoutsMap.get(layoutId);
            const element = {
              id: row.element_id,
              type: row.typ, // Korrekte Feldname: typ statt element_type
              x: parseFloat(row.pos_x) || 0, // pos_x statt x_position
              y: parseFloat(row.pos_y) || 0, // pos_y statt y_position
              w: parseFloat(row.size_x) || 50, // size_x statt width
              h: parseFloat(row.size_y) || 50, // size_y statt height
              content: row.uri, // uri statt content
              source: row.source,
              style: row.style || { color: 'black' }
            };
            console.log(`Element ${row.element_id}: raw={pos_x: ${row.pos_x}, pos_y: ${row.pos_y}, size_x: ${row.size_x}, size_y: ${row.size_y}}, parsed={x: ${element.x}, y: ${element.y}, w: ${element.w}, h: ${element.h}}`);
            layout.elements.push(element);
          }
        });
        
        layouts.value = Array.from(layoutsMap.values());
        
        //Überarbeiten wegen Scale fehler. 
        // Skaliere Elemente so dass sie die volle 888px Breite ausfüllen
        layouts.value.forEach(layout => {
          if (layout.elements.length > 0) {
            // Finde das rechteste Element
            const maxX = Math.max(...layout.elements.map(el => el.x + el.w));
            
            // Wenn maxX < 888, skaliere alle Elemente proportional
            if (maxX > 0 && maxX < 888) {
              const scaleFactor = 888 / maxX;
              layout.elements.forEach(el => {
                el.x = el.x * scaleFactor;
                el.w = el.w * scaleFactor;
              });
              console.log(`Layout ${layout.id}: skaliert von MaxX=${maxX} zu 888 (Faktor: ${scaleFactor.toFixed(3)})`);
            }
          }
        });
        
        console.log('Final layouts count:', layouts.value.length);
        layouts.value.forEach(l => {
          console.log(`Layout ${l.id}: ${l.elements.length} elements`);
        });
      } catch (error) {
        console.error('Fehler beim Laden der Layouts:', error);
      }
    });

    return { 
      layouts,
      userProfile,
      userInfoFields,
      formattedAddress,
      selectedLayout,
      openLayoutModal,
      closeLayoutModal,
      getElementComponent,
      sendImage
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

/*user-info and dashboard-layouts-container*/
.main-content-wrapper{
  display: flex;
  justify-content: flex-start; 
  align-items: flex-start; 
  gap: 200px; /* Space between the two columns */
  margin-top: 15px;
  padding: 0 30px;
  width: 90%; 

}

/*All Label and Fields*/
.user-info-card {
  background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent dark background */
  padding: 15px;
  border-radius: 8px;
  flex-basis: 350px; /* Fixed width for the user info box */
  flex-shrink: 0; /* Prevents shrinking */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

/*Space between different fields*/
.user-info {
  display: flex;
  flex-direction: column;
  gap: 15px; 
}

/*Label and Input*/
.info-group {
  display: flex;
  flex-direction: column; 
  gap: 5px; 
}

/*Label*/
.field-label {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  padding-left: 2px;
}

/*Input Fields*/
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
  display: flex; /*Horrizontal*/
  flex-wrap: wrap; /*Wrap cards to the next line*/
  gap:30px; /*Place between cards*/
  justify-content: flex-start; /*Cards start right*/
  max-height: 565px; 
  overflow-y: auto;
  padding-bottom: 20px;
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
  /* Helps browsers render text without subpixel anti-aliasing */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* If you have images/icons inside, keep them sharp too */
  image-rendering: pixelated;
  image-rendering: crisp-edges;
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