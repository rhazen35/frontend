<template v-slot:activator="{ on, attrs }">
  <validation-observer
      ref="observer"
      v-slot="{ invalid }"
  >
    <v-dialog
        v-model="form.dialog"
        max-width="800px"
        overlay-opacity="0.90"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            :loading="form.createLoading"
            color="indigo"
            dark
            class="mb-2"
            v-bind="attrs"
            v-on="on"
        >
          <v-icon left>
            mdi-plus
          </v-icon>
          New User
        </v-btn>
      </template>
      <v-card>
        <v-card-title color="indigo">
          <v-icon left>
            {{ form.titleIcon }}
          </v-icon>
          <span class="text-h5">{{ form.title }}</span>
        </v-card-title>

        <v-card-text>
          <v-container fluid>
            <form
                autocomplete="off"
                @submit.prevent="save"
            >
              <v-row>
                <v-col
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <validation-provider
                      v-slot="{ errors }"
                      name="Firstname"
                      rules="required"
                  >
                    <v-text-field
                        v-model="user.firstName"
                        label="Firstname"
                        color="orange darken-3"
                        :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <validation-provider
                      v-slot="{ errors }"
                      name="Lastname"
                      rules="required"
                  >
                    <v-text-field
                        v-model="user.lastName"
                        label="Lastname"
                        color="orange darken-3"
                        :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <validation-provider
                      v-slot="{ errors }"
                      name="Username"
                      rules="required"
                  >
                    <v-text-field
                        v-model="user.username"
                        label="Username"
                        color="orange darken-3"
                        :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <validation-provider
                      v-slot="{ errors }"
                      name="E-mail"
                      rules="required"
                  >
                    <v-text-field
                        v-model="user.email"
                        label="E-mail"
                        color="orange darken-3"
                        :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <validation-provider
                      v-slot="{ errors }"
                      name="Password"
                      rules="required"
                  >
                    <v-text-field
                        v-if="form.mode === 'create'"
                        v-model="user.password"
                        label="Password"
                        :type="showPassword ? 'text' : 'password'"
                        color="orange darken-3"
                        :append-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPassword = !showPassword"
                        :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <validation-provider
                      v-slot="{ errors }"
                      name="Repeat password"
                      rules="required"
                  >
                    <v-text-field
                        v-if="form.mode === 'create'"
                        v-model="user.passwordRepeat"
                        label="Repeat password"
                        :type="showRepeatPassword ? 'text' : 'password'"
                        color="orange darken-3"
                        :append-icon="!showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showRepeatPassword = !showRepeatPassword"
                        :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
            </form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              left
              absolute
              @click="clear"
          >
            <v-icon left>mdi-autorenew</v-icon>
            clear
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              right
              @click="close"
          >
            <v-icon left>mdi-cancel</v-icon>
            Cancel
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              right
              :disabled="invalid"
              @click="save"
          >
            <v-icon left>mdi-content-save</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>

import { required, email } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import {setFavicon, setDefaultFavicon} from "../../../utils/helpers/favicon";

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
  name: 'CreateUser',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      showPassword: false,
      showRepeatPassword: false
    }
  },
  created() {
    this.$store.commit('user/formTitle')
    this.$store.commit('user/formTitleIcon')
    this.$store.commit('user/mode')
  },
  watch: {
    dialog: {
      handler (value) {
        this.documentTitle(value)
      }
    }
  },
  computed: {
    form: {
      get() {
        return this.$store.getters['user/form']
      }
    },
    user: {
      get() {
        return this.$store.getters['user/user']
      }
    },
    dialog: {
      get() {
        return this.$store.getters['user/form'].dialog
      }
    }
  },
  methods: {
    documentTitle (value) {
      document.title = true === value
          ? 'User Management | ' + this.$store.getters['user/form'].title
          : 'User Management'

      const favIcon = this.form.editedIndex === -1
          ? 'create_user'
          : 'update_user'

      true === value
          ? setFavicon(favIcon)
          : setDefaultFavicon()
    },
    close () {
      this.$store.commit('user/resetEditedItem', false)
      this.$store.commit('user/formTitle')
      this.$store.commit('user/formDialog', false)
    },
    save () {
      this.$refs.observer.validate()
      this.$store.commit('user/createLoading', true)
      if (this.$store.getters['user/form'].editedIndex > -1) {
        console.log('update')
      } else {
        this.$store.dispatch('user/addUser')
        this.$store.commit('user/createLoading', false)
        this.$store.commit('user/resetUser', false)
        this.close()
      }
    },
    clear () {
      this.$store.commit('user/resetUser', false)
      this.$refs.observer.reset()
    }
  }
}
</script>

<style>
  .v-card__title {
    background-color: #3F51B5;
  }
</style>