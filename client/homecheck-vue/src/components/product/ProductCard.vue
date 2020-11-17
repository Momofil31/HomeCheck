<template>
  <v-card class="product-card" @click=viewProduct>
    <v-img
      width=96 height=96
      :src="iconPath" />
    
    <v-card-title>
      <span class="product-name"> {{ product.name }} </span>
    </v-card-title>
  </v-card>
</template>

<script>

export default {
  name: 'ProductCard',
  
  props: ['product'],
  
  methods: {
    viewProduct(){
      this.$emit('view', this.$props.product);
    }
  },
  
  computed: {
    iconPath: function(){
      return require(`@/assets/icons/${this.$props.product.category.icon}`)
    }
  },

  data: () => ({
    //
  }),
};
</script>
