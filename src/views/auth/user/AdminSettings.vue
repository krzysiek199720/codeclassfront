<template>
  <div id="admin-settings" v-if="loaded">
    <div class="section language-settings" v-if="$store.getters.authHasPermissionAny(['save_language', 'delete_language'])">
      <div class="section-mini lang-add" v-if="$store.getters.authHasPermission('save_language')">
        <input type="text" id="language" v-model="newLang" placeholder="New language">
        <button class="save" @click="addLanguage">Add language</button>
      </div>
      <template v-for="(l, index) in languages">
        <div class="lang" :key="l.id">
          <input class="input-edit" v-model="languages[index].name">
          <button class="save" @click="saveLanguage(l)" v-if="$store.getters.authHasPermission('save_language')">Edit language</button>
          <button class="delete" @click="deleteLanguage(l)" v-if="$store.getters.authHasPermission('delete_language')">Delete language</button>
        </div>
      </template>
    </div>
    <div class="section category-settings" v-if="$store.getters.authHasPermissionAny(['save_category', 'delete_category'])">
      <div class="section-mini cat-add" v-if="$store.getters.authHasPermission('save_category')">
        <input type="text" id="category" v-model="newCat" placeholder="New category">
        <button class="save" @click="addCategory">Add category</button>
      </div>
      <template v-for="(c, index) in categories">
        <div class="cat" :key="c.id">
          <input class="input-edit" v-model="categories[index].name">
          <button class="save" @click="saveCategory(c)" v-if="$store.getters.authHasPermission('save_category')">Edit category</button>
          <button class="delete" @click="deleteCategory(c)" v-if="$store.getters.authHasPermission('delete_category')">Delete category</button>
        </div>
      </template>
    </div>
    <div class="section role-settings" v-if="$store.getters.authHasPermission('get_role')">
      <router-link tag="button" :to="{name: 'roleEdit', params: {id: null}}" class="new-role" v-if="$store.getters.authHasPermission('save_role')">New role</router-link>
      <template v-for="role in roles">
        <div class="role" :key="role.id">
          <div class="role-name">{{role.name}}</div>
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
  width: 1200px;
  margin: 120px auto auto auto;
  color: $text-color;

  label{
    padding: 0;
  }

  .save{
    width: 15%;
    height: 30px;
    color: $save-color;
    border-color: $save-color;
  }

  .save:hover{
    color: $header-bg-color;
    background-color: $save-color;
  }

  .delete{
    width: 15%;
    height: 30px;
    color: $delete-color;
    border-color: $delete-color;
  }

  .delete:hover{
    color: $header-bg-color;
    background-color: $delete-color;
  }

  .section{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    background-color: $header-bg-color;
    padding: 30px;
    border-radius: 5px;
  }

  .section+.section{
    margin-top: 10px;
  }

  .lang-add{
    display: flex;
    flex-direction: row;
    button{
      margin-left:10px;
    }
  }

  .section-mini{
    border-bottom: rgba($text-color, 0.3) 1px solid;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .cat-add{
    display: flex;
    flex-direction: row;
    button{
      margin-left:10px;
    }
  }

  .new-role{
    width: 15%;
    height: 30px;
    color: $save-color;
    border-color: $save-color;
    margin-bottom: 20px;
  }
  .new-role:hover{
    color: $header-bg-color;
    background-color: $save-color;
  }

  .cat, .role{
    display: flex;
    flex-direction: row;
  }

  .cat, .lang, .role{
    margin:5px;
  }

  button+button{
    margin-left:10px;
  }

  .input-edit{
    width: 15%;
    margin-right:10px;
  }

  .role-name{
    width: 15%;
    height: 30px;
    color: $input-color;
    border: 0;
    border-bottom: 1px solid $input-color;
    background-color: transparent;
    margin-right:10px;
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
}
</style>
