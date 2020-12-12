<template>
  <div id="products">

    <ProductsCard
        v-for="group in groups"
        :key="group.id"
        :products="group.products"
        :title="group.name"
        :enableDelete=false
        @view="viewProduct"
    />

    <v-dialog v-model="dialogUpdate" :retain-focus="false" max-width="600px">
      <ProductForm
          action="View"
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
  name: 'Sharing',
  components: {
    ProductForm,
    ProductsCard,
  },
  data() {
    return {
      groups: [],
      dialogUpdate: false,
      selectedProduct: {},
    };
  },

  methods: {
    loadProducts() {
      const Instance = this;
      Instance.groups = [];
      this.$store
        .dispatch('api/sharing/GetGroups', { token: this.$route.params.token })
        .then((data) => {
          const { groups } = data.result;
          groups.forEach((group) => {
            Instance.$store
              .dispatch('api/sharing/GetProducts', { token: this.$route.params.token, group: group.id })
              .then((data) => {
                group.products = data.result.products;
                Instance.groups.push(group);
              })
              .catch((data) => {
                Instance.groups = [];
              });
          });
        })
        .catch((data) => {
          Instance.groups = [];
        });
    },

    viewProduct(product) {
      this.selectedProduct = product;
      this.dialogUpdate = true;
    },

    closeDialog() {
      this.dialogUpdate = false;
      this.loadProducts();
    },
  },

  mounted() {
    this.loadProducts();
  },
};
</script>
