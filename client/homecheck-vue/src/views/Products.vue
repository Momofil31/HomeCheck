<template>
  <div id="products">
    <v-card class="card-action">
      <v-col class="text-right">
        <v-dialog v-model="dialogCreate" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              Add product
            </v-btn>
          </template>
          <ProductForm action="Add" :dialog="dialogCreate" @close-dialog="closeDialog()" />
        </v-dialog>
      </v-col>
    </v-card>

    <ProductsCard
      v-for="group in groups"
      :key="group.id"
      :products="group.products"
      :title="group.name"
      @view="viewProduct"
      @delete="deleteProduct"
    />

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
  name: 'Products',
  components: {
    ProductForm,
    ProductsCard,
  },
  data() {
    return {
      groups: [],
      dialogCreate: false,
      dialogUpdate: false,
      selectedProduct: {},
    };
  },

  methods: {
    loadProducts() {
      const Instance = this;
      Instance.groups = [];
      this.$store
        .dispatch('api/groups/GetList', {})
        .then((data) => {
          var groups = data.result.groups;
          groups.forEach(function(group) {
            Instance.$store
              .dispatch('api/products/GetList', { group: group.id })
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
