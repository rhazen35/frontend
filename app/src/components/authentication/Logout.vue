<template>
  <div></div>
</template>
<script>
  export default {
    created() {
      this.$store.dispatch('authentication/logout');
      this.$router.push('/login');
    }
  }
</script>