<template>
  <div>
    <v-container>
      <v-row>
        <v-col class="text-h5">Users</v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-skeleton-loader
            class="mx-auto"
            type="list"
          >
            <v-list>
              <v-list-item v-for="(item, idx) in userList" :key="`user-${idx}`" dense>
                <v-list-item-content>{{item.email}} / {{item.name}}</v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="showRemoveUserDialog(item.email)">
                    <v-icon color="grey lighten-1">mdi-close</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
    <!--v-form>
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
    </v-form-->
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>경고</v-card-title>
        <v-divider class="mb-5"></v-divider>
        <v-card-text>정말 삭제 하겠습니까?</v-card-text>
        <v-card-actions class="justify-center">
          <v-btn @click="removeUser" class="red white--text">Yes</v-btn>
          <v-btn @click="dialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        userList: [],
        userName: '',

        dialog: false,
        deleteIdentity: null,
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
        this.$eventBus.$emit('loading-start')
        axios.get(`${this.$env.serverURI}/users`).then(res => {
          this.userList = res.data
          this.$eventBus.$emit('loading-stop')
        })
      },

      showRemoveUserDialog(email) {
        this.deleteIdentity = email
        this.dialog = true
      },

      removeUser() {
        axios.delete(`${this.$env.serverURI}/users`, {
          data: {
            email: this.deleteIdentity
          }
        }).then(res => {
          this.updateUserData()
        })

        this.dialog = false
      },
    }
  }
</script>

<style scoped>

</style>
