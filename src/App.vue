<template>
  <div id="app">
    <div id="nav">
      <router-link :to="'/'">Home</router-link>
      <template v-if="!$store.getters.authIsAuthenticated">
        <router-link :to="{name: 'login'}">Login</router-link>
        <router-link :to="{ name: 'signup'}">Signup</router-link>
      </template>
      <template v-else>
        <router-link :to="{ name: 'settings'}">Settings</router-link>
<!--        fixme is admin \/-->
        <router-link :to="{ name: 'settingsAdmin'}" v-if="$store.getters.authIsAdmin">Settings Admin</router-link>
        <router-link :to="{ name: 'logout'}">Logout</router-link>
      </template>
      <router-link :to="{ name: 'search' } ">Search</router-link>
      <notification v-if="$store.getters.authIsAuthenticated"></notification>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

import notification from '@/components/notification/notification'

export default {
  components: {
    notification
  },
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
