<template>
  <v-col cols="12" sm="6" md="6" lg="3">
    <v-card class="product-card" @click=viewProduct>

      <div class="delete-product" v-if="enableDelete" @click.prevent.stop=deleteProduct>
        <v-icon>mdi-delete</v-icon>
      </div>

      <v-img
        width=96 height=96
        :src="iconPath" />

      <v-card-title>
        <span class="product-name"> {{ product.name }} </span>
      </v-card-title>
    </v-card>
  </v-col>
</template>

<script>

export default {
  name: 'ProductCard',
  
  props: ['product', 'enableDelete'],
  
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
