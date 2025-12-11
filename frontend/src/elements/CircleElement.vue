<template>
  <div class="circle-element" :style="{ backgroundColor: item.style?.color || 'black' }"></div>
</template>

<script>
export default {
  name: "CircleElement",
  props: {
    item: Object
  }
};
</script>

<style scoped>
.circle-element {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
