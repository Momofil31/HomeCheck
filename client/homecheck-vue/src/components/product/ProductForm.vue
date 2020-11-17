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
                v-model="name"
                :rules="nameRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Quantity*"
                v-model="quantity"
                type="number"
                min=0
                :rules="quantityRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Expiry date*"
                v-model="expiryDate"
                :rules="expiryDateRules"
                type='date'
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Group*"
                v-model="group"
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
                v-model="category"
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
  props: ['action', 'product'],
  data() {
    return {
      valid: false,
      name: this.$props.product ? this.$props.product.name : '',
      expiryDate: this.$props.product ? this.$props.product.expiryDate : '',
      quantity: this.$props.product ? this.$props.product.quantity : '',
      category: this.$props.product ? this.$props.product.category.id : '',
      group: this.$props.product ? this.$props.product.group.id : '',
      nameRules: [
        (v) => !!v || 'Product name is required',
        (v) => /^[a-zA-Z ]*$/.test(v) || 'Product name must be valid',
      ],
      quantityRules: [(v) => !!v || 'Quantity is required'],
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
          this.$store
            .dispatch('api/products/CreateOne', {
              name: this.name,
              expiryDate: this.expiryDate,
              quantity: this.quantity,
              category: this.category,
              group: this.group,
            })
            .then((response) => {
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
              name: this.name,
              expiryDate: this.expiryDate,
              quantity: this.quantity,
              category: this.category,
              group: this.group,
              id: this.$props.product.id,
            })
            .then((response) => {
              this.$emit('close-dialog');
            });
        }
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
  
  mounted(){
    this.loadCategories();
    this.loadGroups();
    
    if(this.expiryDate !== ''){
      var date = new Date(this.expiryDate);
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var date = date.getDate();
      this.expiryDate = `${year}-${month}-${date}`;
    }
  }
};
</script>

<style></style>
