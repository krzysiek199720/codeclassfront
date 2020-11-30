<template>
  <div class="comment">
    <div class="info">
      <span class="author">{{data.userFirstName}} {{data.userLastName}}</span>
    </div>
    <div class="script-data" v-if="data.courseDataId !== null">
      <div class="line" v-for="line in getLines" :key="line.index">{{line.line}}</div>
    </div>
    <div class="comment-content">{{data.data}}</div>
  </div>
</template>

<script>
export default {
  name: 'singleComment',
  props: ['data'],
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
  }
}
</script>

<style scoped>

.comment {
  border: 1px black solid;
}

</style>
