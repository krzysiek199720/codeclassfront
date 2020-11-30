<template>
  <div id="course-group" class="course-group-container" v-if="loaded">
    <div class="group-info">
      <span class="title">{{courseGroup.name}}</span>
      <div class="author">
        <span class="name">{{courseGroup.authorFirstname}} {{courseGroup.authorLastname}}</span>
        <span class="email">{{courseGroup.authorEmail}}</span>
        <template v-if="$store.getters.authIsAuthenticated">
          <template v-if="!courseGroup.isAuthor">
            <button class="follow" v-if="!courseGroup.isFollowing">Follow</button>
            <button class="follow unfollow" v-else>Unfollow</button>
          </template>
          <template v-else>
            <router-link tag="button" :to="{name: 'courseGroupSave', params: { id: this.$route.params.id}}" class="edit-button">Edit</router-link>
            <router-link tag="button" :to="{name: 'courseSave', query: {'cgid': $route.params.id}}" class="create-button">Create course</router-link>
          </template>
        </template>
      </div>
    </div>
    <div class="course-list">
      <div class="course" v-for="item in courses" :key="item.id">
        <div class="data">
          <router-link tag="span" :to="{name:'course', params:{id: item.id}}" class="title">{{item.title}}</router-link>
          <span class="complexity">{{item.complexity}}</span>
          <span class="language">{{item.language.name}}</span>
          <span class="category">{{item.category.name}}</span>
          <span class="published">{{item.isPublished}}</span>
          <span class="order">{{item.groupOrder}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../axios/axios'

export default {
  name: 'CourseGroup',
  data () {
    return {
      courseGroup: null,
      courses: [],
      loadedGroup: false,
      loadedCourses: false
    }
  },
  computed: {
    loaded () { return this.loadedGroup && this.loadedCourses }
  },
  methods: {
    follow (doFollow) {
      axios.put('/course/group/' + this.$route.params.id + '/follow', null, {
        params: {
          doFollow: doFollow
        }
      })
        .then(res => {
          this.courseGroup.isFollowing = doFollow
        })
        .catch(err => {
          //  no luck, show info
          console.log(err)
        })
    }
  },
  created () {
    axios.get('/course/group/' + this.$route.params.id)
      .then(res => {
        this.courseGroup = res.data
        this.loadedGroup = true
      })
    axios.get('/course/group/' + this.$route.params.id + '/courses')
      .then(res => {
        this.courses = res.data
        this.loadedCourses = true
      })
  }
}
</script>

<style scoped>

</style>
