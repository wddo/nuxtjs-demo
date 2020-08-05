<template>
  <div>
    <v-container>
      <v-row>
        <v-col class="text-h5">회원가입</v-col>
      </v-row>
      <template v-if="!isSignUpComp">
        <v-form @submit.prevent="onSubmit">
          <v-text-field
            v-model="email"
            placeholder="example@domain.com"
            autofocus
            prepend-icon="mdi-email"
            validate-on-blur
            :rules="checkEmail()"
            class="pt-0"
          >
          </v-text-field>
          <v-text-field
            v-model="userName"
            placeholder="이름을 입력해주세요"
            prepend-icon="mdi-account"
            :rules="checkName()"
            class="pt-0"
          >
          </v-text-field>
          <v-text-field
            v-model="pw"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            prepend-icon="mdi-key"
            :rules="checkPassword()"
            class="pt-0"
          ></v-text-field>
          <v-row>
            <v-col class="d-flex justify-center">
              <v-btn type="submit" class="primary white--text">회원가입</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template v-else>
        <v-row>
          <v-col class="text-center">{{this.userName}} 가입을 완료하였습니다.</v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn class="primary white--text" link to="/users/signin">로그인</v-btn>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        userName: '',
        pw: '',
        isSignUpComp: false
      }
    },
    methods : {
      checkEmail() {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

        return _.isNil(this.email.match(regex)) ? ['이메일 형식이 아닙니다'] : [true]
      },
      checkName() {
        return this.userName.length === 0 ? ['이름을 입력하세요'] : [true]
      },
      checkPassword() {
        const regex = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9가-힣]).{8,})/i

        return _.isNil(this.pw.match(regex)) ? ['대,소문자/특수문자/숫자를 8자 이상 입력해주세요'] : [true]
      },
      onSubmit() {
        this.register()
      },
      register() {
         this.$http.post(`${this.$env.serverURI}/users/sign_up`, {
          name : this.userName,
          email : this.email,
          password : this.pw
        }).then(res => {
          this.isSignUpComp = true
          this.userName = ''
          this.email = ''
          this.password = ''
        })
      }
    }
  }
</script>

<style scoped>

</style>
