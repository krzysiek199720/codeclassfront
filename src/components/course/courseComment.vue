<template>
    <div v-if="loaded">
      <commentForm add-code="false"></commentForm>
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
import commentForm from '@/components/course/comment/commentForm'

export default {
  name: 'courseComment',
  props: ['courseId'],
  computed: {
    rootComments () { return this.$store.getters.getRootComments },
    commentMap () { return this.$store.getters.getCommentMap },
    loaded () { return this.$store.getters.commentIsLoaded }
  },
  methods: {
    sortComment (first, second) {
      if (first.id < second.id) return -1
      if (first.id > second.id) return 1
      return 0
    }
  },
  components: {
    singleComment,
    commentForm
  },
  created () {
    axios.get('/course/' + this.courseId + '/comment')
      .then(res => {
        const newRoots = []
        const newComMap = new Map()

        for (const com of res.data) {
          if (com.rootId === null) {
            newRoots.push(com)
            continue
          }
          if (newComMap.has(com.rootId)) {
            newComMap.get(com.rootId).push(com)
          } else {
            newComMap.set(com.rootId, [com])
          }
        }

        for (const coms of newComMap.values()) {
          coms.sort(this.sortComment)
        }

        newRoots.sort(this.sortComment)

        this.$store.dispatch('setComments', { rootComments: newRoots, commentMap: newComMap })
      })
  },
  beforeDestroy () {
    this.$store.dispatch('removeComments')
  }
}
</script>

<style scoped>

</style>
