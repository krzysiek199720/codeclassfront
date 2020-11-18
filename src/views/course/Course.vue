<template>
  <div id="course" v-if="loaded">
    <span class="title">{{ course.title}}</span>
    <div class="courseinfo">
      <span class="info"><span class="author">
        {{course.courseGroupResponse.authorFirstname}} {{course.courseGroupResponse.authorLastname}}
      </span></span>
      <span class="info"><span id="coursegroup">{{course.courseGroupResponse.name}}</span></span>
      <span class="info"><span id="complexity">{{course.complexity}}</span></span>
      <span class="info"><span id="language">{{course.language.name}}</span></span>
      <span class="info"><span id="category">{{course.category.name}}</span></span>
      <span class="info"><span id="published">{{course.isPublished | formatDate}}</span></span>
    </div>
    <div class="manage">
      <template v-if="!course.isAuthor">
        <button class="follow" v-if="!course.isFollowing">Follow</button>
        <button class="follow unfollow" v-else>Unfollow</button>
      </template>
      <template v-else>
        <button class="publish" v-if="course.isPublished === null" @click="publish(true)">Publish</button>
        <button class="publish unpublish" v-else @click="publish(false)">Make private</button>

        <router-link tag="button" :to="{name: 'courseEdit', params: { id: this.$route.params.id}}" class="edit-button">Edit</router-link>
      </template>
    </div>
    <courseData class="coursedata" :courseId="course.id"></courseData>
    <courseComment class="comments" :courseId="course.id"></courseComment>
  </div>
</template>

<script>
import axios from '../../axios/axios'

import courseData from '../../components/course/CourseData'
import courseComment from '@/components/course/courseComment'

export default {
  name: 'Course',
  data () {
    return {
      course: null,
      loaded: false
    }
  },
  components: {
    courseData,
    courseComment
  },
  methods: {
    publish (doPublish) {
      axios.put('/course/' + this.$route.params.id + '/publish', null, {
        params: {
          isPublished: doPublish
        }
      })
        .then(res => {
          this.course.isPublished = res.data === '' ? null : res.data
          console.log(this.course.isPublished)
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
    }
  },
  created () {
    axios.get('/course/' + this.$route.params.id)
      .then(res => {
        this.course = res.data
        this.loaded = true
      })
  }
}
</script>

<style scoped>

</style>
