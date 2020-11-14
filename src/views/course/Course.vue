<template>
  <div id="course">
    <span class="title">{{ course.title}}</span>
    <div class="courseinfo">
      <span class="info"><span class="author">
        {{course.courseGroupResponse.authorFirstname}} {{course.courseGroupResponse.authorLastname}}
      </span></span>
      <span class="info"><span id="coursegroup">{{course.courseGroupResponse.name}}</span></span>
      <span class="info"><span id="complexity">{{course.complexity}}</span></span>
      <span class="info"><span id="language">{{course.language.name}}</span></span>
      <span class="info"><span id="category">{{course.category.name}}</span></span>
      <span class="info"><span id="published">{{course.isPublished}}</span></span>
    </div>
    <div class="manage">
      <button class="follow"></button>
      <button class="publish"></button>
      <button class="edit"></button>
    </div>
    <courseData class="coursedata" :courseId="course.id"></courseData> <!-- make course data component -->
    <div class="comments"></div><!-- make comment component -->
  </div>
</template>

<script>
import axios from '../../axios/axios'

import courseData from '../../components/course/CourseData'

export default {
  name: 'Course',
  data () {
    return {
      course: null
    }
  },
  components: {
    courseData
  },
  created () {
    axios.get('/course/' + this.$route.params.id)
      .then(res => {
        this.course = res.data
      })
  }
}
</script>

<style scoped>

</style>
