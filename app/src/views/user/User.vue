<template>
  <div class="ma-15">
    <v-banner
        color="orange darken-3"
        single-line
    >
      Users
    </v-banner>
    <v-data-table
        :headers="headers"
        :items="items"
        :item-class="itemClass"
        :options.sync="options"
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
export default {
  name: 'User',
  data () {
    return {
      totalItems: 0,
      items: [],
      loading: true,
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
      deep: true,
    }
  },
  created() {
    this.userSubscriber()
  },
  methods: {
    userSubscriber() {
      const url = new URL('http://127.0.0.1:3000/.well-known/mercure')
      url.searchParams.append('topic', 'http://127.0.0.1:3000/.well-known/mercure/get_users_result')

      const eventSource = new EventSource(url)

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (Object.prototype.hasOwnProperty.call(data,'users')) {
            const paginationData = data.users;
            this.$store.dispatch('setUsers', paginationData.items).then(() => {
            this.items = this.$store.getters['getUsers']
            this.totalItems = paginationData.totalHits;
          });

          this.loading = false
        }
      }
    },
    getData() {
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
    itemClass() {
      return 'row-class';
    }
  },
}
</script>
<style>
  .v-data-table-header {
    background-color: #404040;
  }
  .v-data-table tbody td {
    font-size: 12px !important;
  }
</style>