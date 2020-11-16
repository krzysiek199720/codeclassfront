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
      <button class="follow"></button>
      <button class="publish"></button>
      <button class="edit"></button>
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
