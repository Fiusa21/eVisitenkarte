<template>
    <div class="wrapper">
        <div class="wrapper-inner">
            <button @click="goToAdminHome" class="home-button">Home</button>
            <button class="nutzer-button">Nutzer</button>
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
        return {
            goToAdminHome,
        };
    }
}
</script>

<style scoped>
.wrapper {
    width: 100%; /* full width bar */
    background-color: gray; /* full-width background */
    border-radius: 32px;;
    padding: 8px 0;
    box-sizing: border-box;
}

.wrapper-inner {
    max-width: 100px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
}
</style>