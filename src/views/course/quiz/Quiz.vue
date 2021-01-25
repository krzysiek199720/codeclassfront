<template>
  <div id="quiz" v-if="loaded">
    <div class="section">
      <template v-if="questionNumber < quizData.questions.length">
        <div class="title-container">
          <div class="title">Quiz</div>
          <div class="question-info">Question {{questionNumber+1}} of {{quizData.questions.length}}</div>
        </div>
        <div class="question">
          <div class="question-text">{{questionGet.question}}</div>
          <div class="answers">
            <div class="answer">
              <input type="radio" id="answer0" class="answer" v-model="answer" value="1"><label for="answer0">{{questionGet.answer0}}</label>
            </div>
            <div class="answer">
              <input type="radio" id="answer1" class="answer" v-model="answer" value="2"><label for="answer1">{{questionGet.answer1}}</label>
            </div>
            <div class="answer">
              <input type="radio" id="answer2" class="answer" v-model="answer" value="3"><label for="answer2">{{questionGet.answer2}}</label>
            </div>
            <div class="answer">
              <input type="radio" id="answer3" class="answer" v-model="answer" value="4"><label for="answer3">{{questionGet.answer3}}</label>
            </div>
          </div>
        </div>
        <div class="controls">
          <button @click="next">Next</button>
        </div>
      </template>
      <template v-else>
        <div class="title-container">
          <div class="title">Quiz result</div>
          <router-link tag="button" :to="{name:'course', params:{id: this.$route.params.id}}">Back to course</router-link>
        </div>
        <div class="result">You scored {{score}} / {{quizData.maxScore}} points</div>

  <!--      result page-->
      </template>
    </div>
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

<style scoped lang="scss">

  @import 'src/assets/css/variables.scss';

  #quiz {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1400px;
    width: calc(100% - 40px);
    margin: 100px auto 20px auto;

    button {
      color: $highlight-color;
      border-color: $highlight-color;
      height: 30px;

      &.unfollow {
        color: $unfollow-color;
        border-color: $unfollow-color;
      }
    }

    button:hover {
      color: $box-bg-color1;
      background-color: $highlight-color;

      &.unfollow {
        color: $box-bg-color1;
        background-color: $unfollow-color;
      }
    }

    .section {
      position: relative;
      background-color: $box-bg-color1;
      box-shadow: $box-shadow1;
      padding: 30px;
    }

    .title-container {
      display: flex;
      justify-content: space-between;

      .title {
        font-family: $font2;
        color: $text-color2;
        font-size: 20px;
      }
    }

    .question-info{
      font-family: $font2;
      color: $highlight-color;
    }

    .question {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
    }

    .question-text{
      font-size: 16px;
      margin-bottom: 10px;
    }

    .answer{
      display: flex;
    }
    .answer+.answer{
      margin-top: 5px;
    }

    .answers{
      display: flex;
      margin: 10px 10px 0;
      flex-direction: column;
    }

    .controls{
      position: absolute;
      right: 30px;
      bottom: 30px;
    }

    .result{
      margin-top: 10px;
    }

    label{
      color: $text-color1;
    }

    input[type='radio'] {
      --disabled: #F6F8FF;
      --disabled-inner: #E1E6F9;
      -webkit-appearance: none;
      -moz-appearance: none;
      height: 21px;
      outline: none;
      display: inline-block;
      vertical-align: top;
      position: relative;
      margin: 0;
      cursor: pointer;
      border: 1px solid rgba($highlight-color, 0.3);
      background: $box-bg-color2;
      transition: background .3s, border-color .3s, box-shadow .2s;
      &:after {
        content: '';
        display: block;
        left: 0;
        top: 0;
        position: absolute;
        transition: transform var(--d-t, .3s) var(--d-t-e, ease), opacity var(--d-o, .2s);
      }
      &:checked {
        background: $highlight-color;
        border-color: $highlight-color;
        --d-o: .3s;
        --d-t: .6s;
        --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
      }
      &:disabled {
        --b: var(--disabled);
        cursor: not-allowed;
        opacity: .9;
        &:checked {
          --b: var(--disabled-inner);
          border-color: $highlight-color;
        }
        & + label {
          cursor: not-allowed;
        }
      }
      &:hover {
        &:not(:checked) {
          &:not(:disabled) {
            border-color: $highlight-color;
          }
        }
      }
      &:focus {
        box-shadow: 0 0 0 2px rgba($highlight-color, .3);
      }
      &:not(.switch) {
        width: 21px;
        &:after {
          opacity: var(--o, 0);
        }
        &:checked {
          --o: 1;
        }
      }
      & + label {
        font-size: 16px;
        line-height: 21px;
        display: inline-block;
        vertical-align: top;
        cursor: pointer;
        margin-left: 0px;
        padding-left: 10px;
      }
    }
    input[type='radio'] {
      border-radius: 50%;
      &:after {
        width: 19px;
        height: 19px;
        border-radius: 50%;
        background: $box-bg-color1;;
        opacity: 0;
        transform: scale(var(--s, .7));
      }
      &:checked {
        --s: .5;
      }
    }
  }

</style>
