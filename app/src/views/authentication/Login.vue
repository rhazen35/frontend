<template>
  <div class="login">
    <LoginComponent></LoginComponent>
  </div>
</template>

<script>
import LoginComponent from "../../components/authentication/Login";

export default {
  name: 'Login',
  components: {
    LoginComponent
  }
}
</script>
