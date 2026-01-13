<template>
  <div class="qr-generator">
    <div class="input-group">
      <label>URL für QR-Code</label>
      <!--Input for the URL-->
      <input
        v-model="url"
        type="text"
        placeholder="https://uxitra.de"
      />
    </div>

    <div v-if="url" class="qr-preview">
      <div class="qr-frame">
        <div v-if="loading" class="loader">Generiere...</div>
        <img v-else :src="qrDataUrl" alt="QR Code" />
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
import { ref, watch } from 'vue';
import QRCode from 'qrcode';

const emit = defineEmits(['add-qr']);

const url = ref('https://uxitra.de');
const qrDataUrl = ref('');
const loading = ref(false);

// QR-Code generieren wenn URL sich ändert
const generateQR = async () => {
  if (!url.value) {
    qrDataUrl.value = '';
    return;
  }

  try {
    loading.value = true;
    const dataUrl = await QRCode.toDataURL(url.value, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 220,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    qrDataUrl.value = dataUrl;
    loading.value = false;
  } catch (error) {
    console.error('Fehler beim QR-Code generieren:', error);
    loading.value = false;
  }
};

// QR als PNG downloaden
const downloadQR = async () => {
  try {
    const link = document.createElement('a');
    link.href = qrDataUrl.value;
    link.download = 'qr-code.png';
    link.click();
  } catch (error) {
    console.error('Download-Fehler:', error);
  }
};

// Nur URL zum Canvas hinzufügen (QR wird später regeneriert)
const addToCanvas = () => {
  emit('add-qr', url.value);
};

// QR generieren wenn URL sich ändert
watch(url, () => generateQR(), { immediate: true });
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

.input-group label {
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
