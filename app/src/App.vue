<template>
  <div id="app">
    <v-app>
      <v-app-bar
          app
          color="primary"
          class="white--text"
      >
        <v-img
            alt="Skeme Logo"
            class="shrink mr-2"
            contain
            src="@/assets/skeme/skeme-icon.svg"
            transition="scale-transition"
            width="40"
        />
        <v-app-bar-title class="ml-2">Skeme</v-app-bar-title>

        <v-spacer></v-spacer>

        <v-btn
            icon
            @click="logout"
            v-if="isAuthenticated"
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>

      </v-app-bar>
      <NavigationDrawer v-if="isAuthenticated"></NavigationDrawer>
      <v-main>
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
  import NavigationDrawer from './components/layout/NavigationDrawer';

  export default {
    name: 'App',
    components: {
      NavigationDrawer
    },
    data() {
      return {

      }
    },
    computed: {
      isAuthenticated: {
        get() {
          return this.$store.getters['isAuthenticated']
        }
      }
    },
    methods: {
      logout() {
        this.$router.push('/logout')
      }
    }
  }
</script>
