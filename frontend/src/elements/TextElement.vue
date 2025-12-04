<template>
  <div class="text-element" :style="textStyle">
    {{ item.content }}
  </div>
</template>

<script>
export default {
  name: "TextElement",
  props: {
    item: Object
  },
  computed: {
    textStyle() {
      return {
        width: "100%",
        height: "100%",
        fontSize: this.item.fontSize + "px",
        color: this.item.color || "black",
        overflow: "hidden",
        whiteSpace: "nowrap"
      };
    }
  }
};
</script>

<style scoped>
.text-element {
  font-family: 'Dosis', sans-serif;
  background: white;
  box-sizing: border-box;
  padding: 2px;
}
</style>
