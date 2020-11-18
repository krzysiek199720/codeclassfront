<template>
  <div :v-if="loaded">
    <div class="comment-base" v-for="main_com in data.roots" :key="main_com.id">
      <single-comment :data="main_com"></single-comment>
      <div class="comment-children" v-for="com in data.commentMap.get(main_com.id)" :key="com.id">
        <single-comment :data="com"></single-comment>
      </div>
    </div>
  </div>
</template>

<script>
import singleComment from '@/components/course/comment/singleComment'

export default {
  name: 'dataComment',
  props: ['courseDataId'],
  components: {
    singleComment
  },
  computed: {
    data () { return this.$store.getters.getCommentsByCodeLine(this.courseDataId) },
    loaded () { return this.$store.getters.commentIsLoaded }
  }
}
</script>

<style scoped>

</style>
