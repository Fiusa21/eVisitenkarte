<template>
  <div class="user-home">
    <div class="site-header">
      <div class="header-content">
        <h1>uxitra GmbH</h1>
        <p>eVisitenkarten Editor</p>
      </div>
    </div>
    
    <div class="main-content-wrapper">
      
      <div class="user-info-card">
        <div class="user-info">

          <div
            v-for="field in userInfoFields"
            :key="field.key"
            class="info-group"
          >
            <label class="field-label">{{ field.label }}</label>
            <div class="display-field">
              {{ userProfile[field.key] || 'Nicht hinterlegt' }}
            </div> 
          </div>

          <div class="info-group">
            <label class="field-label">Adresse</label>
            <div class="display-field">
              {{ formattedAddress || 'Nicht hinterlegt' }}
            </div>
          </div>

        </div>
      </div>

      <div class="dashboard-layouts-container">
        <div
          v-for="layout in layouts"
          :key="layout.id"
          class="business-cards"
          > {{ layout.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'; //ref (for reactive objects which contain token data), computed (everytime token data changes, computed properties update)
import KeycloakService from '@/services/keycloak-service';

export default {
  name: 'UserHome',
  setup() {

    //Take from user profile fields in keycloak
    const userProfileRef = KeycloakService.getIdTokenParsed();

    //Computed Property to access user profile data
    const userProfile = computed(() =>  userProfileRef.value || {});

    //Compute the address
    const formattedAddress = computed(() => {
      //addressClaim saves address object from token
      const addressClaim = userProfile.value.address;
      if(!addressClaim || typeof addressClaim !== 'object') {
        return '';
      }
      //fetch components of address
      const street = addressClaim.street_address || '';
      const postalCode = addressClaim.postal_code || '';
      const locality = addressClaim.locality || '';

      //Combine components into single string
      const parts = [
        street,
        `${postalCode} ${locality}`.trim()
      ].filter(p => p); //filters out falsy (empty) values
      return parts.join('\n'); //Adds new line
    });

    //fields to display {key: Claim-Namen from Token, label: Label in UI}
    const userInfoFields = ([
      { key: 'first_name', label: 'Vorname'},
      { key: 'last_name', label: 'Nachname'},
      { key: 'company', label: 'Firma'},
      { key: 'title', label: 'Titel'},
      { key: 'email', label: 'E-Mail'},
      { key: 'phone_number', label: 'Telefon'},
      { key: 'mobile_number', label: 'Mobil'},
    ]);

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
      userProfile,
      userInfoFields,
      formattedAddress
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

/*user-info and dashboard-layouts-container*/
.main-content-wrapper{
  display: flex;
  justify-content: flex-start; 
  align-items: flex-start; 
  gap: 200px; /* Space between the two columns */
  margin-top: 15px;
  padding: 0 30px;
  width: 90%; 

}

/*All Label and Fields*/
.user-info-card {
  background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent dark background */
  padding: 15px;
  border-radius: 8px;
  flex-basis: 350px; /* Fixed width for the user info box */
  flex-shrink: 0; /* Prevents shrinking */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

/*Space between different fields*/
.user-info {
  display: flex;
  flex-direction: column;
  gap: 15px; 
}

/*Label and Input*/
.info-group {
  display: flex;
  flex-direction: column; 
  gap: 5px; 
}

/*Label*/
.field-label {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  padding-left: 2px;
}

/*Input Fields*/
.display-field {
  background-color: #ffffff;
  color: black;
  padding: 1px 5px;
  border-radius: 8px;
  font-size: 1.0rem;
  line-height: 1.5;
  min-height: 1.5em; 
  border: none;
  white-space: pre-line;
}

.dashboard-layouts-container {
  flex-grow: 1; 
  display: flex; /*Horrizontal*/
  flex-wrap: wrap; /*Wrap cards to the next line*/
  gap:30px; /*Place between cards*/
  justify-content: flex-start; /*Cards start right*/
  max-height: 565px; 
  overflow-y: auto;
  padding-bottom: 20px;
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
</style>