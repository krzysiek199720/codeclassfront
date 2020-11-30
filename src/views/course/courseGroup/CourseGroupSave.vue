<template>
  <div id="course-group-edit" v-if="loaded">
    <label for="name">Name: <input id="name" type="text" v-model="name"></label>
    <button class="save" @click="save">Save</button>
  </div>
</template>

<script>
import axios from '@/axios/axios'

export default {
  name: 'CourseGroupEdit',
  data () {
    return {
      loaded: false,
      name: ''
    }
  },
  methods: {
    save () {
      const data = {
        name: this.name
      }
      if (this.$route.params.id !== null) {
        axios.put('/course/group/' + this.$route.params.id, data)
          .then(res => {
            this.$router.push({ name: 'courseGroup', params: { id: this.$route.params.id } })
          })
      } else {
        axios.post('/course/group', data)
          .then(res => {
            this.$router.push({ name: 'courseGroup', params: { id: res.data.id } })
          })
      }
    }
  },
  created () {
    if (this.$route.params.id !== null) {
      axios.get('/course/group/' + this.$route.params.id)
        .then(res => {
          this.name = res.data.name
          this.loaded = true
        })
    } else {
      this.loaded = true
    }
  }
}
</script>

<style scoped>

</style>
