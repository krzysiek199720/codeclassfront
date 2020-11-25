<template>
  <div id="user-admin-panel">
    <div class="search-panel">
      <input type="text" v-model="searchQuery">
      <select name="role" id="role" v-model="selectedRole" >
        <option class="role-option" :value="null">----</option>
        <option v-for="role in roles" :key="role.id" class="role-option" :value="role">{{role.name}}</option>
      </select>
      <button class="search" @click="search">Search</button>
    </div>
    <div class="users">
      <div class="user" v-for="(user, index) in users" :key="user.id">
        <div class="name">
          <span class="firstname">{{user.firstName}}</span> <span class="lastname">{{user.lastName}}</span>
        </div>
        <span class="email">{{user.email}}</span>
<!--        <select name="role" :id="'user' + user.id" v-model.lazy="users[index].roleId" @change="changeRole(user, $event)">-->
        <select name="role" :id="'user' + user.id" :value="users[index].roleId" @change="changeRole(user, $event)">
          <option v-for="role in roles" :key="role.id" class="role-option" :value="role.id">{{role.name}}</option>
        </select>
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

<style scoped>

</style>
