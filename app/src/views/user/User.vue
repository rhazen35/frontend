<template>
  <div class="ma-15">
    <v-container fluid class="pa-0 ma-0">
      <v-item-group>
        <v-row>
          <v-col>
            <v-item>
              <v-card
                  :color="''"
                  class="d-flex pa-6 justify-center"
                  dark
                  height="100"
              >
                <div class="d-flex align-content-sm-space-between flex-grow-1">
                  <div class="flex-grow-0">
                    <v-icon
                        x-large
                    >
                      mdi-account-group
                    </v-icon>
                  </div>

                    <div
                        class="flex-grow-1 text-center text-h5 pt-2"
                    >
                      Users
                    </div>
                </div>
              </v-card>
            </v-item>
          </v-col>
          <v-col
              cols="12"
              md="4"
          >
            <v-item>
              <v-card
                  :color="''"
                  class="d-flex pa-6"
                  dark
                  height="100"
              >
                <div class="d-flex align-content-sm-space-between flex-grow-1">
                  <div class="text-body-1 flex-grow-1">
                    Total Users
                  </div>
                  <div class="text-h3 flex-grow-1">
                    <AnimatedNumber></AnimatedNumber>
                  </div>
                </div>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
        <v-row>
          <v-col
              cols="8"
          >
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                class="mb-2"
            ></v-text-field>
          </v-col>
          <v-col
              cols="4"
              class="text-right"
          >
            <CreateUser></CreateUser>
          </v-col>
        </v-row>
      </v-item-group>
    </v-container>
    <v-banner
        color="orange darken-3"
        single-line
    >
    </v-banner>
    <v-data-table
        :headers="headers"
        :items="table.items"
        :options.sync="table.options"
        :page.sync="table.options.page"
        :server-items-length="table.totalItems"
        :loading="table.loading"
        :search="search"
        class="elevation-20"
        multi-sort
        :footer-props="{
          'items-per-page-options': [10, 20, 30, 40, 50, 100]
        }"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:item.fullName="{ item }">
          <span>{{ item.fullName }}</span>
      </template>
      <template v-slot:item.createdAt="{ item }">
        <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
      </template>
      <template v-slot:item.lastLogin="{ item }">
        <span>{{ null !== item.lastLogin ? new Date(item.lastLogin).toLocaleString() : "" }}</span>
      </template>
    </v-data-table>
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
    <v-dialog
        v-model="dialogDelete"
        max-width="500px"
        overlay-opacity="0.90"
    >
      <v-card>
        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="red darken-1"
              text
              @click="closeDelete"
          >
            <v-icon left>mdi-cancel</v-icon>
            Cancel
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="deleteItemConfirm"
          >
            <v-icon left>mdi-check</v-icon>
            OK
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AnimatedNumber from "../../components/layout/AnimatedNumber"
import UserSubscriber from '../../utils/modules/user/userSubscriber'
import {debounce} from '../../utils/helpers/helper'
import CreateUser from "../../components/modules/user/CreateUser.vue"
import UserData from '../../utils/modules/user/userData'
import {setDefaultFavicon, setFavicon} from "../../utils/helpers/favicon";

export default {
  name: 'User',
  components: {
    AnimatedNumber,
    CreateUser
  },
  data () {
    return {
      headers: [
        {text: 'Name', value: 'fullName'},
        {text: 'Username', value: 'username'},
        {text: 'Email', value: 'email'},
        {text: 'Last login', value: 'lastLogin'},
        {text: 'Created At', value: 'createdAt'},
        { text: 'Actions', value: 'actions', sortable: false },
      ]
    }
  },
  watch : {
    options: {
      handler () {
        UserData.getData()
      }
    },
    search: {
      handler: debounce(function () {
        UserData.getData()
      }, 500)
    },
    dialogDelete (value) {
      value || this.closeDelete()
      this.documentTitle(value)
    },
  },
  computed: {
    table: {
      get() {
        return this.$store.getters['user/table']
      }
    },
    options: {
      get () {
        return this.$store.getters['user/options']
      }
    },
    search: {
      get() {
        return this.$store.getters['user/table'].search
      },
      set(value) {
        this.$store.commit('user/search', value)
      }
    },
    snackbar: {
      get() {
        return this.$store.getters['user/snackbar']
      }
    },
    dialogDelete: {
      get() {
        return this.$store.getters['user/form'].dialogDelete
      }
    }
  },
  mounted() {
    document.title = 'User Management'
  },
  created() {
    this.userSubscriber()
  },
  methods: {
    userSubscriber() {
      UserSubscriber.getUsers()
      UserSubscriber.userCreated()
      UserSubscriber.userDeleted()
    },
    editItem (item) {
      this.$store.dispatch(
          'user/editDialog',
          {
            editedIndex: this.table.items.indexOf(item),
            editedItem: item,
            formDialog: true
          }
      )
    },
    close () {
      this.$store.commit('user/formDialog', false)
    },
    deleteItem (item) {
      this.$store.commit('user/editedItem', item)
      this.$store.commit('user/deleteDialog', true)
    },
    deleteItemConfirm () {
      this.$store.dispatch('user/deleteUser')
      this.closeDelete()
    },
    closeDelete () {
      this.$store.commit('user/deleteDialog', false)
    },
    documentTitle (value) {
      document.title = true === value
          ? 'User Management | Delete User'
          : 'User Management'

      true === value
          ? setFavicon('delete_user')
          : setDefaultFavicon()
    },
  }
}
</script>
<style>
  .v-data-table-header {
    background-color: #404040;
  }
  .v-data-table-header th {
    font-size: 13px !important;
  }
  .v-data-table tbody td {
    font-size: 12px !important;
  }
</style>