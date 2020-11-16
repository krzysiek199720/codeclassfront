<template>
    <div>
      <div class="comment-base" v-for="main_com in rootComments" :key="main_com.id">
        <single-comment :data="main_com"></single-comment>
        <div class="comment-children" v-for="com in commentMap.get(main_com.id)" :key="com.id">
          <single-comment :data="com"></single-comment>
        </div>
      </div>
    </div>
</template>

<script>
import axios from '@/axios/axios'

import singleComment from '@/components/course/comment/singleComment'

export default {
  name: 'courseComment',
  props: ['courseId'],
  data () {
    return {
      rootComments: [],
      commentMap: new Map()
    }
  },
  methods: {
    sortComment (first, second) {
      if (first.id < second.id) return -1
      if (first.id > second.id) return 1
      return 0
    }
  },
  components: {
    singleComment
  },
  created () {
    axios.get('/course/' + this.courseId + '/comment')
      .then(res => {
        for (const com of res.data) {
          if (com.rootId === null) {
            this.rootComments.push(com)
            continue
          }
          if (this.commentMap.has(com.rootId)) {
            this.commentMap.get(com.rootId).push(com)
          } else {
            this.commentMap.set(com.rootId, [com])
          }
        }

        for (const coms of this.commentMap.values()) {
          coms.sort(this.sortComment)
        }

        this.rootComments.sort(this.sortComment)
      })
  },
  beforeDestroy () {
  //  remove store comment values
  }
}
</script>

<style scoped>

</style>
