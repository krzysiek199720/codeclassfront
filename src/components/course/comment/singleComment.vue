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
    <comment-form v-if="reply" :add-code="false" :comment-root-id-prop="data.id"></comment-form>
  </div>
</template>

<script>
import commentForm from '@/components/course/comment/commentForm'

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
    font-size: 14px;
    color: $highlight-color;
    display: flex;
    flex-direction: row;
    .reply{
      margin-left: 10px;
    }
  }
  .script-data{
    font-family: 'JetBrains Mono'!important;
    font-style: normal;
    background-color: $code-bg-color;
    padding: 5px;
    display: flex;
    flex-direction: column;
    width: fit-content;
    max-width: 100%;
    margin: 2px 2px 2px 5px;

    .line{
      text-wrap: normal;
      font-size: 13px;
    }
  }

  .comment-content{
    font-size: 16px;
    margin-left: 5px;
    margin-bottom: 10px;
  }
}

</style>
