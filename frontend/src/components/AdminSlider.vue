<template>
  <div class="toggle-container">
    <input 
      type="checkbox" 
      :id="toggleId" 
      :checked="modelValue"
      @change="handleToggleAndNavigation($event.target.checked)"
    >
    
    <label :for="toggleId" class="slider-track">
      <span class="slider-thumb"></span>
    </label>
  </div>
</template>

<script>
//TODO: Admin Slider funktioniert noch nicht richtig. Übergang buggy!!!!!
import { useRouter } from 'vue-router';

export default {
  name: 'AdminToggle',
  props: {
    modelValue: Boolean, // The current state (ON/OFF)
    toggleId: {          // Unique ID for the checkbox/label binding
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const router = useRouter();

    const handleToggleAndNavigation = (newValue) => {
      
      emit('update:modelValue', newValue);

      if(newValue){
        //True = AdminHome
        router.push({ name: 'admin-home' });
      }else{
        //False = UserHome
        router.push({ name: 'user-home' });
      }
    };
    return {
      handleToggleAndNavigation
    };
  }
}
</script>

<style scoped>
.toggle-container {
  display: inline-block;
}


input[type="checkbox"] {
  height: 0;
  width: 0;
  visibility: hidden;
}


.slider-track {
  cursor: pointer;
  width: 50px; 
  height: 25px; 
  background: #D9D9D9; 
  display: block;
  border-radius: 25px; 
  position: relative;
}


.slider-thumb {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 19px;
  height: 19px;
  background: black; 
  border-radius: 50%;
  transition: 0.3s;
}


input[type="checkbox"]:checked + .slider-track {
  background: #D9D9D9; /* ON state color */
}


input[type="checkbox"]:checked + .slider-track .slider-thumb {
  background: orange;
  transform: translateX(25px); 
}
</style>