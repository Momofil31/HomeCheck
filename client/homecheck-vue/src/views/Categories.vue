<template>
  <div id="categories">
    <v-card class="card-action">
      <v-col class="text-right">
        <v-btn color="primary">Create new category</v-btn>  
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
            <tr
              v-for="item in categories"
              :key="item.name"
            >
              <td>{{ item.name }}</td>
              <td>0</td>
              <td>
                <v-icon>mdi-pencil</v-icon>
                <v-icon v-if='!item.default' @click="deleteCategory(item)">mdi-delete</v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
    
  export default {
    name: 'Categories',
    
    data() {
      return {
        categories: [],
      }
    },

    methods: {
      loadCategories: function(){
        
        let Instance = this;
        
        this.$store.dispatch("api/categories/GetList", {})
        .then(function(data){
          Instance.categories = data.result.categories;
        }).catch(function(data){
          Instance.categories = [];
        });
      },
      
      deleteCategory: function(category){
        
        let Instance = this;

        this.$store.dispatch("api/categories/DeleteOne", {id: category.id})
        .then(function(data){
          Instance.loadCategories();
        }).catch(function(data){
          
        });
      }
    },
    
    mounted() {
      this.loadCategories();
    }

  };
</script>