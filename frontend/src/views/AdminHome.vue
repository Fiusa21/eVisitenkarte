<template>
  <div class="admin-home">
    <div class="site-header">
      <div class="header-content">
        <h1>uxitra GmbH</h1>
        <p>eVisitenkarten Editor</p>
      </div>
    </div>
    <div class="layout-wrapper">
        <div class="layouts">
            <div
            v-for="layout in layouts"
            :key="layout.id"
            class="business-cards"
            @click="openLayout(layout.id)"
            > {{ layout.name }}
            </div>
            <div class="add-layout" @click="createNewLayout">+</div>
        </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Add logic here later, e.g., fetching user-specific data
export default {
  name: 'AdminHome',
  setup() {
    const router = useRouter();
     const layouts = ref([
      { id: 1, name: 'Layout 1', imagePlaceholder: 'Image of Layout 1' },
      { id: 2, name: 'Layout 2', imagePlaceholder: 'Image of Layout 2' },
      { id: 3, name: 'Layout 3', imagePlaceholder: 'Image of Layout 3' },
      { id: 4, name: 'Layout 4', imagePlaceholder: 'Image of Layout 4' },
      { id: 5, name: 'Layout 5', imagePlaceholder: 'Image of Layout 5' },
      { id: 6, name: 'Layout 6', imagePlaceholder: 'Image of Layout 6' },
      { id: 31, name: 'Layout 31', imagePlaceholder: 'Image of Layout 31' },
      { id: 32, name: 'Layout 32', imagePlaceholder: 'Image of Layout 32' },
      { id: 33, name: 'Layout 33', imagePlaceholder: 'Image of Layout 33' },
      { id: 34, name: 'Layout 34', imagePlaceholder: 'Image of Layout 34' },
    ]);

    const openLayout = (id) => {
      console.log("Öffne Layout ID:", id);
      router.push({ name: 'layout-editor', params: { id } });
    };
    
    const createNewLayout = () => {
      console.log("Navigiere zum Editor für neues Layout");
      // Weiterleitung zum Editor ohne ID (löst das NameLayout-Modal aus)
      router.push({ name: 'layout-editor' });
    };


    return { 
      layouts, 
      openLayout,
      createNewLayout
    };
  }
}
</script>

<style scoped>
/*
TODO: Medie queries für alle Bildschirmgrößen 
*/

.site-header{
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center; 
  padding-top: 20px;
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

.layout-wrapper{
    max-width: 1024px;
    margin: 0 auto;
    margin-top: 25px;   
}

.layouts {
  flex-grow: 1; 
  display: flex;
  flex-wrap: wrap;
  gap:30px; 
  justify-content: flex-start; 
  align-items: center;
  max-height: auto; 
  max-width: 1024px;
  overflow-y: auto;
  padding: 0 30px;
  margin-top: 25px;
  padding-top: 10px;
}

.business-cards, .add-layout {
  width: 296px; 
  height: 128px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  font-size: 1.2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.business-cards:hover, .add-layout:hover {
  transform: translateY(-8px); 
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}

.business-cards:active, .add-layout:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.business-cards {
  background-color: white;
  color: black;
  padding: 15px;
  background-image: linear-gradient(135deg, #ffffff 60%, #e0e0e0 100%);
}

.add-layout {
  border: 2px dashed #666;
  background-color: rgba(168, 168, 168, 0.15);
  color: #333;
}

.add-layout:hover {
  background-color: rgba(168, 168, 168, 0.3);
  border-color: black;
  color: black;
}
</style>