<template>
  <v-card class="product-card card-content">
    <v-card-title>{{ title }}</v-card-title>
    
    <div class="products-cards">
      <v-row>
        <ProductCard 
          v-for="product in products"
          :key="product.id"
          :product=product
          :enableDelete=enableDelete
          @view=viewProduct
          @delete=deleteProduct />
      </v-row>
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
    },
    enableDelete:{
      type: Boolean,
      default: true,
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
