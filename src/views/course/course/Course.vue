<template>
  <div id="course" v-if="loaded">
    <span class="title">{{ course.title}}</span>
    <div class="courseinfo">
      <span class="info"><span class="author">
        {{course.courseGroupResponse.authorFirstname}} {{course.courseGroupResponse.authorLastname}}
      </span></span>
      <span class="info" id="coursegroup">Course Group: <span>{{course.courseGroupResponse.name}}</span></span>
      <span class="info" id="complexity">Complexity: <span>{{course.complexity}}</span></span>
      <span class="info" id="language">Language: <span>{{course.language.name}}</span></span>
      <span class="info" id="category">Category: <span>{{course.category.name}}</span></span>
      <span class="info" id="published">Published: <span>{{course.isPublished | formatDate}}</span></span>
    </div>
    <div class="course-usefull">
      <div class="links">
        <a :href="link.link" class="link" v-for="link in links" :key="link.id">{{link.display}}</a>
      </div>
      <div class="files">
        <span class="file" v-for="file in files" :key="file.id" @click="downloadFile(file.id)">{{file.display}}</span>
      </div>
    </div>
    <div class="manage"> <!-- prob better to v-if on next template then here -->
      <template v-if="$store.getters.authIsAuthenticated">
        <template v-if="!course.isAuthor">
          <button class="follow" v-if="!course.isFollowing" @click="follow(true)">Follow</button>
          <button class="follow unfollow" v-else @click="follow(false)">Unfollow</button>
          <select name="assimilation" id="assimilation" class="assimilation" v-model="assimilation" @change="changeAssimilation">
            <option v-for="ass in assimilationValues" :key="ass" class="assimilation-option">{{ass}}</option>
          </select>
        </template>
        <template v-else-if="$store.getters.authHasPermissionAny(['publish_course'])">
          <button class="publish" v-if="course.isPublished === null" @click="publish(true)">Publish</button>
          <button class="publish unpublish" v-else @click="publish(false)">Make private</button>

          <router-link tag="button" :to="{name: 'courseEdit', params: { id: this.$route.params.id}}" class="edit-button">Edit</router-link>
        </template>
      </template>
      <router-link v-if="quiz !== null" tag="button" :to="{name:'quiz', params: {id: this.$route.params.id}}">{{quizString}}</router-link>
    </div>
    <courseData class="coursedata"></courseData>
    <courseComment class="comments" :courseId="course.id"></courseComment>
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

.coursedata {
  border: 1px black solid;
  margin: 10px 0;
}

.courseinfo {
  border: 1px black solid;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  .info{
    margin-left: 5px;
  }
}

.comments {
  border: 1px black solid;
  margin: 10px 0;
}

</style>
