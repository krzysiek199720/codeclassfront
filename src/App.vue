<template>
  <div id="app" v-if="loaded">
    <div id="nav">
      <div class="nav-links">
      <router-link tag="a" :to="{ name: 'search' } ">Search</router-link>
      <template v-if="$store.getters.authIsAuthenticated">
        <router-link tag="a" :to="{ name: 'settings'}">Settings</router-link>
        <router-link tag="a" :to="{ name: 'settingsAdmin'}" v-if="$store.getters.authIsAdmin">Settings Admin</router-link>

      </template>

      </div>
      <div class="nav-other">
        <notification v-if="$store.getters.authIsAuthenticated"></notification>
        <template v-if="!$store.getters.authIsAuthenticated">
          <router-link tag="a" :to="{name: 'login'}">Login</router-link>
          <router-link tag="a" :to="{ name: 'signup'}">Signup</router-link>
        </template>
        <template v-else>
          <router-link tag="a" :to="{ name: 'logout'}">Logout</router-link>
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

body{
  font-family: $font1;
}

input{
  font-family: $font1;
}

//font-family: 'Comfortaa', cursive;

//font-family: 'Architects Daughter', cursive;

body {
  margin: 0;
  background-color: $primary-color;
  color: $text-color1;
}

button {
  color: $highlight-color!important;;
  border: 1px solid $highlight-color!important;;
  background-color: transparent;
  border-radius: 5px;
  font-family: $font2;

  &.follow, &.save, &.publish, &.submit-comment {
    color: $save-color!important;;
    border-color: $save-color!important;;
  }

  &.remove, &.unfollow, &.delete, &.unpublish {
    color: $delete-color!important;;
    border-color: $delete-color!important;;
  }
}

button:hover{
  color: $box-bg-color1!important;
  background-color: $highlight-color!important;
  &.follow, &.save, &.publish, &.submit-comment {
    color: $box-bg-color1!important;
    background-color: $save-color!important;
  }
  &.remove, &.unfollow, &.delete, &.unpublish{
    color: $box-bg-color1!important;
    background-color: $delete-color!important;
  }
}

button:focus{
  box-shadow: 0 0 0 2px rgba($highlight-color, .3);
  &.follow, &.save, &.publish, &.submit-comment {
    box-shadow: 0 0 0 2px rgba($save-color, .3);
  }
  &.remove, &.unfollow, &.delete, &.unpublish{
    box-shadow: 0 0 0 2px rgba($delete-color, .3);
  }
}

a{
  text-decoration: none;
  &:link, &:visited {
    color: inherit;
  }
  &:focus{
    outline: none;
  }
  &:active{
    outline: none;
  }
}

input[type=text]{
  &:hover{
    box-shadow:  0px 3px 4px -3.8px rgba($header-bg-color,0.5)
  }
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
    font-family: $font2;

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
  a {
    color: $highlight-color;
    margin: 0 10px;
    padding: 2px;
    cursor: pointer;
    &:focus {
      outline: none;
    }
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

button{
  outline: 0;
}

.router-link-exact-active{
  text-shadow: $text-shadow;
}

</style>
