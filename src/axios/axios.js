import axios from 'axios'

import main from '../main'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  headers: {
    common: {
      Authorization: main.$store.getters.authToken
    }
  }
})

export default instance
