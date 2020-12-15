<template>
  <div id="home">
    <ProductsCard :products=expiryProducts title="Expiring products" @view="viewProduct" @delete="deleteProduct"/>
    <ProductsCard :products=outStockProducts title="Out of stock products" @view="viewProduct" @delete="deleteProduct"/>

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

      Instance.expiryProducts = [];
      Instance.outStockProducts = [];
      
      this.$store
        .dispatch('api/products/GetList', {})
        .then((data) => {
          var products = data.result.products;
          var today = new Date();
          var tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow = tomorrow.getTime();
          products.forEach(function(product){
            if(product.quantity <= 0) Instance.outStockProducts.push(product);
            
            var expiryDate = (new Date(product.expiryDate)).getTime()
            
            if(expiryDate <= tomorrow) Instance.expiryProducts.push(product);
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

    deleteProduct(productId) {
      const Instance = this;

      this.$store
        .dispatch('api/products/DeleteOne', { id: productId })
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
