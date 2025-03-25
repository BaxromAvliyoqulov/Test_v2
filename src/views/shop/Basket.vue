<template>
    <div v-if="cart.length > 0">
        <h2>Savatcha</h2>
        <ul>
            <li v-for="item in cart" :key="item.id">
                {{ item.name }} - {{ item.quantity }} ta
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['cart']
}
</script>

<style scoped>
/* Styles specific to the basket */
</style>
