<template>
    <div class="mainLayout">
        <Navbar />
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script>
import Navbar from '../components/navbar.vue'
export default {
    components: {
        Navbar
    }
}
</script>

<style></style>