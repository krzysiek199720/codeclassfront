<template>
  <div id="course" v-if="loaded">
    <div class="section top">
      <span class="title">{{course.title}}</span>
      <div class="manage"> <!-- prob better to v-if on next template then here -->
        <template v-if="$store.getters.authIsAuthenticated">
          <template v-if="!course.isAuthor">
            <span class="assText">Assimilation:</span>
            <div class="select">
              <select name="assimilation" id="assimilation" class="assimilation" v-model="assimilation" @change="changeAssimilation">
                <option v-for="ass in assimilationValues" :key="ass" class="assimilation-option">{{ass}}</option>
              </select>
            </div>
            <button class="follow" v-if="!course.isFollowing" @click="follow(true)">Follow</button>
            <button class="follow unfollow" v-else @click="follow(false)">Unfollow</button>
          </template>
          <template v-else-if="$store.getters.authHasPermissionAny(['publish_course'])">
            <button class="publish" v-if="course.isPublished === null" @click="publish(true)">Publish</button>
            <button class="publish unpublish" v-else @click="publish(false)">Make private</button>

            <router-link tag="button" :to="{name: 'courseEdit', params: { id: this.$route.params.id}}" class="edit-button">Edit</router-link>
          </template>
        </template>
        <router-link v-if="quiz !== null" tag="button" :to="{name:'quiz', params: {id: this.$route.params.id}}">{{quizString}}</router-link>
      </div>
    </div>
    <div class="section">
      <div class="title-container">
        <div class="title">Course information</div>
      </div>
      <div class="info-container">
        <div class="courseinfo">
          <span class="info" id="coursegroup">Course Group: <span class="info-text">{{course.courseGroupResponse.name}}</span></span>
          <span class="info">Author:<span  class="info-text author">{{course.courseGroupResponse.authorFirstname}} {{course.courseGroupResponse.authorLastname}}</span></span>
          <span class="info" id="language">Language: <span class="info-text">{{course.language.name}}</span></span>
          <span class="info" id="category">Category: <span class="info-text">{{course.category.name}}</span></span>
          <span class="info" id="complexity">Complexity: <span class="info-text">{{course.complexity}}</span></span>
          <span class="info" id="published">Published: <span class="info-text">{{course.isPublished | formatDate}}</span></span>
        </div>
        <div class="course-useful">
          <div class="links-div">
            <span>Useful links</span>
            <div class="links">
              <a :href="link.link" class="link" v-for="link in links" :key="link.id">{{link.display}}</a>
            </div>
          </div>
          <div class="files-div">
            <span>Useful files</span>
            <div class="files">
              <span class="file" v-for="file in files" :key="file.id" @click="downloadFile(file.id)">{{file.display}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section course">
      <div class="title-container">
        <div class="title">Course</div>
      </div>
      <courseData class="coursedata"></courseData>
    </div>
    <courseComment class="section comments" :courseId="course.id"></courseComment>
  </div>
</template>

<script>
import axios from '../../../axios/axios'

import courseData from '../../../components/course/CourseData'
import courseComment from '@/components/course/courseComment'

export default {
  name: 'Course',
  data () {
    return {
      course: null,
      loaded: false,
      assimilationValues: ['NO', 'TLDR', 'READ', 'KNOW'],
      assimilation: 'NO',
      quiz: null,
      quizScore: null,
      links: [],
      files: []
    }
  },
  computed: {
    quizString () {
      if (this.quiz === null) { return '' }
      if (this.quizScore === null) { return 'Quiz' }
      return 'Quiz ' + this.quizScore.points + ' / ' + this.quizScore.max
    }
  },
  components: {
    courseData,
    courseComment
  },
  methods: {
    publish (doPublish) {
      const routerResolve = this.$router.resolve({ name: 'course', params: { id: this.course.id } })
      const data = {
        isPublished: doPublish,
        slug: routerResolve.href
      }
      axios.put('/course/' + this.$route.params.id + '/publish', data)
        .then(res => {
          this.course.isPublished = res.data === '' ? null : res.data
        })
        .catch(err => {
          //  no luck, show info
          console.log(err)
        })
    },
    follow (doFollow) {
      axios.put('/course/' + this.$route.params.id + '/follow', null, {
        params: {
          doFollow: doFollow
        }
      })
        .then(res => {
          this.course.isFollowing = doFollow
        })
        .catch(err => {
          //  no luck, show info
          console.log(err)
        })
    },
    changeAssimilation () {
      axios.put('/course/' + this.$route.params.id + '/assimilation', { value: this.assimilation })
    },
    downloadFile (fileId) {
      axios({
        url: '/course/file/' + fileId,
        method: 'GET',
        responseType: 'blob' // important
      }).then((response) => {
        const condis = response.headers['content-disposition']

        const filenameStartIndex = condis.indexOf('filename="')
        let filename = 'file'
        if (filenameStartIndex !== -1) {
          const nameStart = filenameStartIndex + 10
          const filenameEndIndex = condis.indexOf('"', nameStart)
          filename = condis.substr(nameStart, filenameEndIndex - nameStart)
        }

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    }
  },
  created () {
    axios.get('/course/' + this.$route.params.id)
      .then(res => {
        this.course = res.data
        this.loaded = true
      })
    axios.get('/course/' + this.$route.params.id + '/assimilation')
      .then(res => {
        if (res.data !== null) { this.assimilation = res.data }
      })
    axios.get('/course/' + this.$route.params.id + '/quiz')
      .then(res => {
        this.quiz = res.data
        axios.get('/course/' + this.$route.params.id + '/quiz/score')
          .then(res => {
            this.quizScore = res.data === '' ? null : res.data
          })
      })
      .catch(_ => {})
    axios.get('/course/' + this.$route.params.id + '/link')
      .then(res => {
        this.links = res.data
      })
    axios.get('/course/' + this.$route.params.id + '/file')
      .then(res => {
        this.files = res.data
      })
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

#course{
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1400px;
  width: calc(100% - 40px);
  margin: 100px auto 20px auto;

  &>*+*{
    margin-top:20px;
  }

  .top{
    display: grid;
    grid-template-columns: 3fr 2fr;
    align-content: center;

    .title{
      font-weight: 600;
      font-family: $font2;
      font-size: 24px;
      color: $highlight-color;
    }

    .manage{
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
  }

  .course{
    padding: 30px 30px 25px!important;
  }

  .manage{
    select, button{
      margin-left: 10px;
    }

    button {
      height: 30px;
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
  }

  button{
    color: $highlight-color;
    border-color: $highlight-color;
    height: 30px;
    &.unfollow{
      color: $unfollow-color;
      border-color: $unfollow-color;
    }
  }
  button:hover{
    color: $box-bg-color1;
    background-color: $highlight-color;
    &.unfollow{
      color: $box-bg-color1;
      background-color: $unfollow-color;
    }
  }
  button+button{
    margin-left: 10px;
  }

  .section{
    background-color: $box-bg-color1;
    box-shadow: $box-shadow1;
    padding: 30px;
  }

  .title-container {
    display: flex;
    justify-content: space-between;
    .title {
      font-family: $font2;
      color: $text-color2;
      font-size: 20px;
    }
  }

  .info-container{
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;

    align-content: center;
    .info{
      display: grid;
      grid-template-columns: 135px 1fr;
      align-items: center;
      font-size: 16px;
      font-family: $font2;
      color: $text-color2;
      .info-text{
        font-size: 14.5px;
        font-family: $font1;
        color: $text-color1;
      }
    }

    .courseinfo{
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
    }

    .course-useful{
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .links-div, .files-div{
      display: flex;
      flex-direction: column;
      padding: 0 10px;
      border-left: $box-border1;

      &>span{
        margin: 0 auto 10px auto;
        font-family: $font2;
        color: $highlight-color;
      }
    }

    .links, .files{
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 5px;
    }

    .link, .file{
      cursor: pointer;
      justify-self: center;
      color: rgba($highlight-color,0.6);
    }

    .link, .link:active, .link:visited, .link:link{
      color: rgba($highlight-color,0.6);
      border: 0;
      text-decoration: none;
    }
  }
}

</style>
