<template>
  <v-card
      class="mx-auto"
  >
    <v-navigation-drawer
        app
        permanent
        dark
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            User Avatar here
          </v-list-item-title>
          <v-list-item-subtitle>
            user name here
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
          dense
          nav
      >
        <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: 'NavigationDrawer',
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'mdi-home',
          path: '/'
        },
        {
          title: 'User Management',
          icon: 'mdi-account-group',
          path: '/users'
        },
        {
          title: 'About',
          icon: 'mdi-information',
          path: '/about'
        }
      ]
    }
  }
}
</script>