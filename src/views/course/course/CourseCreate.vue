<template>
 <div id="course-create" v-if="loaded">
   <div class="data">
     <div class="title-container">
       <div class="title">Create course</div>
     </div>
     <div class="container">
        <div class="title-container">
          <input placeholder="Title" type="text" id="title" v-model="course.title">
        </div>
       <div class="line">
         <div class="label">Group order</div>
         <div class="input-box">
           <input type="number" id="group-order" v-model="course.groupOrder">
         </div>
       </div>
       <div class="line">
         <div class="label">Complexity</div>
         <div class="input-box">
           <div class="select">
             <select name="complexity" id="complexity" v-model="course.complexity" >
               <option v-for="com in complexityValues" :key="com" class="assimilation-option">{{com}}</option>
             </select>
           </div>
         </div>
       </div>
       <div class="line">
         <div class="label">Language</div>
         <div class="input-box">
           <div class="select">
             <select name="language" id="language" v-model="course.language" >
               <option v-for="lang in languages" :key="lang.id" class="language-option" :value="lang">{{lang.name}}</option>
             </select>
           </div>
         </div>
       </div>
       <div class="line">
         <div class="label">Category</div>
         <div class="input-box">
           <div class="select">
             <select name="category" id="category" v-model="course.category">
               <option v-for="cat in categories" :key="cat.id" class="category-option" :value="cat">{{cat.name}}</option>
             </select>
           </div>
         </div>
       </div>
     </div>
     <div class="button-container">
       <button class="save-button" @click="save" v-if="$store.getters.authHasPermissionAny(['save_course'])">Save</button>
     </div>
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

<style scoped lang="scss">

  @import 'src/assets/css/variables.scss';

#course-create{
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1400px;
  width: calc(100% - 40px);
  margin: 100px auto 20px auto;

  .data {
    background-color: $box-bg-color1;
    box-shadow: $box-shadow1;
    padding: 30px;
  }

  .title-container {
    display: flex;
    justify-content: space-between;
  }

  .title {
    font-family: $font2;
    color: $text-color2;
    font-size: 20px;
  }

  .save-button {
    width: 200px;
    height: 30px;
    color: $save-color;
    border-color: $save-color;
  }

  .save-button:hover {
    color: $box-bg-color1;
    background-color: $save-color;
  }

  .container{
    display: flex;
    flex-direction: column;
    padding-top: 20px;
  }

  .title-container{
    display: flex;
    flex-direction: column;
    width: 400px;
  }
  .top-container {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    width: 400px;
  }

  .button-container {
    display: flex;
    flex-direction: row;
    padding: 20px 0 0;
    justify-content: flex-end;
  }

  input {
    height: 30px;
    color: $input-color;
    border: 0;
    border-bottom: 1px solid $input-color;
    background-color: transparent;
  }

  input::placeholder {
    color: $input-placeholder-color;
  }

  input:focus, input:active, input:hover {
    border: 0;
    border-bottom: 1px solid $highlight-color;
    outline: 0;
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
      color: $highlight-color;
      background-color: $box-bg-color3;
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
}
  .line{
    display: flex;
    width: 400px;
    padding: 10px 0 0;
    justify-content: space-between;
    align-items: center;
    .label {
      font-family: $font2;
      font-size: 16px;
      color: $text-color2;
      margin-right: 10px;
    }
    .input-box{
      display: flex;
      flex-direction: column;
    }
    #group-order{
      width: 40px;
    }
  }

</style>
