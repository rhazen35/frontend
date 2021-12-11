<template>
  <validation-observer
      ref="observer"
  >
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
        >
          <v-card-title>Login</v-card-title>
          <v-row justify="center">
            <v-card-text>
              <v-card-subtitle>
                <div style="height: 10px; max-height: 10px; color: #ff726f">{{ errors.global }}</div>
              </v-card-subtitle>
              <form class="pl-4 pr-4">
                <validation-provider
                    v-slot="{ errors }"
                    name="Username"
                    rules="required"
                >
                  <v-text-field
                      prepend-icon="mdi-account-circle"
                      name="username"
                      label="Username"
                      type="text"
                      v-model="form.username"
                      :error-messages="errors"
                      required
                      @input="textFieldChange"
                      color="amber darken-1"
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                    v-slot="{ errors }"
                    name="Password"
                    rules="required"
                >
                  <v-text-field
                      prepend-icon="mdi-key"
                      name="password"
                      label="Password"
                      type="password"
                      v-model="form.password"
                      :error-messages="errors"
                      required
                      @input="textFieldChange"
                      color="amber darken-1"
                  ></v-text-field>
                </validation-provider>
              </form>
            </v-card-text>
            <v-card-actions class="text-right pa-4">
              <v-spacer></v-spacer>
              <v-btn
                  class="mb-3"
                  min-width="200px"
                  color="primary"
                  :disabled="form.invalidForm"
                  @click="authenticate"
                  autofocus
              >
                Login
              </v-btn>
            </v-card-actions>
          </v-row>
          <v-overlay
              :value="form.showOverlay"
              :absolute="form.absoluteOverlay"
              opacity="0.5"
          >
            <v-progress-circular
                :size="70"
                :width="5"
                color="primary"
                indeterminate
            ></v-progress-circular>
          </v-overlay>
        </v-card>
      </v-row>
    </v-container>
    <v-snackbar
        v-model="snackbar.show"
        :timeout="snackbar.timeout"
        absolute
        right
        top
        :color="snackbar.color"
        :multi-line="snackbar.mode === 'multi-line'"
    >
      <v-layout align-center pr-4>
        <v-icon class="pr-3" dark large>mdi-{{ snackbar.icon }}</v-icon>
        <v-layout column>
          <div>
            <strong>{{ snackbar.title }}</strong>
          </div>
          <div>{{ snackbar.text }}</div>
        </v-layout>
      </v-layout>
    </v-snackbar>
  </v-app>
  </validation-observer>
</template>

<script>
  import { required, email } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import AuthenticationSubscriber from '../../utils/modules/authentication/authenticationSubscriber'

  setInteractionMode('eager')

  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  extend('email', {
    ...email,
    message: 'Email must be valid',
  })

  export default {
    name: 'Login',
    components: {
      ValidationProvider,
      ValidationObserver
    },
    computed: {
      showOverlay: {
        get() {
          return this.$store.getters['authentication/showOverlay']
        }
      },
      absoluteOverlay: {
        get() {
          return this.$store.getters['authentication/absoluteOverlay']
        }
      },
      form: {
        get() {
          return this.$store.getters['authentication/form']
        }
      },
      errors: {
        get() {
          return this.$store.getters['authentication/errors']
        }
      },
      snackbar: {
        get() {
          return this.$store.getters['authentication/snackbar']
        }
      },
    },
    mounted() {
      document.title = 'Login'
    },
    created() {
      AuthenticationSubscriber.authenticated()
      AuthenticationSubscriber.invalidCredentials()
    },
    methods: {
      textFieldChange() {
        if (null !== this.username && null !== this.password) {
          this.$store.commit('authentication/invalidForm', false)
          this.$store.commit('authentication/globalError', '')
        }
      },
      authenticate() {
        this.$store.commit('authentication/showOverlay', true)
        this.$refs.observer.validate()
        this.$store.dispatch(
            'authentication/authenticate',
            {
              username: this.form.username,
              password: this.form.password
            }
        )
      },
    },
  };
</script>
<style>
  .v-card__title {
    background-color: #3F51B5;
  }
</style>
