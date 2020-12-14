<template>
  <v-card>
    <v-card-title class="headline"> {{ action }} Category </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Category name*"
                v-model="name"
                :rules="nameRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Icon*"
                v-model="selectIcon"
                :items="categoryIcons"
                item-text="name"
                item-value="icon"
                :rules="iconRules"
                required
              >
                <template v-slot:selection="{ item }">
                  <v-avatar width="32px" height="32px" min-width="32px" class="ma-1">
                    <img :src="require(`@/assets/icons/${item.icon}`)" />
                  </v-avatar>
                  <div>{{ item.name }}</div>
                </template>
                <template v-slot:item="{ item }">
                  <v-list-item-avatar width="32px" height="32px" min-width="32px">
                    <img
                      :src="require(`@/assets/icons/${item.icon}`)"
                    />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title> {{ item.name }} </v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-select>
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
  props: ['action', 'category'],
  data() {
    return {
      valid: false,
      name: this.$props.category ? this.$props.category.name : '',
      categoryIcons: [
        { name: 'Bread and Cereals', icon: 'bread.jpg' },
        { name: 'Beverages', icon: 'beverages.jpg' },
        { name: 'Fruit', icon: 'fruit.jpg' },
        { name: 'Meat', icon: 'meat.jpg' },
        { name: 'Pasta', icon: 'pasta.jpg' },
        { name: 'Vegetables', icon: 'vegetables.jpg' },
      ],
      selectIcon: this.$props.category ? this.$props.category.icon : '',
      nameRules: [
        (v) => !!v || 'Category name is required',
        (v) => /^[a-zA-Z ]*$/.test(v) || 'Category name must be valid',
      ],
      iconRules: [(v) => !!v || 'Icon is required'],
    };
  },
  methods: {
    save() {
      if (this.$props.action === 'Add') {
        if (this.$refs.form.validate()) {
          this.$store
            .dispatch('api/categories/CreateOne', {
              name: this.name,
              icon: this.selectIcon,
            })
            .then((response) => {
              this.$emit('close-dialog');
            });
        }
      }
      if (this.$props.action === 'Update') {
        if (this.$refs.form.validate()) {
          this.$store
            .dispatch('api/categories/UpdateOne', {
              name: this.name,
              icon: this.selectIcon,
              id: this.$props.category.id,
            })
            .then((response) => {
              this.$emit('close-dialog');
            });
        }
      }
    },
  },
};
</script>

<style></style>
