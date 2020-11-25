<template>
  <div id="quiz" v-if="loaded">
    <template v-if="questionNumber < quizData.questions.length">
      <div class="question-info">Question {{questionNumber+1}} of {{quizData.questions.length}}</div>
      <div class="question">
        <div class="question-text">{{questionGet.question}}</div>
        <div class="answers">
          <label for="answer0"><input type="radio" id="answer0" class="answer" v-model="answer" value="1">{{questionGet.answer0}}</label>
          <label for="answer1"><input type="radio" id="answer1" class="answer" v-model="answer" value="2">{{questionGet.answer1}}</label>
          <label for="answer2"><input type="radio" id="answer2" class="answer" v-model="answer" value="3">{{questionGet.answer2}}</label>
          <label for="answer3"><input type="radio" id="answer3" class="answer" v-model="answer" value="4">{{questionGet.answer3}}</label>
        </div>
      </div>
      <div class="controlls">
        <button @click="next">Next</button>
      </div>
    </template>
    <template v-else>
      <div class="result">You scored {{score}} / {{quizData.maxScore}} points</div>
      <router-link tag="button" :to="{name:'course', params:{id: this.$route.params.id}}">Back to course</router-link>
<!--      result page-->
    </template>

  </div>
</template>

<script>
import axios from '../../../axios/axios'

export default {
  name: 'Quiz',
  data () {
    return {
      quizData: null,
      loaded: false,
      questionNumber: 0,
      score: 0,
      answer: null
    }
  },
  computed: {
    questionGet () { return this.quizData.questions[this.questionNumber] }
  },
  methods: {
    next () {
      if (parseInt(this.answer) === this.questionGet.answer) { this.score++ }
      this.answer = null
      this.questionNumber++
      if (this.questionNumber >= this.quizData.questions.length) {
        const data = {
          score: this.score
        }

        axios.post('/course/' + this.$route.params.id + '/quiz/score', data)
          .then(res => {})
          .catch(err => {
            //  failed to save score
            console.log(err)
          })
      }
    }
  },
  created () {
    axios.get('/course/' + this.$route.params.id + '/quiz')
      .then(res => {
        this.quizData = res.data
        this.loaded = true
      })
  }
}
</script>

<style scoped>

</style>
