import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8088'
})

// headers are added in store

export default instance
