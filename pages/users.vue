<template>
  <div>
    <v-container>
      <v-row>
        <v-col class="text-h5">Users</v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-list>
            <v-list-item v-for="(item, idx) in userList" :key="`user-${idx}`" dense>
              <v-list-item-content>{{item.name}}</v-list-item-content>
              <v-list-item-action>
                <v-btn @click="removeUser(item.id)" icon>
                  <v-icon color="grey lighten-1">mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
    <v-form>
      <v-container>
        <v-row>
          <v-col class="d-flex align-baseline">
            <v-text-field
              label="유저명"
              v-model="userName"
              class="mr-3"
            ></v-text-field>
            <v-btn @click.stop="addUserHandler">추가</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        userList: [],
        userName: ''
      }
    },

    mounted() {
      this.updateUserData()
    },

    methods: {
      addUserHandler() {
        if (this.userName === '') return

        axios.post(`${this.$env.serverURI}/users`, {
          name : this.userName
        }).then(res => {
          this.updateUserData()

          this.userName = ''
        })
      },

      updateUserData() {
        axios.get(`${this.$env.serverURI}/users`).then(res => {
          this.userList = res.data
        })
      },

      removeUser(id) {
        axios.delete(`${this.$env.serverURI}/users`, {
          data: {
            id
          }
        }).then(res => {
          this.updateUserData()
        })
      },
    }
  }
</script>

<style scoped>

</style>
