<template>
  <v-card class="product-card" @click=viewProduct>
    
    <div class="delete-product" @click.prevent.stop=deleteProduct>
      <v-icon>mdi-delete</v-icon>
    </div>
    
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
    },
    
    deleteProduct(){
      this.$emit('delete', this.$props.product.id);
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
