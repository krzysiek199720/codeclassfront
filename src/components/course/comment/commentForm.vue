<template>
  <form class="commentForm">
    <div class="commentInfoContainer">
      <span class="comment-info" v-if="rootComment !== null">Responding to {{rootComment.userFirstName}} {{rootComment.userLastName}}'s comment</span>
    </div>
    <div class="commentMentionData" v-if="addCode">
      <button class="line-button" @click.prevent="removeFirst()">Remove first line</button>
      <button class="line-button" @click.prevent="addPrevious()">Add previous line</button>
      <button class="line-button"  @click.prevent="addNext()">Add next line</button>
      <button class="line-button" @click.prevent="removeLast()">Remove last line</button>
      <div class="selcted-lines">
        <div class="line" v-for="line in getLines" :key="line.index">{{line.line}}</div>
      </div>
    </div>
    <textarea name="commentData" v-model="commentData" cols="30" rows="10" class="commentdata"></textarea>
    <button class="submit-comment" @click.prevent="sendComment">Submit</button>
  </form>
</template>

<script>
import axios from '../../../axios/axios'

export default {
  name: 'commentForm',
  props: {
    commentRootIdProp: {},
    addCode: {
      type: Boolean,
      default: false
    }
  }, // for code mentioning, as for now not implemented in data comment view
  data () {
    return {
      commentRootId: null,
      commentData: '',
      scriptId: this.addCode ? this.$store.getters.dataCourseDataId : null,
      lineFrom: this.addCode ? this.$store.getters.dataLineGet : null,
      lineTo: this.addCode ? this.$store.getters.dataLineGet : null,
      lineMax: this.addCode ? this.$store.getters.dataLineMaxGet : null
    }
  },
  computed: {
    rootComment () {
      if (this.commentRootId === null) { return null }
      let result = this.$store.dispatch('commentGet')
      if (result === undefined) { result = null }
      return result
    },
    getLines () {
      const res = []

      if (!this.addCode) { return res }
      const linesArray = this.$store.getters.dataGetDataLines(this.scriptId).slice(this.lineFrom, this.lineTo + 1)

      for (let i = 0; i < linesArray.length; i++) {
        res.push({
          index: i,
          line: linesArray[i]
        })
      }

      return res
    }
  },
  methods: {
    removeFirst () {
      if (this.lineFrom + 1 >= 0 && this.lineFrom + 1 <= this.lineMax && this.lineFrom + 1 <= this.lineTo) { this.lineFrom += 1 }
    },
    addPrevious () {
      if (this.lineFrom - 1 >= 0 && this.lineFrom - 1 <= this.lineMax && this.lineFrom - 1 <= this.lineTo) { this.lineFrom -= 1 }
    },
    addNext () {
      if (this.lineTo + 1 >= 0 && this.lineTo + 1 <= this.lineMax && this.lineFrom <= this.lineTo + 1) { this.lineTo += 1 }
    },
    removeLast () {
      if (this.lineTo - 1 >= 0 && this.lineTo - 1 <= this.lineMax && this.lineFrom <= this.lineTo - 1) {
        this.lineTo -= 1
        this.$forceUpdate()
      }
    },
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
        linesFrom: this.lineFrom,
        linesTo: this.lineTo
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
