<template>
 <div id="course-create" v-if="loaded">
   <div class="data">
     <label for="title">Title: <input type="text" id="title" v-model="course.title"></label>
     <label for="group-order">Group order: <input type="number" id="group-order" v-model="course.groupOrder"></label>
     <label for="complexity">Complexity:
       <select name="complexity" id="complexity" v-model="course.complexity" >
         <option v-for="com in complexityValues" :key="com" class="assimilation-option">{{com}}</option>
       </select>
     </label>
     <label for="language">Language:
       <select name="language" id="language" v-model="course.language" >
         <option v-for="lang in languages" :key="lang.id" class="language-option" :value="lang">{{lang.name}}</option>
       </select>
     </label>
     <label for="category">Category:
       <select name="category" id="category" v-model="course.category">
         <option v-for="cat in categories" :key="cat.id" class="category-option" :value="cat">{{cat.name}}</option>
       </select>
     </label>
     <button class="save" @click="save" v-if="$store.getters.authHasPermissionAny(['save_course'])">Save</button>
   </div>
 </div>
</template>

<script>
import axios from '@/axios/axios'

export default {
  name: 'CourseCreate',
  data () {
    return {
      loadedLang: false,
      loadedCat: false,
      // cgid - course group id (query)
      course: {
        category: null,
        complexity: 'BEGINNER',
        groupOrder: 0,
        id: null,
        isAuthor: true,
        isFollowing: true,
        isPublished: null,
        language: null,
        title: ''
      },
      complexityValues: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      languages: [],
      categories: []
    }
  },
  computed: {
    loaded () {
      return this.loadedLang && this.loadedCat
    }
  },
  methods: {
    save () {
      const data = {
        categoryId: this.course.category.id,
        complexity: this.course.complexity,
        courseGroupId: this.$route.query.cgid,
        groupOrder: this.course.groupOrder,
        languageId: this.course.language.id,
        title: this.course.title
      }
      axios.post('/course', data)
        .then(res => {
          this.$router.push({ name: 'courseEdit', params: { id: res.data.id } })
        })
    }
  },
  created () {
    axios.get('/course/category')
      .then(res => {
        this.categories = res.data
        this.loadedCat = true
      })
    axios.get('/course/language')
      .then(res => {
        this.languages = res.data
        this.loadedLang = true
      })
  }
}
</script>

<style scoped>

</style>
