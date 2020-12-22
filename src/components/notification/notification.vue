<template>
  <div id="notification-container" v-click-outside="closeEvent">
    <div class="opener" @click="switchOpen">
      <font-awesome-icon :icon="['far','bell']" v-if="unreadCount === 0"/>
      <font-awesome-icon :icon="['fas','bell']" v-else/>
    </div>
    <div class="content" v-if="isOpened">
      <router-link class="notification"
                   tag="div"
                   v-for="not in notifications"
                   :key="not.id"
                   :to="not.slug"
                   :class="{read: not.isread, unread: !not.isread}"
                   @click.native="markRead(not)">
        <div class="text">
          {{not.text}}
        </div>
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
  computed:
  {
    unreadCount () {
      let result = 0
      this.notifications.forEach(item => {if(!item.isread) result++})
      return result
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
  padding: 2px;
  color: $highlight-color;
}

.content{
    width: 500px;

    display: block;
    position: absolute;
    top: 50px;
    right: 5px;
    padding: 0;
    box-shadow: $box-shadow1;
    background-color: $box-bg-color1;
    margin: 5px 0;
  //.read{
  //  background-color: $primary-color;
  //}
  //.unread{
  //  background-color: $secondary-color;
  //}
  .notification{
    display: flex;
    margin: 0 12px;
    align-content: center;
  }
  .notification+.notification{
    //padding: 0 2px;
    border-top: $box-border1;
  }
  .text{
    padding: 12px;
    align-self: center;
  }
  .unread{
    color: $text-color2;
  }
  .read{
    color: rgba($text-color2,0.6);
  }

  .no-content{
    padding: 10px;
    span {
      cursor: default!important;
    }
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
      border: 1px solid $highlight-color;
    }
    .mark-read:hover{
      color: $box-bg-color1;
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
    }
    .delete:hover{
      color: $box-bg-color1;
      background-color: $delete-color;
    }
  }
}

</style>
