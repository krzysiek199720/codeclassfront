<template>
  <div id="app" v-if="loaded">
    <div id="nav">
      <div class="nav-links">
      <router-link tag="span" :to="'/'">Home</router-link>
      <template v-if="$store.getters.authIsAuthenticated">
        <router-link tag="span" :to="{ name: 'settings'}">Settings</router-link>
        <router-link tag="span" :to="{ name: 'settingsAdmin'}" v-if="$store.getters.authIsAdmin">Settings Admin</router-link>

      </template>

      <router-link tag="span" :to="{ name: 'search' } ">Search</router-link>
      </div>
      <div class="nav-other">
        <notification v-if="$store.getters.authIsAuthenticated"></notification>
        <template v-if="!$store.getters.authIsAuthenticated">
          <router-link tag="span" :to="{name: 'login'}">Login</router-link>
          <router-link tag="span" :to="{ name: 'signup'}">Signup</router-link>
        </template>
        <template v-else>
          <router-link tag="span" :to="{ name: 'logout'}">Logout</router-link>
        </template>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import notification from '@/components/notification/notification'

export default {
  components: {
    notification
  },
  computed: {
    loaded () { return this.$store.getters.loginT }
  },
  beforeCreate () {
    this.$store.dispatch('tryLogin')
  }
}

</script>

<style lang="scss">
@import 'assets/css/fontImport.css';

@import 'assets/css/variables.scss';

*{
  font-family: 'Open Sans', sans-serif;
}

//font-family: 'Comfortaa', cursive;

//font-family: 'Architects Daughter', cursive;

body {
  margin: 0;
  background-color: $primary-color;
}

button{
  border: 1px solid red;
  background-color: transparent;
  border-radius: 5px;
}

#app{
  width: 100%;
  #nav{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: $header-height;
    margin: 0;
    padding: 0 5px ;

    position: fixed;
    z-index: 1000;
    top:0;
    left:0;
    right:0;

    background-color: $header-bg-color;
  }
  &>.content {
    margin-top: $header-height;
  }
}

#nav {
  span {
    color: $highlight-color;
    margin: 0 10px;
    padding: 2px;
    cursor: pointer;
  }
}

#nav .nav-other{
  display: flex;
  flex-direction: row;
}

/* Customize the label (the container) */
label {
  display: block;
  position: relative;
  padding-left: 25px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 18px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  color: $highlight-color;

}

</style>
