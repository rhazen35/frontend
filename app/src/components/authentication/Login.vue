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
                      v-model="username"
                      :error-messages="errors"
                      required
                      @input="textFieldChange"
                      autofocus
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
                      v-model="password"
                      :error-messages="errors"
                      required
                      @input="textFieldChange"
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
                  :disabled="invalidForm"
                  @click="authenticate"
              >
                Login
              </v-btn>
            </v-card-actions>
          </v-row>
          <v-overlay
              :value="showOverlay"
              :absolute="absolute"
              :opacity="opacity"
          >
            <v-progress-circular
                :size="70"
                :width="5"
                :color="progressCircularColor"
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
    data() {
      return {
        username: null,
        password: null,
        showOverlay: false,
        absolute: true,
        opacity: 0.5,
        progressCircularColor: 'primary',
        progressCircularColors: ['amber', 'red', 'purple', 'green', 'primary'],
        invalidForm: true,
        errors: {
          global: '',
        },
        snackbar: {
          show: false,
          title: null,
          text: null,
          color: null,
          icon: null,
          mode: null,
          timeout: 7000,
        }
      }
    },
    created() {
      this.authenticatedSubscriber();
    },
    methods: {
      textFieldChange() {
        if (null !== this.username && null !== this.password) {
          this.invalidForm = false;
          this.errors.global = ''
        }
      },
      authenticate() {
        this.enableLoading()
        this.$refs.observer.validate()
        this.$store.dispatch(
            'authenticate',
            {
              username: this.username,
              password: this.password
            }
        )
      },
      authenticatedSubscriber() {
        const eventSource = this.$mercureSubscriber.subscribe(['user_authenticated', 'invalid_credentials'])
        eventSource.onmessage = () => {
          const data = JSON.parse(event.data)

          this.disableLoading()

          if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
            data.errors.forEach((error) => {
              if ("" === error.propertyPath) {
                this.errors.global = error.message;
                this.snackbar.title = 'Validation error';
                this.snackbar.text = 'The form contains validation errors';
                this.snackbar.color = 'error';
                this.snackbar.icon = 'alert-circle';
                this.snackbar.show = true;
              }
            });
          }

          if (Object.prototype.hasOwnProperty.call(data, 'token')) {
            this.$store.dispatch('login', data.token)
            if (this.$route.path !== '/') {
              this.$router.push('/')
            }
          }
        }
      },
      enableLoading() {
        this.showOverlay = true;
      },
      disableLoading() {
        this.showOverlay = false;
      }
    },
  };
</script>
<style>
  .v-card__title {
    background-color: #2196F3;
  }
</style>
