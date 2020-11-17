<template>
  <div id="home">
    <ProductsCard :products=expiryProducts title="Expiring products" @view="viewProduct"/>
    <ProductsCard :products=outStockProducts title="Out of stock products" @view="viewProduct"/>

    <v-dialog v-model="dialogUpdate" :retain-focus="false" max-width="600px">
        <ProductForm
          action="Update"
          :product-id="selectedProduct.id"
          :dialog="dialogUpdate"
          @close-dialog="closeDialog()"
        />
    </v-dialog>
  </div>
</template>

<script>
import ProductForm from '@/components/product/ProductForm.vue';
import ProductsCard from '@/components/product/ProductsCard.vue';

export default {
  name: 'Home',
  components: {
    ProductForm,
    ProductsCard
  },
  data() {
    return {
      expiryProducts: [],
      outStockProducts: [],
      dialogCreate: false,
      dialogUpdate: false,
      selectedProduct: {},
    };
  },

  methods: {
    loadProducts() {
      const Instance = this;

      this.$store
        .dispatch('api/products/GetList', {})
        .then((data) => {
          var products = data.result.products;
          var today = (new Date()).getTime();
          products.forEach(function(product){
            if(product.quantity <= 0) Instance.outStockProducts.push(product);
            
            var expiryDate = (new Date(product.expiryDate)).getTime()
            
            if(expiryDate <= today) Instance.expiryProducts.push(product);
          })
        })
        .catch((data) => {
          Instance.expiryProducts = [];
          Instance.outStockProducts = [];
        });
    },
    
    viewProduct(product){
      this.selectedProduct = product;
      this.dialogUpdate = true;
    },

    deleteProduct(product) {
      const Instance = this;

      this.$store
        .dispatch('api/products/DeleteOne', { id: product.id })
        .then((data) => {
          Instance.loadProducts();
        })
        .catch((data) => {});
    },

    closeDialog() {
      this.dialogCreate = false;
      this.dialogUpdate = false;
      this.loadProducts();
    },
  },

  mounted: function() {
    this.loadProducts();
  },
};
</script>
