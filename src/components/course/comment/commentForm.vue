<template>
  <form class="commentForm">
    <div class="commentInfoContainer">
      <span class="comment-info" v-if="rootComment !== null">Responding to {{rootComment.userFirstName}} {{rootComment.userLastName}}'s comment</span>
    </div>
    <div class="commentMentionData" v-if="addCode">
<!--      todo get course data here - store courseData in store and send lines from server?-->
<!--      todo buttons to add lines before/after-->
    </div>
    <textarea name="commentData" v-model="commentData" cols="30" rows="10" class="commentdata"></textarea>
    <button class="submit-comment" @click.prevent="sendComment">Submit</button>
  </form>
</template>

<script>
import axios from '../../../axios/axios'

export default {
  name: 'commentForm',
  props: ['commentRootIdProp', 'addCode'], // for code mentioning, as for now not implemented in data comment view
  data () {
    return {
      commentRootId: null,
      commentData: '',
      scriptId: this.addCode ? this.$store.getters.dataCourseDataId : null,
      lineFrom: this.addCode ? this.$store.getters.dataLineGet : null,
      lineTo: this.addCode ? this.$store.getters.dataLineGet : null
    }
  },
  computed: {
    rootComment () {
      if (this.commentRootId === null) { return null }
      let result = this.$store.dispatch('commentGet')
      if (result === undefined) { result = null }
      return result
    }
  },
  methods: {
    clearInput () {
      this.commentRootId = null
      this.commentData = ''
      this.scriptId = null
      this.lineFrom = null
      this.lineTo = null
    },
    sendComment () {
      const comment = {
        data: this.commentData,
        root: this.commentRootId,
        scriptId: this.scriptId,
        lineFrom: this.lineFrom,
        lineTo: this.lineTo
      }
      axios.post('/course/' + this.$route.params.id + '/comment', comment)
        .then(res => {
          this.$store.dispatch('addComment', res.data)

          if (this.addCode) {
            this.$emit('removeCommentForm')
          } else {
            this.clearInput()
          }
        })
        .catch(err => {
        // do error thingy
          console.log(err)
        })
    }
  },
  created () {
    if (this.commentRootIdProp === undefined) {
      this.commentRootId = null
    } else {
      this.commentRootId = this.commentRootIdProp
    }
  }
}
</script>

<style scoped>

</style>
