<template>
  <div class="rectangle-element"></div>
</template>

<script>
export default {
  name: "RectangleElement",
  props: {
    item: Object
  }
};
</script>

<style scoped>
.rectangle-element {
  width: 100%;
  height: 100%;
  background: black;
}
</style>