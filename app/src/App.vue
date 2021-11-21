<template>
  <div id="app">
    <v-app>
      <v-app-bar
          app
          color="#075AB6"
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

  export default {
    name: 'App',
    components: {
      NavigationDrawer,
      LoginExpiredComponent
    },
    data() {
      return {
        loginExpiredDialog: false
      }
    },
    created() {
      this.authenticationSubscriber()
    },
    computed: {
      isAuthenticated: {
        get() {
          return this.$store.getters['isAuthenticated']
        }
      }
    },
    methods: {
      authenticationSubscriber() {
        const url = new URL('http://127.0.0.1:3000/.well-known/mercure')
        url.searchParams.append('topic', 'http://127.0.0.1:3000/.well-known/mercure/token_expired')

        const eventSource = new EventSource(url)

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data)

          if (Object.prototype.hasOwnProperty.call(data,'token')) {
            this.overlay = true
            this.loginExpiredDialog = true

            this.delay(5000)
                .then(() => {
                  this.loginExpiredDialog = false
                  this.logout()
                })
          }
        }
      },
      logout() {
        this.$router.push('/logout')
      },
      delay(t, v) {
        return new Promise(function(resolve) {
          setTimeout(resolve.bind(null, v), t)
        });
      }
    }
  }
</script>
