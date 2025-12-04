<template>
  <div class="circle-element"></div>
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
  background: black;
  border-radius: 50%;
}
</style>
