<template>
  <div id="quizEdit" v-if="loaded">
    <router-link tag="button" :to="{name: 'courseEdit', params: { id: this.$route.params.id}}">Return to course edit</router-link>
    <button v-if="quizExists" @click="deleteQuiz">Delete quiz</button>
    <hr> <!-- tmp -->
    <div class="new">
      <label for="question">
        <input type="text" id="question" v-model="newQuestion.question">
      </label>
      <label for="answer0">
        <input type="radio" id="answer0" class="answer" v-model="newQuestion.answer" value="1">
        <input type="text" v-model="newQuestion.answer0">
      </label>
      <label for="answer1">
        <input type="radio" id="answer1" class="answer" v-model="newQuestion.answer" value="2">
        <input type="text" v-model="newQuestion.answer1">
      </label>
      <label for="answer2">
        <input type="radio" id="answer2" class="answer" v-model="newQuestion.answer" value="3">
        <input type="text" v-model="newQuestion.answer2">
      </label>
      <label for="answer3">
        <input type="radio" id="answer3" class="answer" v-model="newQuestion.answer" value="4">
        <input type="text" v-model="newQuestion.answer3">
      </label>
      <button @click="addQuestion">Add question</button>
    </div>
    <div class="questions">
      <div class="question" v-for="q in questions" :key="q.question">
        <span class="question-text">{{q.question}}</span>
        <span class="answer">{{q.answer0}}</span>
        <span class="answer">{{q.answer1}}</span>
        <span class="answer">{{q.answer2}}</span>
        <span class="answer">{{q.answer3}}</span>
        <span class="answer">{{q['answer' + (q.answer - 1)]}}</span>
        <button class="remove" @click="removeQuestion(q)">Remove</button>
      </div>
    </div>
    <button class="save" @click="saveQuiz">Save quiz</button>
  </div>
</template>

<script>
import axios from '@/axios/axios'

export default {
  name: 'QuizEdit',
  data () {
    return {
      questions: [],
      quizExists: false,
      loaded: false,
      newQuestion: {
        answer: 1,
        answer0: '',
        answer1: '',
        answer2: '',
        answer3: '',
        question: ''
      }
    }
  },
  methods: {
    addQuestion () {
      const isDuplicate = this.questions.find(e => { return e.question === this.newQuestion.question })
      if (isDuplicate) { return }
      this.questions.push(this.newQuestion)
      this.newQuestion = {
        answer: 1,
        answer0: '',
        answer1: '',
        answer2: '',
        answer3: '',
        question: ''
      }
    },
    removeQuestion (q) {
      const index = this.questions.indexOf(q)
      this.questions.splice(index, 1)
    },
    saveQuiz () {
      const data = {
        maxScore: this.questions.length,
        questionApiList: this.questions
      }

      axios.post('/course/' + this.$route.params.id + '/quiz', data)
        .then(res => {
          this.quizExists = true
        })
    },
    deleteQuiz () {
      axios.delete('/course/' + this.$route.params.id + '/quiz')
        .then(res => {
          this.$router.push({ name: 'courseEdit', params: { id: this.$route.params.id } })
        })
    }
  },
  created () {
    axios.get('/course/' + this.$route.params.id + '/quiz')
      .then(res => {
        this.questions = res.data.questions
        this.quizExists = true
        this.loaded = true
      })
      .catch(_ => {
        this.loaded = true
      })
  }
}
</script>

<style scoped>

</style>
