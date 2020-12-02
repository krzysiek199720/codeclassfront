<template>
  <div id="notification-container" v-click-outside="closeEvent">
    <div class="opener" @click="switchOpen"><font-awesome-icon :icon="['far','bell']"/></div>
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
          <button class="delete" @click.stop="deleteNotification(not)">Delete</button>
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

@import 'src/assets/css/variables.scss';

.opener{
  display: block;
  padding: 5px;
  margin-top: -2px;
  color: $highlight-color;
}

.content{
    width: 400px;

    display: block;
    position: absolute;
    right: 15px;
    padding: 0;
    border: 1px $secondary-color solid;
    background-color: $primary-color;
    margin: 5px 0;
  //.read{
  //  background-color: $primary-color;
  //}
  //.unread{
  //  background-color: $secondary-color;
  //}
  .notification{
    display: flex;
    background-color: $primary-color;
    margin: 0 8px;
  }
  .notification+.notification{
    //padding: 0 2px;
    border-top: $secondary-color solid 1px;
  }
  .read+.read{
  }
  span{
    margin: 0!important;
    padding: 8px 8px!important;
  }

  .buttons{
    width: 100px;
    display: flex;
    flex-direction: column;
    //align-content: center;
    margin: 8px auto;
    align-self: center;
    .mark-read{
      color: $highlight-color;
      background-color: transparent;
      border: 1px solid $highlight-color;
    }
    .mark-read:hover{
      color: $primary-color;
      background-color: $highlight-color;
    }
    button{
      border-color: $text-color;
      border-radius: 4px;
      margin: 2px 2px
    }
    .delete{
      color: $delete-color;
      border: 1px solid $delete-color;
      background-color: transparent;
    }
    .delete:hover{
      color: $primary-color;
      background-color: $delete-color;
    }
  }
}

</style>
