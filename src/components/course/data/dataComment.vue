<template>
  <div v-if="$store.getters.commentIsSelectedGet">
    <button class="showCommentForm" @click="showForm = true" v-if="!showForm">Comment with this line</button>
    <button class="showCommentForm" @click="showForm = false" v-else>Close commenting</button>
    <commentForm v-if="showForm" :add-code="true" @removeCommentForm="showForm = false"></commentForm>
    <div class="comment-data-container" v-if="loaded">
      <div class="comment-base" v-for="main_com in data.roots" :key="main_com.id">
        <single-comment :data="main_com"></single-comment>
        <div class="comment-children" v-for="com in data.commentMap.get(main_com.id)" :key="com.id">
          <single-comment :data="com"></single-comment>
        </div>
      </div>
    </div>
    <div class="comment-data-container" v-else>
      No comments
    </div>
  </div>
</template>

<script>
import singleComment from '@/components/course/comment/singleComment'
import commentForm from '@/components/course/comment/commentForm'
import { eventBus } from '@/main'

export default {
  name: 'dataComment',
  components: {
    singleComment,
    commentForm
  },
  data () {
    return {
      showForm: false
    }
  },
  methods: {
    commentForceUpdate () {
      this.$forceUpdate()
    }
  },
  computed: {
    data () { return this.$store.getters.getCommentsByCodeLine },
    loaded () { return this.$store.getters.commentIsLoaded }
  },
  created () {
    eventBus.$on('force-comment-update', this.commentForceUpdate)
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

.comment-base{
  color: $text-color;
  padding: 10px 0;

  .comment-children{
    padding-left: 20px;
    margin-left: 20px;
    border-left: rgba($text-color, 0.3) 1px solid;
  }
}

.showCommentForm{
  width: 200px;
  height: 30px;
  color: $save-color;
  border-color: $save-color;
  padding:2px;
}
.showCommentForm:hover{
  color: $box-bg-color1;
  background-color: $save-color;
}

</style>
