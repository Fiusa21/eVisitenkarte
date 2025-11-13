<template>
  <div class="admin-home">
    <div class="site-header">
      <div class="header-content">
        <h1>uxitra GmbH</h1>
        <p>eVisitenkarten Editor</p>
      </div>
    </div>
    
    
    <div class="dashboard-layouts-container">
        <div
          v-for="layout in layouts"
          :key="layout.id"
          class="business-cards"
          > {{ layout.name }}
        </div>
        <div class="add-layout">+</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

// Add logic here later, e.g., fetching user-specific data
export default {
  name: 'AdminHome',
  setup() {
     const layouts = ref([
      { id: 1, name: 'Layout 1', imagePlaceholder: 'Image of Layout 1' },
      { id: 2, name: 'Layout 2', imagePlaceholder: 'Image of Layout 2' },
      { id: 3, name: 'Layout 3', imagePlaceholder: 'Image of Layout 3' },
      { id: 4, name: 'Layout 4', imagePlaceholder: 'Image of Layout 4' },
      { id: 5, name: 'Layout 5', imagePlaceholder: 'Image of Layout 5' },
      { id: 6, name: 'Layout 6', imagePlaceholder: 'Image of Layout 6' },
      { id: 7, name: 'Layout 7', imagePlaceholder: 'Image of Layout 7' },
      { id: 8, name: 'Layout 8', imagePlaceholder: 'Image of Layout 8' },
      { id: 9, name: 'Layout 9', imagePlaceholder: 'Image of Layout 9' },
      { id: 10, name: 'Layout 10', imagePlaceholder: 'Image of Layout 10' },
    ]);
    
    return { 
      layouts, 
    };
  }
}
</script>

<style scoped>
.site-header{
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center; 
  padding-top: 30px;
  padding-bottom: 50px;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.site-header h1{
  font-size: 5em;
  font-family: 'Dosis', sans-serif;
  font-weight: 500;
  margin: 0;
  padding: 0;
  line-height: 1;  
}

.site-header p{
  font-size: 1.5em;
  font-family: 'Dosis', sans-serif;
  font-weight: 300;
  margin: 0;
  padding: 0;
  margin-top: -5px;
}

.dashboard-layouts-container {
  flex-grow: 1; 
  display: flex; /*Horrizontal*/
  flex-wrap: wrap; /*Wrap cards to the next line*/
  gap:30px; /*Place between cards*/
  justify-content: flex-start; /*Cards start right*/
  align-items: center;
  max-height: 560px; 
  max-width: 1024px;
  overflow-y: auto;
  padding: 0 30px;
  margin-top: 25px;
}

.business-cards {
  /*Cards*/
  width: 296px; 
  height: 128px;
  
  /*Placeholder*/
  background-color: white;
  color: black;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  font-size: 1.2rem;
  background-image: linear-gradient(to right, #ffffff, #000000); /*Mimic style in cards*/
}

.add-layout{
  width: 296px; 
  height: 128px;
  border: solid 1px black;
  border-radius: 8px;
  background-color: rgba(168, 168, 168, 0.39);
  color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  font-size: 1.2rem;
}
</style>