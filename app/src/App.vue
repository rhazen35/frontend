<template>
  <div id="app">
    <v-app>
      <v-app-bar
          app
          color="#3F51B5"
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
          <v-scroll-x-transition mode="out-in" appear>
            <router-view/>
          </v-scroll-x-transition>
          <LoginExpiredComponent :showDialog="loginExpiredDialog"></LoginExpiredComponent>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
  import NavigationDrawer from './components/layout/NavigationDrawer';
  import LoginExpiredComponent from "./components/authentication/LoginExpired";
  import AuthenticationSubscriber from './utils/modules/authentication/authenticationSubscriber'

  export default {
    name: 'App',
    components: {
      NavigationDrawer,
      LoginExpiredComponent
    },
    created() {
      AuthenticationSubscriber.tokenExpired()
    },
    computed: {
      isAuthenticated: {
        get() {
          return this.$store.getters['authentication/isAuthenticated']
        }
      },
      loginExpiredDialog: {
        get() {
          return this.$store.getters['authentication/loginExpiredDialog']
        }
      },
    },
    methods: {
      logout() {
        this.$router.push('/logout')
      },
    }
  }
</script>
