<template v-slot:activator="{ on, attrs }">
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
        {{ form.title }}
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
          <form>
            <v-row>
              <v-col
                  cols="12"
                  sm="6"
                  md="6"
              >
                <v-text-field
                    v-model="user.firstName"
                    label="Firstname"
                    color="orange darken-3"
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="6"
              >
                <v-text-field
                    v-model="user.lastName"
                    label="Lastname"
                    color="orange darken-3"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                  cols="12"
                  sm="6"
                  md="6"
              >
                <v-text-field
                    v-model="user.username"
                    label="Username"
                    color="orange darken-3"
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="6"
              >
                <v-text-field
                    v-model="user.email"
                    label="E-mail"
                    color="orange darken-3"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                  cols="12"
                  sm="6"
                  md="6"
              >
                <v-text-field
                    v-model="user.password"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    color="orange darken-3"
                    :append-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="6"
              >
                <v-text-field
                    v-model="user.passwordRepeat"
                    label="Repeat password"
                    :type="showRepeatPassword ? 'text' : 'password'"
                    color="orange darken-3"
                    :append-icon="!showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showRepeatPassword = !showRepeatPassword"
                ></v-text-field>
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
            @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'CreateUser',
  data() {
    return {
      showPassword: false,
      showRepeatPassword: false
    }
  },
  created() {
    this.$store.commit('formTitle')
    this.$store.commit('formTitleIcon')
  },
  computed: {
    form: {
      get() {
        return this.$store.getters.form
      }
    },
    user: {
      get() {
        return this.$store.getters.user
      }
    },
    progressCircularColor: {
      get() {
        return this.$store.getters.progressCircularColor
      }
    },
  },
  methods: {
    close () {
      this.$store.commit('formDialog', false)
      this.$nextTick(() => {
        this.$store.commit('editedItem', Object.assign({}, this.$store.getters.form.defaultItem))
        this.$store.commit('editedIndex', -1)
      })
    },
    save () {
      this.$store.commit('createLoading', true)
      if (this.$store.getters.form.editedIndex > -1) {
        console.log('update')
      } else {
        this.$store.dispatch('addUser')
        this.$store.commit('createLoading', false)
        this.close()
      }
    },
  }
}
</script>

<style>
  .v-card__title {
    background-color: #3F51B5;
  }
</style>