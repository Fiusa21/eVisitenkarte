<template>
  <svg :width="item.w" :height="item.h" class="triangle-svg">
    <polygon :points="trianglePoints" :fill="item.style?.color || 'black'" />
  </svg>
</template>

<script>
export default {
  name: "TriangleElement",
  props: {
    item: Object
  },
  computed: {
    trianglePoints() {
      // bottom-left, top-middle, bottom-right
      const w = this.item.w;
      const h = this.item.h;
      return `0,${h} ${w / 2},0 ${w},${h}`;
    }
  }
};
</script>

<style scoped>
.triangle-svg {
  display: block;
}
</style>

