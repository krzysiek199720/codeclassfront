<template>
  <div class="comment">
    <div class="info">
      <span class="author">{{data.userFirstName}} {{data.userLastName}}</span>
    </div>
    <div class="script-data">
<!--      todo-->
      script-data
    </div>
    <div class="comment-content">{{data.data}}</div>
  </div>
</template>

<script>
export default {
  name: 'singleComment',
  props: ['data']
}
</script>

<style scoped>

</style>
