<template>
  <div class="comment">
    <div class="info">
      <span class="author">{{data.userFirstName}} {{data.userLastName}}</span>
      <div class="reply" @click="reply=!reply"><font-awesome-icon :icon="['fa','reply']"/></div>
    </div>
    <div class="script-data" v-if="data.courseDataId !== null">
      <div class="line" v-for="line in getLines" :key="line.index">{{line.line}}</div>
    </div>
    <div class="comment-content">{{data.data}}</div>
    <comment-form v-if="reply" :add-code="false" :comment-root-id-prop="data.id" @removeCommentForm="removeCommentForm"></comment-form>
  </div>
</template>

<script>
import commentForm from '@/components/course/comment/commentForm'
import { eventBus } from '@/main'

export default {
  name: 'singleComment',
  props: ['data'],
  data () {
    return {
      reply: false
    }
  },
  computed: {
    getLines () {
      const res = []

      for (let i = 0; i < this.data.lines.length; i++) {
        res.push({
          index: this.data.linesFrom + i,
          line: this.data.lines[i]
        })
      }

      return res
    }
  },
  methods: {
    removeCommentForm () {
      this.reply = false
      eventBus.$emit('force-comment-update')
    }
  },
  components: {
    commentForm
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

.comment{

  color:$text-color;

  .info{
    font-size: 11px;
    color: $highlight-color;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 0;
    .author{
      border: 1px solid $highlight-color;
      padding: 1px 8px;
      border-radius: 12px;
    }
    .reply{
      margin-left: 10px;
      border: 1px solid $highlight-color;
      padding: 1px 6px;
      border-radius: 12px;
      cursor: pointer;
      &:hover{
        background-color: $highlight-color;
        color: $box-bg-color1;
      }
    }
  }
  .script-data{
    font-family: 'JetBrains Mono'!important;
    font-style: normal;
    background-color: $box-bg-color2;
    padding: 10px;
    display: flex;
    flex-direction: column;
    width: fit-content;
    max-width: 100%;
    margin: 5px 10px;

    .line{
      text-wrap: normal;
      font-size: 13px;
    }
  }

  .comment-content{
    font-size: 16px;
    margin: 0px 5px 10px;
    padding: 5px 0;
  }
}

</style>
