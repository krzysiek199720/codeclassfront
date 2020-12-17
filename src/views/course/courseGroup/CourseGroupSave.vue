<template>
  <div id="course-group-edit" v-if="loaded">
    <div class="container">
      <div class="title-container">
        <div v-if="$route.params.id !== null" class="title">Edit course groupe</div>
        <div v-else class="title">Create course group</div>
      </div>
      <div class="top-container">
        <input placeholder="Name" id="name" type="text" v-model="name">
      </div>
      <div class="button-container">
        <button class="save-button" @click="save">Save</button>
      </div>
    </div>
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

<style scoped lang="scss">

  @import 'src/assets/css/variables.scss';

#course-group-edit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1400px;
  width: calc(100% - 40px);
  margin: 100px auto 20px auto;

  .container {
    background-color: $box-bg-color1;
    box-shadow: $box-shadow1;
    padding: 30px;
  }

  .title-container {
    display: flex;
    justify-content: space-between;
  }

  .title {
    font-family: $font2;
    color: $text-color2;
    font-size: 20px;
  }

  .save-button {
    width: 200px;
    height: 30px;
    color: $save-color;
    border-color: $save-color;
  }

  .save-button:hover {
    color: $box-bg-color1;
    background-color: $save-color;
  }

  .top-container {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    width: 400px;
  }

  .button-container {
    display: flex;
    flex-direction: row;
    padding: 20px 0 0;
    justify-content: flex-end;
  }

  input {
    height: 30px;
    color: $input-color;
    border: 0;
    border-bottom: 1px solid $input-color;
    background-color: transparent;
  }

  input::placeholder {
    color: $input-placeholder-color;
  }

  input:focus, input:active, input:hover {
    border: 0;
    border-bottom: 1px solid $highlight-color;
    outline: 0;
  }
}

</style>
