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
                    <AnimatedNumber :number="totalItems"></AnimatedNumber>
                  </div>
                </div>
              </v-card>
            </v-item>
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
        :items="items"
        :options.sync="options"
        :page.sync="options.page"
        :server-items-length="totalItems"
        :loading="loading"
        class="elevation-20"
        multi-sort
        :footer-props="{
          'items-per-page-options': [10, 20, 30, 40, 50, 100]
        }"
    >
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
  </div>
</template>

<script>
import AnimatedNumber from "../../components/layout/AnimatedNumber";

export default {
  name: 'User',
  components: {
      AnimatedNumber
  },
  data () {
    return {
      totalItems: 0,
      items: [],
      loading: false,
      options: {},
      headers: [
        {text: 'Name', value: 'fullName'},
        {text: 'Username', value: 'username'},
        {text: 'Email', value: 'email'},
        {text: 'Last login', value: 'lastLogin'},
        {text: 'CreatedAt', value: 'createdAt'},
      ]
    }
  },
  watch : {
    options: {
      handler () {
          this.getData()
      },
    }
  },
  created() {
    this.userSubscriber()
  },
  methods: {
    userSubscriber() {
      const hasTopic = this.$store.getters.hasTopic('get_users_result')

      const eventSource = !hasTopic
        ? this.$mercureSubscriber.subscribe(['get_users_result'])
        : this.$store.getters['getEventSource']

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (Object.prototype.hasOwnProperty.call(data,'users')) {
            const paginationData = data.users;
            this.loading = false
            this.totalItems = paginationData.totalHits;
            this.items = paginationData.items;
        }
      }
    },
    getData() {
      this.items = []
      this.loading = true;

      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      let sortOrder = [];
      if (0 !== sortDesc.length) {
        for (const sort of sortDesc) {
          sortOrder.push(sort ? 'desc': 'asc')
        }
      }

      this.$store.dispatch(
          'getUsers',
          {
            sortBy: sortBy,
            sortOrder: sortOrder,
            page: page,
            itemsPerPage: itemsPerPage
          }
      )
    },
  },
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