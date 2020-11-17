<template>
  <div id="products">
    <v-card class="card-action">
      <v-col class="text-right">
        <v-dialog v-model="dialogCreate" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              Create new product
            </v-btn>
          </template>
          <ProductForm action="Create" :dialog="dialogCreate" @close-dialog="closeDialog()" />
        </v-dialog>
      </v-col>
    </v-card>

    <ProductsCard :products=products title="test" @view="viewProduct"/>

    <v-dialog v-model="dialogUpdate" :retain-focus="false" max-width="600px">
        <ProductForm
          action="Update"
          :product="selectedProduct"
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
  name: 'Products',
  components: {
    ProductForm,
    ProductsCard
  },
  data() {
    return {
      products: [],
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
          Instance.products = data.result.products;
        })
        .catch((data) => {
          Instance.products = [];
        });
    },
    
    viewProduct(product){
      this.dialogUpdate = true;
      this.selectedProduct = product;
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
