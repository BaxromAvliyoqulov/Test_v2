<template>
  <div class="shop-container">
    <h1>Do'kon</h1>
    <ul class="product-list">
      <Card v-for="item in items" :key="item.id" :item="item" :addToCart="addToCart" />
    </ul>
    <Basket :cart="cart" />
  </div>
</template>

<script>
import Card from './card.vue';
import Basket from './Basket.vue';

export default {
  components: {
    Card,
    Basket
  },
  data() {
    return {
      items: [
        { id: 1, name: 'Mahsulot 1', description: 'Mahsulot tavsifi', price: 100 },
        // Boshqa mahsulotlar
      ],
      cart: []
    };
  },
  filters: {
    toTPCoins(value) {
      // Bu yerda valyuta konvertatsiyasi bo'ladi
      return value;
    }
  },
  methods: {
    addToCart(item) {
      const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cart.push({ ...item, quantity: 1 });
      }
    }
  }
}
</script>

<style scoped>
.shop-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>