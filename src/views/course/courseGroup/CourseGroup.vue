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
      <router-link tag="div" :to="{name:'course', params:{id: item.id}}" class="course" v-for="item in courses" :key="item.id">
        <div class="data">
          <span class="order">{{item.groupOrder}}</span>
          <span class="title">{{item.title}}</span>
          <span class="complexity">{{item.complexity}}</span>
          <span class="language">{{item.language.name}}</span>
          <span class="category">{{item.category.name}}</span>
          <span class="published">{{item.isPublished | formatDateOrEmpty}}</span>
        </div>
      </router-link>
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
  max-width: 1400px;
  width: calc(100% - 40px);
  margin: 100px auto auto auto;

  .top{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
    font-family: $font2;

    background-color: $box-bg-color1;
    padding: 30px;
    color: $highlight-color;
    box-shadow: $box-shadow1;

    .title{
      font-weight: bold;
      font-size: 24px;
    }
    .author{
      display: flex;
      flex-direction: column;
      font-size: 18px;
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
  }

  .course-list{
    background-color: $box-bg-color1;
    box-shadow: $box-shadow1;
  }

  .data{
    display: grid;
    grid-template-columns: 30px 3fr 1fr 1fr 1fr 1fr;
    span{
      margin: 0 5px;
    }
    span:first-child{
      margin-left: 0;
    }
  }

  .course{
    padding: 15px 30px 15px 30px;
    cursor: pointer;
    &:hover{
      background-color: $box-bg-color2;
    }
  }

  .course+.course{
    border-top: $box-border1;
  }
}

</style>
