<template>
  <div id="notification-container" v-click-outside="closeEvent">
    <div class="opener" @click="switchOpen"></div>
    <div class="content" v-if="isOpened">
      <router-link class="notification"
                   tag="div"
                   v-for="not in notifications"
                   :key="not.id"
                   :to="not.slug"
                   :class="{read: not.isread, unread: !not.isread}"
                   @click.native="markRead(not)">
        <span class="text">{{not.text}}</span>
        <div class="buttons">
          <button class="mark-read" @click.stop="markRead(not)" v-if="!not.isread">Mark as read</button>
          <button class="mark-read" @click.stop="deleteNotification(not)">Delete</button>
        </div>
      </router-link>
      <div class="no-content" v-if="notifications.length === 0"><span>No notifications</span></div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import axios from '@/axios/axios'

export default {
  name: 'notification',
  data () {
    return {
      isOpened: false,
      notifications: []
    }
  },
  methods: {
    markRead (item) {
      axios.put('/notification/' + item.id + '/read')
        .then(res => {
          item.isread = true
        })
    },
    deleteNotification (item) {
      axios.delete('/notification/' + item.id)
        .then(res => {
          const index = this.notifications.indexOf(item)
          this.notifications.splice(index, 1)
        })
    },
    switchOpen () {
      console.log('switchOpen')
      this.isOpened = !this.isOpened
    },
    closeEvent (event) {
      this.isOpened = false
    }
  },
  directives: {
    ClickOutside
  },
  created () {
    axios.get('/notification')
      .then(res => {
        this.notifications = res.data
      })
  }
}
</script>

<style scoped lang="scss">

.opener{
  display: block;
  padding: 5px;
  border: 2px darkgoldenrod solid;
}

.content{
    display: block;
    position: absolute;
    padding: 10px;
    border: 2px deeppink solid;
  .read{
    border: 2px cornflowerblue solid;
  }
  .unread{
    border: 2px darkmagenta solid;
  }
}

</style>
