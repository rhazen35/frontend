<template>
  <v-row justify="space-around">
    <v-col cols="auto">
      <v-dialog
          max-width="600"
          v-model="dialog"
          overlay-opacity="0.90"
          persistent
      >
        <template>
          <v-card dark>
            <v-img
                src="@/assets/images/login_expired.webp"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
            >
              <v-card-title>Login expired</v-card-title>
            </v-img>
            <v-card-title class="text-body-1">
              Your login has expired. You will be redirected to the login page.
            </v-card-title>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'LoginExpired',
    props: ['showDialog'],
    watch: {
      showDialog(value) {
        this.dialog = value
      }
    },
    data () {
      return {
        dialog: this.showDialog
      }
    }
  }
</script>