<template>
  <v-card>
    <v-card-title class="headline"> {{ action }} Product </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Product name*"
                v-model="product.name"
                :rules="nameRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Quantity*"
                v-model="product.quantity"
                type="number"
                min="0"
                :rules="quantityRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Expiry date*"
                v-model="product.expiryDate"
                :rules="expiryDateRules"
                type="date"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Group*"
                v-model="product.group"
                :items="groups"
                item-text="name"
                item-value="id"
                :rules="groupRules"
                required
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Category*"
                v-model="product.category"
                :items="categories"
                item-text="name"
                item-value="id"
                :rules="categoryRules"
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
        <small>* indicates required field</small>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        primary
        @click="save"
        :class="{ 'blue darken-4 white--text': valid, disabled: !valid }"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    productId: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      valid: false,
      product: {
        name: '',
        expiryDate: '',
        quantity: '',
        category: '',
        group: '',
      },
      nameRules: [(v) => !!v || 'Product name is required'],
      quantityRules: [(v) => !!`${v}` || 'Quantity is required'],
      expiryDateRules: [(v) => !!v || 'Expiry date is required'],
      groupRules: [(v) => !!v || 'Group is required'],
      categoryRules: [(v) => !!v || 'Category is required'],
      categories: [],
      groups: [],
    };
  },
  methods: {
    save() {
      if (this.$props.action === 'Create') {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('api/products/CreateOne', this.product).then((response) => {
            this.$emit('close-dialog');
            this.name = '';
            this.expiryDate = '';
            this.quantity = '';
            this.category = '';
            this.group = '';
          });
        }
      }
      if (this.$props.action === 'Update') {
        if (this.$refs.form.validate()) {
          this.$store
            .dispatch('api/products/UpdateOne', {
              product: {
                name: this.product.name,
                expiryDate: this.product.expiryDate,
                quantity: this.product.quantity,
                category:
                  typeof this.product.category === 'object'
                    ? this.product.category.id
                    : this.product.category,
                group:
                  typeof this.product.group === 'object'
                    ? this.product.group.id
                    : this.product.group,
              },
              id: this.$props.productId,
            })
            .then((response) => {
              this.$emit('close-dialog');
            });
        }
      }
    },

    addZero(value) {
      if (value < 10) return `0${value}`;
      return value;
    },

    loadProduct() {
      const Instance = this;

      if (this.productId != '') {
        this.$store
          .dispatch('api/products/GetOne', { id: this.productId })
          .then((data) => {
            Instance.product = data.result.product;
            delete Instance.product.id;

            if (Instance.product.expiryDate !== '') {
              var date = new Date(Instance.product.expiryDate);
              var year = date.getFullYear();
              var month = Instance.addZero(date.getMonth() + 1);
              var date = Instance.addZero(date.getDate());
              Instance.product.expiryDate = `${year}-${month}-${date}`;
            }
          })
          .catch((data) => {
            Instance.product = {
              name: '',
              expiryDate: '',
              quantity: '',
              category: '',
              group: '',
            };
          });
      }
    },

    loadCategories() {
      const Instance = this;

      this.$store
        .dispatch('api/categories/GetList', {})
        .then((data) => {
          Instance.categories = data.result.categories;
        })
        .catch((data) => {
          Instance.categories = [];
        });
    },

    loadGroups() {
      const Instance = this;

      this.$store
        .dispatch('api/groups/GetList', {})
        .then((data) => {
          Instance.groups = data.result.groups;
        })
        .catch((data) => {
          Instance.groups = [];
        });
    },
  },

  watch: {
    productId: function() {
      this.loadProduct();
      this.loadCategories();
      this.loadGroups();
    },
  },

  mounted() {
    this.loadProduct();
    this.loadCategories();
    this.loadGroups();
  },
};
</script>

<style></style>
