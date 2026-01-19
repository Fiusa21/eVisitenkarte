<template>
  <div v-if="layout" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="$emit('close')">✕</button>

      <div ref="canvasRef" class="modal-canvas" :style="{ backgroundColor: layout.backgroundColor }">
        <div
          v-for="element in layout.elements"
          :key="element.id"
          class="modal-element"
          :style="elementStyle(element)"
        >
          <component
            v-if="isRenderable(element)"
            :is="getElementComponent(element)"
            :item="element"
            :user-profile="userProfile"
          />
          <img
            v-else
            :src="elementImageSrcMap.get(element.id) || getImagePath(element)"
            :alt="element.content"
            style="width: 100%; height: 100%; object-fit: contain;"
          />
        </div>
      </div>

      <div class="modal-info">
        <h3>{{ layout.name }}</h3>
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineExpose, watch } from 'vue';
import { useQRImageSrc } from '@/composables/useQRImageSrc';
import TextElement from '@/elements/TextElement.vue';
import RectangleElement from '@/elements/RectangleElement.vue';
import CircleElement from '@/elements/CircleElement.vue';
import TriangleElement from '@/elements/TriangleElement.vue';

const props = defineProps({
  layout: {
    type: Object,
    required: false,
    default: null
  },
  userProfile: {
    type: Object,
    default: () => ({})
  }
});

defineEmits(['close']);

const canvasRef = ref(null);
const { getImageSrc: getImageSrcComposable } = useQRImageSrc();
const elementImageSrcMap = ref(new Map());

// Expose canvasRef for parent component
defineExpose({ canvasRef });

// Element-Komponente basierend auf Typ zurückgeben
const getElementComponent = (element) => {
  switch (element.type) {
    case 'rectangle':
      return RectangleElement;
    case 'circle':
      return CircleElement;
    case 'triangle':
      return TriangleElement;
    case 'text':
      return TextElement;
    case 'logo':
      return 'img';
    default:
      return null;
  }
};

// Prüfe ob Element direkt gerendert werden kann
const isRenderable = (element) => {
  return element.type !== 'logo' && element.type !== 'qr';
};

// Gebe Bildpfad für Logo zurück
const getImagePath = (element) => {
  if (element.type === 'logo') {
    return `/company-logos/${element.content}`;
  }
  return '';
};

// Style für Element Position und Größe
const elementStyle = (element) => ({
  position: 'absolute',
  left: element.x + 'px',
  top: element.y + 'px',
  width: element.w + 'px',
  height: element.h + 'px'
});

// Helper zum Laden von Bildern mit Cache
const getImageSrc = async (item) => {
  if (elementImageSrcMap.value.has(item.id)) {
    return elementImageSrcMap.value.get(item.id);
  }

  try {
    const src = await getImageSrcComposable(item);
    elementImageSrcMap.value.set(item.id, src);
    return src;
  } catch (error) {
    console.error('Fehler beim Laden des Bildes:', error);
    return '';
  }
};

// Preload QR-Code and Logo images
const preloadImages = async () => {
  if (props.layout) {
    for (const item of props.layout.elements) {
      if (item.type === 'qr' || item.type === 'logo') {
        await getImageSrc(item);
      }
    }
  }
};

onMounted(() => {
  preloadImages();
});

// Watch for layout changes and reload images
watch(() => props.layout, () => {
  elementImageSrcMap.value = new Map(); // Clear the cache
  preloadImages();
});
</script>

<style scoped>
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
  border: solid 2px white;
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
