<template>
  <div id="user-admin-panel">
    <div class="search-panel">
      <input type="text" v-model="searchQuery" placeholder="User search">
      <div class="select" id="search-div">
        <select name="role" id="role" v-model="selectedRole" >
          <option class="role-option" :value="null">----</option>
          <option v-for="role in roles" :key="role.id" class="role-option" :value="role">{{role.name}}</option>
        </select>
      </div>
      <button class="search" @click="search">Search</button>
    </div>
    <div class="users">
      <div class="user" v-for="(user, index) in users" :key="user.id">
        <div class="name">
          <span class="firstname">{{user.firstName}}</span> <span class="lastname">{{user.lastName}}</span>
        </div>
        <div class="email">{{user.email}}</div>
<!--        <select name="role" :id="'user' + user.id" v-model.lazy="users[index].roleId" @change="changeRole(user, $event)">-->
        <div class="select">
          <select name="role" :id="'user' + user.id" :value="users[index].roleId" @change="changeRole(user, $event)">
            <option v-for="role in roles" :key="role.id" class="role-option" :value="role.id">{{role.name}}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios/axios'
import qs from 'qs'

export default {
  name: 'userAdminPanel',
  props: ['roles'],
  data () {
    return {
      searchQuery: '',
      selectedRole: null,
      users: []
    }
  },
  methods: {
    changeRole (user, event) {
      const data = {
        roleId: parseInt(event.target.value)
      }
      axios.put('/user/' + user.id + '/role', data)
        .then(res => {
          user = res.data
        })
        .catch(_ => {
          this.$forceUpdate() // prevent select from showing value that could not be applied
        })
    },
    search () {
      const params = {
        searchQuery: this.searchQuery,
        roleId: this.selectedRole === null ? null : this.selectedRole.id
      }

      axios.get('/user', {
        params: params,
        paramsSerializer: params => {
          return qs.stringify(params, { indices: false })
        }
      })
        .then(res => {
          this.users = res.data
        })
    }
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

#user-admin-panel{

  .search{
    margin-left: 10px;
    width: 15%;
    height: 30px;
    color: $save-color;
    border-color: $save-color;
  }

  .search:hover{
    color: $header-bg-color;
    background-color: $save-color;
  }

  input{
    width: 15%;
    height: 30px;
    color: $input-color;
    border: 0;
    border-bottom: 1px solid $input-color;
    background-color: transparent;
  }
  input::placeholder{
    color: $input-placeholder-color;
  }
  input:focus, input:active, input:hover{
    border: 0;
    border-bottom: 1px solid $highlight-color;
    outline: 0;
  }

  .search-panel{
    display: flex;
    flex-direction: row;
  }

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none;
    outline: 0;
    box-shadow: none;
    border: 0 !important;
    background: $primary-color;
    background-image: none;
  }
  select::-ms-expand {
    display: none;
  }
  .select {
    position: relative;
    display: flex;
    width: 100%;
    height: 30px;
    line-height: 3;
    background: $primary-color;
    overflow: hidden;
    border-radius: .25em;
  }

  #search-div{
    width: 15%!important;
    margin-left: 10px;
  }

  select {
    flex: 1;
    padding: 0 .5em;
    color: $text-color;
    cursor: pointer;
  }
  .select::after {
    content: '\25BC';
    position: absolute;
    top: -0.5em;
    right: 0;
    padding: 0 0.5em;
    background: $primary-color;
    color: $secondary-color;
    cursor: pointer;
    pointer-events: none;
    -webkit-transition: .25s all ease;
    -o-transition: .25s all ease;
    transition: .25s all ease;
  }
  .select:hover::after {
    color: $text-color;
  }

  .users{
    border-top: rgba($text-color, 0.3) 1px solid;
    padding-top: 10px;
    margin-top: 10px;
  }

  .user{
    display: grid;
    grid-template-columns: 5fr 7fr 3fr 8fr;
    .email, .select{
      margin-left: 35px;
    }
  }

  .user+.user{
    margin-top:10px;
  }

}

</style>
