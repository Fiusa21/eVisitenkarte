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
        const router = useRouter();

        const goToAdminHome = () => {
            router.push('/admin');
        };
        
        const goToNutzerverwaltung = () => {
            window.open('http://localhost:8080/admin/master/console/#/eVisitenkarte-development/users', '_blank');
        };

        return {
            goToAdminHome, goToNutzerverwaltung,
        };
    }
}
</script>

<style scoped>
.wrapper {
    width: 480px;
    height: 40px;
    background-color: rgba(255,255,255,0.08);
    border-radius: 28px;
    padding: 6px 10px;
    box-sizing: border-box;
}

.wrapper-inner {
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

.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 32px;
}

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
@media screen and (max-width: 750px) {
    .wrapper {
        width: 100%;
        max-width: 100%;
    }
    
}
</style>