<template>
    <div class="wrapper">
        <div class="wrapper-inner">
            <button @click="goToAdminHome" class="home-button">Home</button>
            <button @click="goToNutzerverwaltung" class="nutzer-button">Nutzer</button>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default{
    name: 'TopBar',
    setup(){
        //Access the router instance
        const router = useRouter();
        
        //Function to navigate to AdminHome
        const goToAdminHome = () => {
            router.push('/admin');
        };
        
        //Function to navigate to Nutzerverwaltung
        const goToNutzerverwaltung = () => {
            router.push('/nutzerverwaltung');
        };

        return {
            goToAdminHome, goToNutzerverwaltung,
        };
    }
}
</script>

<style scoped>
.wrapper {
    /* fixed pill width so it appears as centered bar in the header */
    width: 480px;
    height: 40px;
    background-color: rgba(255,255,255,0.08);
    border-radius: 28px;
    padding: 6px 10px;
    box-sizing: border-box;
}

.wrapper-inner {
    /* let the inner content determine spacing */
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 100px;
}

button {
    font-size: 1.2em;
    font-family: 'Dosis', sans-serif;
    background: none;
    border: none;
    color: white;
    padding: 5px 10px;
    cursor: pointer;
    outline: none;
}
/* Ensure the wrapper centers the inner container horizontally */
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 32px;
}


/* Make buttons have consistent size and center their content */
.wrapper-inner button {
    min-width: 120px;
    height: 36px;
    padding: 6px 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    background: transparent;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover{
    background-color: #FB8500;
}
</style>