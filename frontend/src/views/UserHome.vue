<template>
  <div class="user-home">
    <h1>Welcome, User!</h1>
    <p>This is your personalized dashboard area, displaying an overview of your data.</p>
    
    <div class="dashboard-grid">
        <div class="info-card">Quick Stat 1</div>
        <div class="info-card">Quick Stat 2</div>
        <div class="info-card">Quick Stat 3</div>
    </div>

    </div>
</template>

<script>
// Add logic here later, e.g., fetching user-specific data
export default {
  name: 'UserHome',
  setup() {
    // Example: reactive data for the user's name
    // const userName = ref('Tobias'); 
    
    return { 
      // userName 
    };
  }
}
</script>

<style scoped>
.user-home h1 {
  color: #333;
  margin-bottom: 20px;
}

.user-home p {
    color: #333;
    margin-bottom: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.info-card {
  background: rgb(86, 161, 83);
  color: black;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 5px solid #007bff; /* Visual accent */
}
</style>