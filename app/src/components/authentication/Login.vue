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
          <v-row
              justify="center"
              class="pa-2"
          >
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-card-subtitle>
                <div style="height: 10px; max-height: 10px; color: #ff726f">{{ errors.global }}</div>
              </v-card-subtitle>
              <form>
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
            <v-card-actions class="text-right">
              <v-spacer></v-spacer>
              <v-btn
                  class="mb-3"
                  min-width="200px"
                  color="primary"
                  @click="authenticate"
                  :disabled="invalidForm"
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
    >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="snackbar.closeButtonColor"
            text
            v-bind="attrs"
            @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
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
          text: '',
          color: null,
          closeButtonColor: null,
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
        this.$refs.observer.validate()
        this.enableLoading()
        this.$store.dispatch(
            'authenticate',
            {
              username: this.username,
              password: this.password
            }
        )
      },
      authenticatedSubscriber() {
        const url = new URL('http://127.0.0.1:3000/.well-known/mercure');
        url.searchParams.append('topic', 'http://127.0.0.1:3000/.well-known/mercure/user_authenticated');
        url.searchParams.append('topic', 'http://127.0.0.1:3000/.well-known/mercure/invalid_credentials');

        const eventSource = new EventSource(url)

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data)

          this.disableLoading()

          if (Object.prototype.hasOwnProperty.call(data,'errors')) {
            data.errors.forEach((error) => {
              if ("" === error.propertyPath) {
                this.errors.global = error.message;
                this.snackbar.text = 'The form contains validation errors';
                this.snackbar.color = 'error';
                this.snackbar.closeButtonColor = 'black';
                this.snackbar.show = true;
              }
            });
          }

          if (Object.prototype.hasOwnProperty.call(data,'token')) {
            this.$store.dispatch('login', data.token)
            if (this.$route.path !== '/') {
              this.$router.push('/')
            }
          }
        };
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
