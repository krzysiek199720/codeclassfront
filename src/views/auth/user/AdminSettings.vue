<template>
  <div id="admin-settings" v-if="loaded">
    <div class="section language-settings" v-if="$store.getters.authHasPermissionAny(['save_language', 'delete_language'])">
      <div class="title-container">
        <div class="title">Languages</div>
      </div>
      <div class="top-section" v-if="$store.getters.authHasPermission('save_language')">
        <div class="text-container">
          <input type="text" id="language" v-model="newLang" placeholder="New language">
        </div>
        <button class="save" @click="addLanguage">Add language</button>
      </div>
      <template v-for="(l, index) in languages">
        <div class="bottom-section" :key="l.id">
          <div class="text-container">
            <input class="input-edit" v-model="languages[index].name">
          </div>
          <button class="save" @click="saveLanguage(l)" v-if="$store.getters.authHasPermission('save_language')">Edit language</button>
          <button class="delete" @click="deleteLanguage(l)" v-if="$store.getters.authHasPermission('delete_language')">Delete language</button>
        </div>
      </template>
    </div>
    <div class="section category-settings" v-if="$store.getters.authHasPermissionAny(['save_category', 'delete_category'])">
      <div class="title-container">
        <div class="title">Categories</div>
      </div>
      <div class="top-section" v-if="$store.getters.authHasPermission('save_category')">
        <div class="text-container">
          <input type="text" id="category" v-model="newCat" placeholder="New category">
        </div>
        <button class="save" @click="addCategory">Add category</button>
      </div>
      <template v-for="(c, index) in categories">
        <div class="bottom-section" :key="c.id">
          <div class="text-container">
            <input class="input-edit" v-model="categories[index].name">
          </div>
          <button class="save" @click="saveCategory(c)" v-if="$store.getters.authHasPermission('save_category')">Edit category</button>
          <button class="delete" @click="deleteCategory(c)" v-if="$store.getters.authHasPermission('delete_category')">Delete category</button>
        </div>
      </template>
    </div>
    <div class="section role-settings" v-if="$store.getters.authHasPermission('get_role')">
      <div class="title-container">
        <div class="title">Roles</div>
        <router-link tag="button" :to="{name: 'roleEdit', params: {id: null}}" class="new-role" v-if="$store.getters.authHasPermission('save_role')">New role</router-link>
      </div>
      <template v-for="role in roles">
        <div class="bottom-section" :key="role.id">
          <div class="text-container">
            <div class="role-name">{{role.name}}</div>
          </div>
          <router-link tag="button" class="save" :to="{name: 'roleEdit', params: {id: role.id}}" v-if="$store.getters.authHasPermission('save_role')">Edit</router-link>
          <button class="delete" v-if="$store.getters.authHasPermission('delete_role')" @click="deleteRole(role)">Delete role</button>
        </div>
      </template>
    </div>
    <userAdminPanel class="section user-settings" :roles="roles" v-if="$store.getters.authHasPermission('update_role_user')"></userAdminPanel>
  </div>
</template>

<script>
import axios from '@/axios/axios'
import userAdminPanel from '@/components/auth/userAdminPanel'
import store from '@/store/store'

export default {
  name: 'AdminSettings',
  components: {
    userAdminPanel
  },
  data () {
    return {
      langLoad: false,
      catLoad: false,
      roleLoad: false,
      languages: [],
      categories: [],
      roles: [],
      newLang: null,
      newCat: null
    }
  },
  computed: {
    loaded () {
      return this.langLoad && this.catLoad && this.roleLoad
    }
  },
  methods: {
    addLanguage () {
      const data = {
        name: this.newLang
      }
      axios.post('/course/language', data)
        .then(res => {
          this.languages.push(res.data)
        })
    },
    saveLanguage (lang) {
      const data = {
        name: lang.name
      }
      axios.put('/course/language/' + lang.id, data)
        .then(res => {
          lang = res.data
        })
    },
    deleteLanguage (lang) {
      axios.delete('/course/language/' + lang.id)
        .then(res => {
          const index = this.languages.indexOf(lang)
          this.languages.splice(index, 1)
        })
    },
    addCategory () {
      const data = {
        name: this.newCat
      }
      axios.post('/course/category', data)
        .then(res => {
          this.categories.push(res.data)
        })
    },
    saveCategory (cat) {
      const data = {
        name: cat.name
      }
      axios.put('/course/category/' + cat.id, data)
        .then(res => {
          cat = res.data
        })
    },
    deleteCategory (cat) {
      axios.delete('/course/category/' + cat.id)
        .then(res => {
          const index = this.categories.indexOf(cat)
          this.categories.splice(index, 1)
        })
    },
    deleteRole (role) {
      axios.delete('/auth/role/' + role.id)
        .then(res => {
          const index = this.roles.indexOf(role)
          this.roles.splice(index, 1)
        })
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(
      store.getters.authIsAuthenticated &&
          store.getters.authIsAdmin
    )
  },
  async created () {
    this.$store.dispatch('defaultOnNotLoggedIn')
    this.$store.dispatch('defaultOnNotAdmin')

    axios.get('/course/language')
      .then(res => {
        this.languages = res.data
        this.langLoad = true
      })
    axios.get('/course/category')
      .then(res => {
        this.categories = res.data
        this.catLoad = true
      })

    axios.get('/auth/role')
      .then(res => {
        this.roles = res.data
        this.roleLoad = true
      })
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

#admin-settings {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1400px;
  width: calc(100% - 40px);
  margin: 100px auto auto auto;

  label{
    padding: 0;
  }

  .save{
    width: 150px;
    height: 30px;
    color: $save-color;
    border-color: $save-color;
  }

  .save:hover{
    color: $box-bg-color1;
    background-color: $save-color;
  }

  .delete{
    width: 150px;
    height: 30px;
    color: $delete-color;
    border-color: $delete-color;
  }

  .delete:hover{
    color: $box-bg-color1;
    background-color: $delete-color;
  }

  .section{
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: $box-bg-color1;
    box-shadow: $box-shadow1;
    padding: 30px;
    margin-bottom: 20px;
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

  .top-section{
    border-bottom: $box-border1;
    padding-bottom: 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
  }

  .bottom-section{
    display: flex;
    flex-direction: row;
    padding-top: 20px;
  }

  .text-container{
    display: flex;
    flex-direction: column;
    width: 200px;
  }

  .new-role{
    width: 200px;
    height: 30px;
    color: $save-color;
    border-color: $save-color;
  }
  .new-role:hover{
    color: $box-bg-color1;
    background-color: $save-color;
  }

  button{
    margin-left:10px;
  }

  .role-name{
    height: 30px;
    color: $input-color;
    padding-top: 3px;
    font-size: 15px;
    border: 0;
    background-color: transparent;
    margin-right:10px;
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
}
</style>
