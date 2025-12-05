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
      // Nutze Canvas um Textbreite präzise zu messen
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const fontFamily = 'Dosis, sans-serif';
      
      let fontSize = 16; // Startwert
      const maxWidth = this.item.w - 8; // 4px Padding auf jeder Seite
      const maxHeight = this.item.h - 4; // 2px Padding oben/unten
      
      // Iterativ die beste Schriftgröße finden
      for (let size = 1; size <= 100; size++) {
        context.font = `${size}px ${fontFamily}`;
        const metrics = context.measureText(this.displayText);
        const textWidth = metrics.width;
        const textHeight = size; // Höhe = Schriftgröße
        
        // Wenn Text zu groß wird, die vorherige Größe nehmen
        if (textWidth > maxWidth || textHeight > maxHeight) {
          fontSize = size - 1;
          break;
        }
        fontSize = size;
      }
      
      //Min 1px, nie 0!!!!
      fontSize = Math.max(1, fontSize);

      return {
        width: '100%',
        height: '100%',
        fontSize: fontSize + 'px',
        color: this.item.style?.color || 'black',
        lineHeight: '1',
        whiteSpace: 'nowrap',
        padding: '4px 4px',
        margin: '0',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      };
    }
  }
};
</script>

<style scoped>
.text-element {
  font-family: 'Dosis', sans-serif;
  background: transparent;
}
</style>
