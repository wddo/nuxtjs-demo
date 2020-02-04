<template>
  <div class="mydirective_wrap">
    <h3>어떠한 변화가 일어나면 왜 같은 레벨이 있는 v-focus 전부 update가 일어나나????</h3>
    <p>
      <button @click="isShow = !isShow">toggle : v-if</button>
      <span>조작 하위 v-focus 가 반응</span>
    </p>
    <p>
      <button @click="changeStyle">toggle : style</button>
      <span>단순 display 컨트롤, 조작 하위 v-focus 미반응</span>
    </p>
    <div v-show="isShow" ref="hideDiv">
      vfocus btn :
      <button v-focus @click="changeFirstValueHandler">{{ this.firstBtnValue }}</button>
    </div>

    <hr />

    <div>
      <button v-focus>non data button</button>
    </div>

    <hr />

    <div>
      <button @click="createBtnHandler($event)">
        {{ this.createBtnValue }}
      </button>
      <a href="#none" @click.prevent="toggleContainerHandler">toggle</a>
      <div class="toggleContainer" style="display:none;">
        <div ref="target"></div>
        <span>
          dynamic btn : 독립적인 vue 객체가 된다!!! 그러므로 여기 다른 directive 처럼 여기 변화에 반응하지 않는다.
          <br />
          그래서 내부 이벤트 __vue__ 통해 강제 호출 중
        </span>
      </div>
    </div>
    <button @click="changeCreateValueHandler">
      change value
    </button>

    <hr />

    <p><router-link to="/"> go index </router-link></p>
  </div>
</template>

<script>
import Vue from "vue"
import _ from "lodash"

export default {
  data() {
    return {
      isShow: false,
      firstBtnValue: "first btn",
      createBtnValue: "call dynamic"
    }
  },
  updated() {
    console.log("updated hook")
  },
  methods: {
    changeStyle() {
      //단순 display 컨트롤 (내용 v-focus 가 반응 하지 않는걸 알 수 있다)
      this.$refs.hideDiv.style.display = this.$refs.hideDiv.style.display === "block" ? "none" : "block"
    },
    toggleContainerHandler() {
      //display 보이면서 event 트리거 // 재 클릭시  숨김 (내용 v-focus 가 반응)
      const toggleContaienr = document.querySelector(".toggleContainer")

      if (toggleContaienr.style.display === "none") {
        toggleContaienr.style.display = "block"

        this.$fx.resetSwiper(toggleContaienr)

        //강제 event 호출로 reset
        /*
        const vfocusBtns = toggleContaienr.querySelectorAll(".v-focus")
        vfocusBtns.forEach(item => {
          //iif (item.__vue__) tem.__vue__.click()
          if (item.__vue__) item.__vue__.$el.dispatchEvent(new Event("reset"))
        })
        */
      } else {
        toggleContaienr.style.display = "none"
      }
    },
    changeFirstValueHandler() {
      this.firstBtnValue = "changed first btn"
    },
    createBtnHandler(e) {
      const button = e.target
      const copyButton = button.cloneNode(true)
      copyButton.classList.add("v-focus")
      copyButton.setAttribute("v-focus", "")
      //copyButton.setAttribute("v-on:click", "click")
      copyButton.innerHTML = "{{this.btnValue}}"

      const MyComponent = Vue.extend({
        data() {
          return {
            btnValue: "dynamic btn"
          }
        },
        /* directives: {
          focus: Vue.directive("focus") //자체가 v-focus 이므로 의미 없어 보임
        }, */
        parent: this.$parent,
        template: copyButton.outerHTML,
        mounted() {
          this.$el.addEventListener("reset", function() {
            console.log("reset")
          })
        },
        updated() {
          console.log("updated in Vue.extend")
        },
        methods: {
          /* click() {
            console.log("click")
          } */
        }
      })

      new MyComponent().$mount(this.$refs.target)
    },
    changeCreateValueHandler() {
      /* const btns = document.querySelectorAll("button");
      btns.forEach(item => {
        item.remove();
      }); */
      this.createBtnValue = "call changed"
    }
  }
}
</script>

<style scoped>
.mydirective_wrap {
  padding: 10px;
}

span {
  font-size: 9pt;
  color: #008800;
}
</style>
