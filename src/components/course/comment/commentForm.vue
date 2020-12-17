<template>
  <form class="commentForm">
    <div class="commentInfoContainer">
      <span class="comment-info" v-if="rootComment !== null">Responding to
        <div class="name">{{rootComment.userFirstName}} {{rootComment.userLastName}}</div>'s comment
      </span>
    </div>
    <div class="commentMentionData" v-if="addCode">
      <div class="buttons">
        <button class="line-button del-line" @click.prevent="removeFirst()">Remove first line</button>
        <button class="line-button" @click.prevent="addPrevious()">Add previous line</button>
        <button class="line-button"  @click.prevent="addNext()">Add next line</button>
        <button class="line-button del-line" @click.prevent="removeLast()">Remove last line</button>
      </div>
      <div class="selcted-lines">
        <div class="line" v-for="line in getLines" :key="line.index">{{line.line}}</div>
      </div>
    </div>
    <div class="con">
      <textarea name="commentData" v-model="commentData" cols="60" :rows="rowsMin" ref="tacommment" @input="resizeIt" class="commentdata"></textarea>
      <button class="submit-comment" @click.prevent="sendComment">Submit</button>
    </div>
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
      lineMax: this.addCode ? this.$store.getters.dataLineMaxGet : null,
      rowsMin: 5
    }
  },
  computed: {
    rootComment () {
      if (this.commentRootId === null) { return null }
      let result = this.$store.getters.commentGet(this.commentRootId)
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

          console.log('com')

          if (this.addCode || comment.root !== null) {
            this.$emit('removeCommentForm')
          } else {
            this.clearInput()
          }
        })
        .catch(err => {
        // do error thingy
          console.log(err)
        })
    },
    resizeIt () {
      const cols = this.$refs.tacommment.cols

      let linecount = 0
      this.commentData.split('\n').forEach(function (l) {
        linecount += Math.ceil(l.length / (cols - 1)) // Take into account long lines
      })
      const newrows = Math.max(this.rowsMin, linecount + 1)
      this.$refs.tacommment.rows = newrows
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

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

.commentForm{
  border-bottom: $box-border1;
  padding-bottom: 10px;
  margin-bottom: 10px;
  .commentdata{
    background-color: $box-bg-color2;
    resize: none;
    outline: 0;
    border: $box-border1;
    color: $text-color;
    font-size: 14px;
    font-family: $font1;
  }

  .commentInfoContainer{
    margin-bottom: 10px;
  }

  .con{
    display: flex;
    flex-direction: column;
  }

  .name{
    color: $highlight-color;
    display: inline;
  }

  .buttons{
    display: flex;
    flex-direction: row;
  }

  .commentMentionData{
    margin-top: 10px;
  }

  .submit-comment{
    margin-top: 10px;
    width: 100px;
    height: 25px;
    color: $save-color;
    border-color: $save-color;
    align-self: flex-end;
  }

  .submit-comment:hover{
    color: $box-bg-color1;
    background-color: $save-color;
  }

  .line-button{
    width: 130px;
    height: 30px;
    color: $follow-color;
    border-color: $follow-color;
    padding:2px;
  }
  .line-button+.line-button{
    margin-left: 10px;
  }

  .line-button:hover{
    color: $box-bg-color1;
    background-color: $follow-color;
  }
  .del-line{
    color: $unfollow-color;
    border-color: $unfollow-color;
  }
  .del-line:hover{
    color: $box-bg-color1;
    background-color: $unfollow-color;
  }

  .selcted-lines{
    background-color: $code-bg-color;
    margin: 10px 0;
  }
}

</style>
