<template>
  <div id="app">
    <div id="nav">
      <router-link :to="'/'">Home</router-link>
      <router-link v-if="!$store.getters.authIsAuthenticated" :to="{name: 'login'}">Login</router-link>
      <router-link v-else :to="{ name: 'logout'}">Logout</router-link>
      <router-link :to="{ name: 'signup'}">Signup</router-link>
      <router-link :to="{ name: 'course', params: { id: 1 } } ">Course-1</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  mounted () {
    this.$store.dispatch('tryLogin')
  }
}

</script>

<style lang="scss">

#app{
  #nav{
    display: flex;
    flex-direction: column;
    margin: 100px auto;
  }
}

</style>
