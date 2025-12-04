<template>
  <div class="text-element" :style="textStyle">
    {{ displayText }}
  </div>
</template>

<script>
export default {
  name: "TextElement",
  props: {
    item: Object,
    userProfile: Object
  },
  computed: {
    displayText() {
      // Wenn dynamisch, Text aus userProfile
      if(this.item.source === 'dynamic') {
        return this.userProfile[this.item.content] || '';
      }
      return this.item.content;
    },
    textStyle() {
      if(!this.item.fontSize) {
        this.item.fontSize = 16; // Standardgröße
      }

      // Berechne das Skalierungsverhältnis
      const textLength = this.displayText.length;
      let fontSize = this.item.fontSize;

      // Verhältnis: w/h
      const scaleX = this.item.w / (textLength * fontSize * 0.6); // ca. Buchstabenbreite
      const scaleY = this.item.h / fontSize;

      const scale = Math.min(scaleX, scaleY);

      fontSize = Math.max(1, fontSize * scale); // nie 0

      return {
        width: '100%',
        height: '100%',
        fontSize: fontSize + 'px',
        color: 'black',
        lineHeight: '1',
        whiteSpace: 'nowrap',
        padding: '0',
        margin: '0',
        boxSizing: 'border-box'
      };
    }
  }
};
</script>

<style scoped>
.text-element {
  font-family: 'Dosis', sans-serif;
  display: inline-block;
  background: transparent; /* kein weißer Hintergrund */
}
</style>
