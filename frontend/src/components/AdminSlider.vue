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
//TODO: Admin Slider funktioniert noch nicht richtig. Übergung buggy!!!!!
import { useRouter } from 'vue-router';

// This component uses v-model for simplicity, passing the boolean state (true/false)
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

    //Router instance fpr navigation
    const router = useRouter();

    //New function for triggering emit and navigation
    const handleToggleAndNavigation = (newValue) => {
      
      // update state in parent component
      emit('update:modelValue', newValue);

      // Navigate based on new value
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

/* 1. Hide the default checkbox input */
input[type="checkbox"] {
  height: 0;
  width: 0;
  visibility: hidden;
}

/* 2. Style the Slider Track (The background bar) */
.slider-track {
  cursor: pointer;
  width: 50px; /* Width of the entire switch */
  height: 25px; /* Height of the entire switch */
  background: #D9D9D9; /* OFF state dark color */
  display: block;
  border-radius: 25px; /* Makes it pill-shaped */
  position: relative;
}

/* 3. Style the Slider Thumb (The sliding circle/square) */
.slider-thumb {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 19px;
  height: 19px;
  background: black; /* Thumb color */
  border-radius: 50%; /* Makes it round */
  transition: 0.3s; /* Smooth sliding animation */
}

/* 4. The Magic: Apply styles when the checkbox is checked (ON state) */
/* This selects the label (slider-track) immediately following the checked input */
input[type="checkbox"]:checked + .slider-track {
  background: #D9D9D9; /* ON state color */
}

/* 5. The Slide: Move the thumb to the right when checked */
/* This selects the thumb (span) *inside* the checked slider-track */
input[type="checkbox"]:checked + .slider-track .slider-thumb {
  /* Move thumb by (Track Width - Thumb Width - Left/Right Padding/Offset) */
  background: orange;
  transform: translateX(25px); 
}
</style>