<!--template>
  <div :class="{wrap: true}">
    <client-only>
      <div :class="{admHtml: true}" v-html="this.notScriptTag">
      </div>
    </client-only>
    <input ref="sourceRef" type="hidden" :value="this.inlineScript()" />
  </div>
</template-->

<script>
  const regex = /<script\b[^>]*>([\s\S]*?)<(\/s|\\\/s)cript>/
  const regexg = /<script\b[^>]*>([\s\S]*?)<(\/s|\\\/s)cript>/g
  const regexpSrc = / src\=?[\'|\"](.+)[\'|\"]/i

  export default {
    created() {
      console.log('created')
    },
    mounted() {
      console.log('mounted')

      this.callScript()
    },
    data() {
      return {
        /* htmlSource: `<!-- wrap -->\n\t<div class=\"wrap\">\n\t\t<!-- box -->\n\t\t<div class=\"box\">\n\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_01.jpg\" alt=\"#\">\n\t\t</div>\n        <div class=\"box\">\n\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_02.jpg\" alt=\"#\">\n\t\t</div>\n        \t\t<!--// box -->\n\t\t<!-- box -->\n\t\t<div class=\"box second\">\n\t\t\t<div class=\"goods_list\">\n\t\t\t\t<ul>\n\t\t\t\t\t<li><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_tab_off1.png\" alt=\"1권역\"></li>\n\t\t\t\t\t<li><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_tab_on2.png\" alt=\"2권역\"></li>\n                    <li><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_tab_off3.png\" alt=\"3권역\"></li>\n                    <li><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_tab_off4.png\" alt=\"4권역\"></li>\n\t\t\t\t\t<li><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_tab_off5.png\" alt=\"5권역\"></li>\n\t\t\t\t\t<li><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_tab_off6.png\" alt=\"6권역\"></li>\n                    <li><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_tab_off7.png\" alt=\"7권역\"></li>\n                    <li><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_tab_off8.png\" alt=\"8권역\"></li>\n                    <li><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_tab_off9.png\" alt=\"9권역\"></li>\n                    <li><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_tab_off10.png\" alt=\"10권역\"></li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t\t<!--// box -->\n\t\t<!-- box -->\n\t\t<div class=\"box third\"  style=\"display:block;\">\n\t\t\t<div class=\"cont\" style=\"display:none;\">\n\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_con1.png\" alt=\"1권역 평화역사이야기여행\">\n\t\t\t</div>\n\t\t\t<div class=\"cont\" style=\"display:block;\">\n\t\t\t\t<a href=\"https://m.hanatour.com/trp/pkg/CHPC0PKG0100M100?cityCdNm=%EA%B0%95%EC%9B%90&cityCd=KAG&depYm=202007&prodBrndCds=19&areaCd=AK\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_con2.png\" alt=\"2권역\"></a>\n\t\t\t</div>\n            <div class=\"cont\" style=\"display:none;\">\n\t\t\t\t<a href=\"https://m.hanatour.com/trp/pkg/CHPC0PKG0100M100?cityCdNm=%EA%B2%BD%EC%83%81&cityCd=TAE&depYm=202007&prodBrndCds=19&areaCd=AK\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_con3.png\" alt=\"3권역\"></a>\n\t\t\t</div>\n            <div class=\"cont\" style=\"display:none;\">\n\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_con4.png\" alt=\"4권역\">\n\t\t\t</div>\n            <div class=\"cont\" style=\"display:none;\">\n\t\t\t\t<a href=\"https://m.hanatour.com/trp/pkg/CHPC0PKG0100M100?cityCdNm=%EC%9A%B8%EC%82%B0%EC%8B%9C&cityCd=USN&depYm=202007&prodBrndCds=19&areaCd=AK\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_con5.png\" alt=\"5권역\"></a>\n\t\t\t</div>\n            <div class=\"cont\" style=\"display:none;\">\n\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_con6.png\" alt=\"6권역\">\n\t\t\t</div>\n            <div class=\"cont\" style=\"display:none;\">\n\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_con7.png\" alt=\"7권역\">\n\t\t\t</div>\n            <div class=\"cont\" style=\"display:none;\">\n\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_con8.png\" alt=\"8권역\">\n\t\t\t</div>\n            <div class=\"cont\" style=\"display:none;\">\n\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_con9.png\" alt=\"9권역\">\n\t\t\t</div>\n             <div class=\"cont\" style=\"display:none;\">\n\t\t\t\t<a href=\"https://m.hanatour.com/trp/pkg/CHPC0PKG0100M100?cityCdNm=%EC%A0%9C%EC%B2%9C%EC%8B%9C&cityCd=AE0&depYm=202007&prodBrndCds=19&areaCd=AK\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_con10.png\" alt=\"10권역\"></a>\n\t\t\t</div>\n\t\t</div>\n\t\t<!--// box -->\n\t\t\n         <div class=\"box\">\n\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_04.jpg\" alt=\"안전여행캠페인 하나투어\">\n\t\t</div>\n        <div class=\"box\">\n\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_05.jpg\" alt=\"대한민국 안전여행 참여 이벤트\">\n\t\t</div>\n          <div class=\"box\">\n\t\t\t<a href=\"http://ktourtop10.kr/kr/event/info.php\" target=\"_blank\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/mo_btn02.jpg\" alt=\"이벤트참여하기\"></a>\n\t\t</div>\n <div class=\"box\">\n            <img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/mo/m_tel.jpg\" alt=\"고객센터 전화번호\">\n\t\t</div>\n\n        <!--// box -->\n\t\t\n\t</div>\n\t<!--// wrap -->\n
        <script>console.log('ready'); function ToggleBtn(){\n    var imgPath;\n    var secondScroll;\n    var thirdScroll;\n    var $third = $('.third');\n    var $second = $('.second');\n    $(\".goods_list li img\").on(\"click\",function(){\n      var $this = $(this);\n      var idx = $this.closest('li').index();\n      thirdScroll = $second.offset().top - $('#header').outerHeight();\n      console.log(thirdScroll);\n      $(\".goods_list li img\").each(function(){ //이미지를 돌면서 off로 초기화\n        if($(this).attr('src').indexOf('_on') > -1){\n          $(this).attr('src',$(this).attr('src').replace('_on','_off'));\n        }\n      });\n\n      imgPath = $this.attr('src');\n      if(imgPath.indexOf('_off') > -1) //해당이미지내용의 off를 on으로  on을 off로\n        imgPath = imgPath.replace('_off','_on');\n      else{\n        imgPath = imgPath.replace('_on','_off');\n      }\n      $this.attr('src',imgPath);\n      $third.find('.cont').siblings().hide().eq(idx).show();\n      $('html,body').animate({\n        scrollTop : thirdScroll\n      });\n    });\n    $(\".btn_another\").on('click',function(e){\n      e.preventDefault();\n      secondScroll = $second.offset().top;\n      $('html,body').animate({\n        scrollTop : secondScroll\n      });\n    });\n  }\n\n $(document).ready(function(){\n  var toggleBtn = new ToggleBtn();\n});\n<\/script>
        <style>*{margin:0;padding:0;}\n\tli{list-style:none;}\n    .wrap{overflow:hidden;}\n    img{width:100%;height:auto;vertical-align:top;}\n    .box{float:left;width:100%;}\n\t.box.second .goods_list{width:100%;margin:0 auto;padding-bottom:0;}\n\t.box.second .goods_list li:nth-child(1){width:20%}\n    .box.second .goods_list li:nth-child(2){width:20%}\n    .box.second .goods_list li:nth-child(3){width:20%}\n\t.box.second .goods_list li:nth-child(4){width:20%}\n    .box.second .goods_list li:nth-child(5){width:20%}\n\t.box.second .goods_list li:nth-child(6){width:20%}\n    .box.second .goods_list li:nth-child(7){width:20%}\n\t.box.second .goods_list li:nth-child(8){width:20%}\n\t.box.second .goods_list li:nth-child(9){width:20%}\n    .box.second .goods_list li:nth-child(10){width:20%}\n    .box.second ul{overflow:hidden;margin-left:0;}\n    .box.second li{float:left;width:50%;margin:0 0 0 0;}\n\t.box.forth{position:relative;}\n\t.box.forth ul{overflow:hidden;}\n    .box.forth li{float:left;width:50%;}</style>\n
        `, */
        htmlSource: `
          <div>
            <style>.cont {color: blue;}</style>
            <div class="cont">tween</div>
            <a href="#" onclick="tb('1');return false;">onclick tab1</a>
            <a href="#" onclick="tb('2');return false;">onclick tab2</a>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.4.0/gsap.min.js"><\/script>
            <script> console.log("log"); <\/script>
                  text
            <script>  TweenMax.to($(".cont"), 3, {marginLeft: "50%"});  <\/script>
            <script>  $(".myClass").css("color", "red");  <\/script>
            <script>  function tb(n) {alert(n);}  <\/script>
            <script>  $(document).ready(function () {
              $(".cont").before("<div>document ready !!!</div>");
              TweenMax.to($(".cont"), 3, {paddingTop: "20px"});
            })  <\/script>
          </div>
        `,
      }
    },
    computed: {
      scriptTag : function () {
        return this.htmlSource.match(regexg) || []
      },
      notScriptTag : function () {
        return this.htmlSource.replace(regexg, '')
      }
    },
    methods: {
      inlineScript() {
        return Array.apply(null, { length: this.scriptTag.length }).map((item, idx) => {
          const inline = this.scriptTag[idx].match(regex) //inline 스크립트 대응
          let vnode;

          if (inline) {
            vnode = inline.length > 1 ? inline[1] : ''
          }

          return vnode
        }).join('')
      },
      callScript() {
        const srcScript = this.scriptTag.filter((item, idx) => {
          const regResult = String.prototype.match.call(item, regexpSrc)

          return regResult ? regResult.length > 1 : false
        })

        if (srcScript.length > 0) {
          srcScript.map(async (item, idx) => {
            const regResult = String.prototype.match.call(item, regexpSrc)
            const realSrc = regResult.length > 1 ? regResult[1] : null
            let src = '';

            if (realSrc) {
              await this.loadScript(realSrc)

              this.$nextTick(function () {
                this.startScript()
              })
            }
          })
        } else {
          this.$nextTick(function () {
            this.startScript()
          })
        }
      },
      startScript() {
        const source = this.$refs.sourceRef.value
        if (process.client) window.eval(source)
      },
      loadScript(src) {
        const div = document.createElement('div')

        return new Promise(function (resolve) {
          console.log(src)
          $(div).load(src, (source) => {
            window.eval(source)
            resolve()
          })
        })
      }
    },
    render(h) {
      return h('div',
        {
          class: {wrap: true}
        },
        [
          h('client-only',
            [
              h('div', {
                class: {admHtml: true},
                domProps: {
                  innerHTML: this.notScriptTag
                }
              }),
            ]
          ),
          h('input', {
            ref: 'sourceRef',
            //style: {width: '100%', height: '100vh'},
            domProps: {type: 'hidden', value: this.inlineScript(h)}
          }),
        ]
      )
    }
  }
</script>

<style scoped>
  .wrap {
    position: relative;
    margin-top: 50px;
  }
</style>
