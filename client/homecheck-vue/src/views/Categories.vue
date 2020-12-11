<template>
  <div id="categories">
    <v-card class="card-action">
      <v-col class="text-right">
        <v-dialog v-model="dialogCreate" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              Add category
            </v-btn>
          </template>
          <CategoryForm
            v-if="dialogCreate"
            action="Add"
            :dialog="dialogCreate"
            @close-dialog="closeDialog()"
          />
        </v-dialog>
      </v-col>
    </v-card>
    <v-card class="card-content">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                Products
              </th>
              <th class="text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categories" :key="item.name">
              <td>{{ item.name }}</td>
              <td>0</td>
              <td>
                <v-dialog
                  v-model="dialogUpdate"
                  :retain-focus="false"
                  max-width="600px"
                  v-if="!item.default"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">mdi-pencil</v-icon>
                  </template>
                  <CategoryForm
                    action="Update"
                    :category="item"
                    :dialog="dialogUpdate"
                    @close-dialog="closeDialog()"
                  />
                </v-dialog>
                <v-icon v-if="!item.default" @click="deleteCategory(item)">mdi-delete</v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import CategoryForm from '@/components/categories/CategoryForm.vue';

export default {
  name: 'Categories',
  components: {
    CategoryForm,
  },
  data() {
    return {
      categories: [],
      dialogCreate: false,
      dialogUpdate: false,
    };
  },

  methods: {
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

    deleteCategory(category) {
      const Instance = this;

      this.$store
        .dispatch('api/categories/DeleteOne', { id: category.id })
        .then((data) => {
          Instance.loadCategories();
        })
        .catch((data) => {});
    },

    closeDialog() {
      this.dialogCreate = false;
      this.dialogUpdate = false;

      this.loadCategories();
    },
  },

  mounted() {
    this.loadCategories();
  },
};
</script>
