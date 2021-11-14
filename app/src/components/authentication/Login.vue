<template>
  <v-app>
    <v-container
        fluid
        class="mt-16"
    >
      <v-row
          align="center"
          justify="center"
      >
        <v-card
            width="40%"
            height="auto"
            class="pa-2"
        >
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                  prepend-icon="mdi-account-circle"
                  name="username"
                  label="Username"
                  type="text"
                  v-model="username"
              ></v-text-field>
              <v-text-field
                  prepend-icon="mdi-key"
                  name="password"
                  label="Password"
                  type="password"
                  v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="authenticate">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: null,
      password: null,
    }
  },
  created() {
    this.authenticatedSubscriber();
  },
  methods: {
    authenticate() {
      this.$store.dispatch(
          'authenticate',
          {
            username: this.username,
            password: this.password
          }
      );
    },
    authenticatedSubscriber() {
      const url = new URL('http://127.0.0.1:3000/.well-known/mercure');
      url.searchParams.append('topic', 'http://127.0.0.1:3000/.well-known/mercure/user_authenticated') ;

      const eventSource = new EventSource(url);

      eventSource.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        this.$store.dispatch('login', data.token);
        this.$router.push('/');
      });
    }
  }
};
</script>
