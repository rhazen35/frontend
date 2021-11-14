<template>
  <div>You have been logged out.</div>
</template>
<script>
  export default {
    created() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  }
</script>