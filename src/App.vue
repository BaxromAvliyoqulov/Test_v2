<template>
  <mainLayout>
    <router-view />
  </mainLayout>
</template>

<script>
import MainLayout from '@/layout/mainLayout.vue'
export default {
  components: {
    MainLayout
  }
}
</script>

<style>
a{
  text-decoration: none;
  color: black;
  font-size: 20px;
  font-weight: bold;
}
</style>