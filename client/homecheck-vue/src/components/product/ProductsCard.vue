<template>
  <v-card class="product-card card-content">
    <v-card-title>{{ title }}</v-card-title>
    
    <div class="products-cards">
      <ProductCard 
        v-for="product in products"
        :key="product.id"
        :product=product
        @view=viewProduct
        @delete=deleteProduct />
    </div>
    
  </v-card>
</template>

<script>
  
import ProductCard from '@/components/product/ProductCard.vue';
  
export default {
  name: 'ProductsCard',
  
  components: {
    ProductCard,
  },
  
  props: {
    products: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    } 
  },
  
  watch: {
  },
  
  methods: {
    viewProduct(product){
      this.$emit('view', product);
    },
    
    deleteProduct(productId){
      this.$emit('delete', productId);
    },
  },
};
</script>
