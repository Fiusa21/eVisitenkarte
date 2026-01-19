<template>
  <div class="business-cards" @click="$emit('open', layout)">
    <div class="card-preview-wrapper">
      <div class="card-preview" :style="{ backgroundColor: layout.backgroundColor }">
        <div
          v-for="element in layout.elements"
          :key="element.id"
          class="preview-element"
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQRImageSrc } from '@/composables/useQRImageSrc';
import TextElement from '@/elements/TextElement.vue';
import RectangleElement from '@/elements/RectangleElement.vue';
import CircleElement from '@/elements/CircleElement.vue';
import TriangleElement from '@/elements/TriangleElement.vue';

const props = defineProps({
  layout: {
    type: Object,
    required: true
  },
  userProfile: {
    type: Object,
    default: () => ({})
  }
});

defineEmits(['open']);

const { getImageSrc: getImageSrcComposable } = useQRImageSrc();
const elementImageSrcMap = ref(new Map());

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
onMounted(async () => {
  for (const item of props.layout.elements) {
    if (item.type === 'qr' || item.type === 'logo') {
      await getImageSrc(item);
    }
  }
});
</script>

<style scoped>
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
</style>
