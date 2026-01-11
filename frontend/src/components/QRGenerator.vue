<template>
  <div class="qr-generator">
    <div class="input-group">
      <label>URL für QR-Code</label>
      <!--Input for the URL-->
      <input
        v-model="url"
        type="text"
        placeholder="https://uxitra.de"
        @input="onInput"
      />
    </div>

    <div class="toggle-row">
      <label>Farbe</label>
      <div class="toggle-buttons">
        <button
          :class="{ active: color === '000000' }"
          @click="setColor('000000', 'FFFFFF')"
        >Schwarz</button>
        <button
          :class="{ active: color === 'FFFFFF' }"
          @click="setColor('FFFFFF', '000000')"
        >Weiß</button>
      </div>
    </div>

    <div v-if="url" class="qr-preview">
      <div class="qr-frame">
        <img :src="qrUrl" alt="QR Code" @load="loading = false" />
        <div v-if="loading" class="loader">Generiere...</div>
      </div>
      <div class="actions">
        <button @click="addToCanvas" :disabled="loading">Auf Canvas platzieren</button>
        <button @click="downloadQR" :disabled="loading">Download PNG</button>
        <p class="hint">Direkt hinzufügen oder speichern</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const emit = defineEmits(['add-qr']); // notify parent when a QR is ready to place on canvas

const url = ref('https://uxitra.de'); // target URL for the QR code
const color = ref('000000'); 
const bgColor = ref('FFFFFF'); 
const loading = ref(false); // toggles loading overlay/state

// Build the remote QR API URL each time url/color changes
const qrUrl = computed(() => {
  if (!url.value) return '';
  const encoded = encodeURIComponent(url.value);
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=png&data=${encoded}&color=${color.value}&bgcolor=${bgColor.value}`;
});

// Switch QR colors and show loader until image loads
const setColor = (fg, bg) => {
  color.value = fg;
  bgColor.value = bg;
  loading.value = true;
};

// Mark as loading when URL input changes
const onInput = () => {
  loading.value = true;
};

// Download the generated QR as a PNG file
const downloadQR = async () => {
  try {
    loading.value = true;
    const response = await fetch(qrUrl.value);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = 'qr-code.png';
    link.click();
    URL.revokeObjectURL(objectUrl);
  } finally {
    loading.value = false;
  }
};

// Emit the URL string so it can be saved to database and regenerated on-the-fly
const addToCanvas = async () => {
  try {
    loading.value = true;
    // Just emit the URL - QR will be regenerated when needed
    emit('add-qr', url.value);
    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};
</script>

<style scoped>
.qr-generator {
  background: #2e2e2e;
  color: #fff;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group label,
.toggle-row label {
  font-size: 0.85rem;
  color: #ccc;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1c1c1c;
  color: #fff;
}

.toggle-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toggle-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.toggle-buttons button {
  padding: 10px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #1c1c1c;
  color: #fff;
  cursor: pointer;
}

.toggle-buttons button.active {
  border-color: #22c55e;
  background: #1f3a1f;
}

.qr-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.qr-frame {
  position: relative;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-frame img {
  width: 220px;
  height: 220px;
}

.loader {
  position: absolute;
  background: rgba(255,255,255,0.85);
  color: #000;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.actions button {
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  background: #22c55e;
  color: #fff;
  cursor: pointer;
}

.actions button:disabled {
  opacity: 0.6;
  cursor: default;
}

.hint {
  font-size: 0.75rem;
  color: #888;
}
</style>
