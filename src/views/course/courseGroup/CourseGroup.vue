<template>
  <div id="course-group" class="course-group-container" v-if="loaded">
    <div class="top">
      <div class="group-info">
        <span class="title">{{courseGroup.name}}</span>
        <div class="author">
          <span class="name">{{courseGroup.authorFirstname}} {{courseGroup.authorLastname}}</span>
          <span class="email">{{courseGroup.authorEmail}}</span>
        </div>
      </div>
      <div class="controls">
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
          <span class="order">{{item.groupOrder}}</span>
          <router-link tag="span" :to="{name:'course', params:{id: item.id}}" class="title">{{item.title}}</router-link>
          <span class="complexity">{{item.complexity}}</span>
          <span class="language">{{item.language.name}}</span>
          <span class="category">{{item.category.name}}</span>
          <span class="published">{{item.isPublished | formatDateOrEmpty}}</span>
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

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

#course-group{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 1200px;
  margin: 120px auto auto auto;
  color: $text-color;
  .top{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;

    background-color: $header-bg-color;
    padding: 30px;
    color: $highlight-color;

    .title{
      font-weight: bold;
      font-size: 24px;
    }
    .author{
      display: flex;
      flex-direction: column;
    }

  }
  .controls{
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
      color: $header-bg-color;
      background-color: $highlight-color;
      &.unfollow{
        color: $header-bg-color;
        background-color: $unfollow-color;
      }
    }
    button+button{
      margin-left: 10px;
    }
  }

  .course-list{
    background-color: $header-bg-color;
    padding: 30px;
  }

  .data{
    display: grid;
    grid-template-columns: 30px 3fr 1fr 1fr 1fr 1fr;
    span{
      margin: 0 5px;
    }
    .title{
      cursor: pointer;
    }
  }

  .course{
    padding: 10px 0 10px 10px;
  }

  .course+.course{
    border-top: $text-color 1px solid;
  }
}

</style>
