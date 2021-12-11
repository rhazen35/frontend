<template>
  <div class="home ma-15">
    <v-container>
        <v-col>
          <v-card class="pa-4">
            <div class="title">Microservice Architecture</div>
            <div class="sub-title grey--text">Event Driven Architecture</div>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-img
                max-height="600"
                max-width="1000"
                src="@/assets/images/home_banner.png"
                contain
            >
            </v-img>
          </v-card>
        </v-col>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {

    }
  },
  mounted() {
    document.title = 'Home'
  },
}
</script>
