<template>
  <div>
    <v-container>
      <v-row>
        <v-col class="text-h5">로그인</v-col>
      </v-row>
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-text-field
          v-model="email"
          placeholder="example@domain.com"
          autofocus
          prepend-icon="mdi-email"
          validate-on-blur
          :rules="checkEmail()"
          :success="email_validate === true"
          class="pt-0"
        ></v-text-field>
        <v-text-field
          v-model="pw"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          prepend-icon="mdi-key"
          :rules="checkPassword()"
          :success="pw_validate === true"
          class="pt-0"
        ></v-text-field>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn type="submit" class="primary white--text" :disabled="!isValid">로그인</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
  import crypto from 'crypto'

  export default {
    data() {
      return {
        email: '',
        pw: '',
        email_validate: false,
        pw_validate: false,
      }
    },
    computed: {
      isValid : function () {
        return this.email_validate === true && this.pw_validate === true
      }
    },
    methods: {
      checkEmail() {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

        this.email_validate = _.isNil(this.email.match(regex)) ? '이메일 형식이 아닙니다' : true

        return [this.email_validate]
      },
      checkPassword() {
        const regex = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9가-힣]).{8,})/i

        this.pw_validate = _.isNil(this.pw.match(regex)) ? '대,소문자/특수문자/숫자를 8자 이상 입력해주세요' : true

        return [this.pw_validate]
      },
      onSubmit() {
        this.login()
      },
      login() {
        this.$http.post(`${this.$env.serverURI}/users/sign_in`, {
          email: this.email,
          password: this.pw
        }, {
          withCredentials : true
        }).then(results => {
          //location.assign('/')
          console.log(results.data)
          this.$router.push('/')
        })
      }
    }
  }
</script>

<style scoped>

</style>
