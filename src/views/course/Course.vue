<template>
  <div id="course">
    <span class="title">{{ course.title}}</span>
    <div class="courseinfo">
      <span class="info"><span class="author">
        {{course.courseGroupResponse.authorFirstname}} {{course.courseGroupResponse.authorLastname}}
      </span></span>
      <span class="info"><span class="coursegroup">{{course.courseGroupResponse.name}}</span></span>
      <span class="info"><span class="complexity">{{course.complexity}}</span></span>
      <span class="info"><span class="language">{{course.language.name}}</span></span>
      <span class="info"><span class="category">{{course.category.name}}</span></span>
    </div>
    <div class="manage">
      <button class="follow"></button>
      <button class="publish"></button>
      <button class="edit"></button>
    </div>
    <div class="coursedata"> <!-- make course data component -->
      //
    </div>
    <div class="comments"></div><!-- make comment component -->
  </div>
</template>

<script>
import axios from '../../axios/axios'

export default {
  name: 'Course',
  data () {
    return {
      course: null
    }
  },
  mounted () {
    axios.get('/course/' + this.$route.params.id)
      .then(res => {
        this.course = res.data
      })
  }
}
</script>

<style scoped>

</style>
