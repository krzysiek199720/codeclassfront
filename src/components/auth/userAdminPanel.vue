<template>
  <div id="user-admin-panel">
    <div class="title-container">
      <div class="title">User Admin Panel</div>
    </div>
    <div class="top-section">
      <div class="text-container">
        <input type="text" v-model="searchQuery" placeholder="User search">
      </div>
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
    width: 150px;
    width: 150px;
    height: 30px;
    color: $save-color;
    border-color: $save-color;
  }

  .title-container{
    display: flex;
    justify-content: space-between;
  }
  .title{
    font-family: $font2;
    color: $text-color2;
    font-size: 20px;
  }

  .search:hover{
    color: $box-bg-color1;
    background-color: $save-color;
  }

  .text-container{
    display: flex;
    flex-direction: column;
    width: 200px;
  }

  input{
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

  .top-section{
    border-bottom: $box-border1;
    padding-bottom: 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
  }

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -webkit-transition: .25s all ease;
    -o-transition: .25s all ease;
    transition: .25s all ease;
    appearance: none;
    outline: 0;
    box-shadow: none;
    border: 0 !important;
    background: $box-bg-color2;
    background-image: none;
  }
  select::-ms-expand {
    display: none;
  }
  .select {
    width: 200px;
    position: relative;
    display: flex;
    height: 30px;
    line-height: 3;
    overflow: hidden;
    margin-left: 10px;
    &:hover select, select:focus {
      color: $box-bg-color1;
      background-color: $header-bg-color;
      option {
        color: $text-color;
        background: $box-bg-color1;
      }
    }
  }

  select {
    width: 200px;
    padding: 0 .5em;
    color: $text-color;
    border-radius: 5px;
    cursor: pointer;
  }
  .select::after {
    content: '\25BC';
    position: absolute;
    overflow: hidden;
    font-size: 10px;
    color: $text-color2;
    cursor: pointer;
    pointer-events: none;
    -webkit-transition: .25s all ease;
    -o-transition: .25s all ease;
    transition: .25s all ease;
    right: 0;
    padding: 0 0.8em;
    height: 30px;
    border-radius: 5px;

  }
  .select:hover::after {
    color: $box-bg-color1;
  }

  .users{
    margin-top: 20px;
  }

  .user{
    display: grid;
    grid-template-columns: 5fr 7fr 4fr 7fr;
    .email, .select{
      padding-left: 20px;
    }
    .email, .name{
      overflow: hidden;
    }
  }

  .user+.user{
    margin-top:10px;
  }

}

</style>
