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

      const linesArray = this.data.lines.slice(this.data.linesFrom, this.data.linesTo + 1)

      for (let i = 0; i < linesArray.length; i++) {
        res.push({
          index: i,
          line: linesArray[i]
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
