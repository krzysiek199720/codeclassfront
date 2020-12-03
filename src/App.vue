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

/* Hide the browser's default checkbox */
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 5px;
    left: 5px;
    height: 16px;
    width: 16px;
    background-color: $highlight-color;
  }
  /* On mouse-over, add a grey background color */
  &:hover input ~ .checkmark {
    background-color: $text-color;
  }

  /* When the checkbox is checked, add a blue background */
  input:checked ~ .checkmark {
    background-color: $highlight-color;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .checkmark:after {
    left: 5px;
    top: 2px;
    width: 3px;
    height: 7px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
}

</style>
