<template>
  <div :class="{wrap: true}">
    <client-only>
      <div :class="{admHtml: true}" v-html="this.notScriptTag">
      </div>
    </client-only>
    <!--input ref="sourceRef" type="hidden" :value="this.inlineScript()" /-->
  </div>
</template>

<script>
  import axios from 'axios'

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
        /* htmlSource: `<html>\n<head>\n<style type=\"text/css\">\nbody { margin:0; }\np { margin:0; padding:0; }\nimg { margin:0; padding:0; }\n.visual{background:url(https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/bg01.jpg) no-repeat scroll 50% 0; width:100%; }\n.visual2{background:url(https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/bg02.jpg) no-repeat scroll 50% 0; width:100%; }\n.visual4{background:url(https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/bg04.jpg) no-repeat scroll 50% 0; width:100%; }\n.visual5{background:url(https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/bg05.jpg) no-repeat scroll 50% 0; width:100%; }\n.visual6{background:url(https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/bg06.jpg) no-repeat scroll 50% 0; width:100%; }\n</style>\n<script type=\"text/javascript\">\nfunction tbNm(obj,img){\nvar imgArr =[  \n['https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_01.png','https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_on_01.png'],\n['https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_02.png','https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_on_02.png'],\n['https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_03.png','https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_on_03.png'],\n['https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_04.png','https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_on_04.png'],\n['https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_05.png','https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_on_05.png'],\n['https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_06.png','https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_on_06.png'],\n['https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_07.png','https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_on_07.png'],\n['https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_08.png','https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_on_08.png'],\n['https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_09.png','https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_on_09.png'],\n['https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_10.png','https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_on_10.png'],\n];\nfor(i=0;i < 10;i++){\nz = i+1;\nitmId = \"str\" + z;\nimgId = \"img\" + z;\ndocument.getElementById(itmId).style.display = \"none\";\ndocument.getElementById(imgId).src = imgArr[i][0];\n}\n\nif(obj == \"str1\"){\ndocument.getElementById(\"img1\").src = imgArr[0][1];\ndocument.getElementById(\"imgg1\").style.zIndex = \"90\";\ndocument.getElementById(\"imgg2\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg3\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg4\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg5\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg6\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg7\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg8\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg9\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg10\").style.zIndex = \"0\";\n}else if(obj == \"str2\"){\ndocument.getElementById(\"img2\").src = imgArr[1][1];\ndocument.getElementById(\"imgg1\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg2\").style.zIndex = \"90\";\ndocument.getElementById(\"imgg3\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg4\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg5\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg6\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg7\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg8\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg9\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg10\").style.zIndex = \"0\";\n}else if(obj == \"str3\"){\ndocument.getElementById(\"img3\").src = imgArr[2][1];\ndocument.getElementById(\"imgg1\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg2\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg3\").style.zIndex = \"90\";\ndocument.getElementById(\"imgg4\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg5\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg6\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg7\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg8\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg9\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg10\").style.zIndex = \"0\";\n}else if(obj == \"str4\"){\ndocument.getElementById(\"img4\").src = imgArr[3][1];\ndocument.getElementById(\"imgg1\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg2\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg3\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg4\").style.zIndex = \"90\";\ndocument.getElementById(\"imgg5\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg6\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg7\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg8\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg9\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg10\").style.zIndex = \"0\";\n}else if(obj == \"str5\"){\ndocument.getElementById(\"img5\").src = imgArr[4][1];\ndocument.getElementById(\"imgg1\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg2\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg3\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg4\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg5\").style.zIndex = \"90\";\ndocument.getElementById(\"imgg6\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg7\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg8\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg9\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg10\").style.zIndex = \"0\";\n}else if(obj == \"str6\"){\ndocument.getElementById(\"img6\").src = imgArr[5][1];\ndocument.getElementById(\"imgg1\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg2\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg3\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg4\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg5\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg6\").style.zIndex = \"90\";\ndocument.getElementById(\"imgg7\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg8\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg9\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg10\").style.zIndex = \"0\";\n}else if(obj == \"str7\"){\ndocument.getElementById(\"img7\").src = imgArr[6][1];\ndocument.getElementById(\"imgg1\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg2\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg3\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg4\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg5\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg6\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg7\").style.zIndex = \"90\";\ndocument.getElementById(\"imgg8\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg9\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg10\").style.zIndex = \"0\";\n}else if(obj == \"str8\"){\ndocument.getElementById(\"img8\").src = imgArr[7][1];\ndocument.getElementById(\"imgg1\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg2\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg3\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg4\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg5\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg6\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg7\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg8\").style.zIndex = \"90\";\ndocument.getElementById(\"imgg9\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg10\").style.zIndex = \"0\";\n}else if(obj == \"str9\"){\ndocument.getElementById(\"img9\").src = imgArr[8][1];\ndocument.getElementById(\"imgg1\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg2\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg3\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg4\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg5\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg6\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg7\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg8\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg9\").style.zIndex = \"90\";\ndocument.getElementById(\"imgg10\").style.zIndex = \"0\";\n}else if(obj == \"str10\"){\ndocument.getElementById(\"img10\").src = imgArr[9][1];\ndocument.getElementById(\"imgg1\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg2\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg3\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg4\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg5\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg6\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg7\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg8\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg9\").style.zIndex = \"0\";\ndocument.getElementById(\"imgg10\").style.zIndex = \"90\";\n}\ndocument.getElementById(obj).style.display = \"block\";\n}\nfunction strimgChk(obj,itmSrc){\ndocument.getElementById(obj).src = itmSrc;\n}\n\n<\/script>\n</head>\n\n<body>\n<table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\n  <tr>\n\t\t<td align=\"center\" class=\"visual\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/top.jpg\"></td>\n\t</tr>\n    <tr>\n\t\t<td align=\"center\" class=\"visual2\">
        <img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/top2.jpg\"></td>\n\t</tr>\n<tr>\n<td style=\"background:url(https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/bg-map.jpg) repeat top center; text-align:center; font-size:0; height:771px;\">\n\t\t\t<div style=\"background:url(https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/map.jpg) no-repeat; width:1190px; height:771px; margin:0 auto; text-align:center; position:relative;\">\n\t\t\t\t<a id=\"imgg1\" href=\"javascript:;\" style=\"display:block; position:absolute; top:160px; left:27px;\">\n\t\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_01.png\" name=\"img1\" border=\"0\" id=\"img1\" onMouseOver=\"tbNm('str1',this);\" />\n\t\t\t\t</a>\n\t\t\t\t<a id=\"imgg2\" href=\"javascript:;\" style=\"display:block; position:absolute; top:130px; left:535px;\">\n\t\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_on_02.png\" name=\"img2\" border=\"0\" id=\"img2\" onMouseOver=\"tbNm('str2',this);\" />\n\t\t\t\t</a>\n\t\t\t\t<a id=\"imgg3\" href=\"javascript:;\" style=\"display:block; position:absolute; top:323px; left:513px;\">\n\t\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_03.png\" name=\"img3\" border=\"0\" id=\"img3\" onMouseOver=\"tbNm('str3',this);\" />\n\t\t\t\t</a>\n\t\t\t\t<a id=\"imgg4\" href=\"javascript:;\" style=\"display:block; position:absolute; top:574px; left:454px;\">\n\t\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_04.png\" name=\"img4\" border=\"0\" id=\"img4\" onMouseOver=\"tbNm('str4',this);\" />\n\t\t\t\t</a>\n\t\t\t\t<a id=\"imgg5\" href=\"javascript:;\" style=\"display:block; position:absolute; top:462px; left:535px;\">\n\t\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_05.png\" name=\"img5\" border=\"0\" id=\"img5\" onMouseOver=\"tbNm('str5',this);\" />\n\t\t\t\t</a>\n\t\t\t\t<a id=\"imgg6\" href=\"javascript:;\" style=\"display:block; position:absolute; top:622px; left:211px;\">\n\t\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_06.png\" name=\"img6\" border=\"0\" id=\"img6\" onMouseOver=\"tbNm('str6',this);\" />\n\t\t\t\t</a>\n\t\t\t\t<a id=\"imgg7\" href=\"javascript:;\" style=\"display:block; position:absolute; top:423px; left:48px;\">\n\t\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_07.png\" name=\"img7\" border=\"0\" id=\"img7\" onMouseOver=\"tbNm('str7',this);\" />\n\t\t\t\t</a>\n\t\t\t\t<a id=\"imgg8\" href=\"javascript:;\" style=\"display:block; position:absolute; top:323px; left:48px;\">\n\t\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_08.png\" name=\"img8\" border=\"0\" id=\"img8\" onMouseOver=\"tbNm('str8',this);\" />\n\t\t\t\t</a>\n\t\t\t\t<a id=\"imgg9\" href=\"javascript:;\" style=\"display:block; position:absolute; top:525px; left:27px;\">\n\t\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_09.png\" name=\"img9\" border=\"0\" id=\"img9\" onMouseOver=\"tbNm('str9',this);\" />\n\t\t\t\t</a>\n\t\t\t\t\n                <a id=\"imgg10\" href=\"javascript:;\" style=\"display:block; position:absolute; top:226px; left:513px;\">\n\t\t\t\t\t<img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/btn_off_10.png\" name=\"img10\" border=\"0\" id=\"img10\" onMouseOver=\"tbNm('str10',this);\" />\n\t\t\t\t</a>\n              \n\t\t\t\t<div id=\"str1\" style=\"position:absolute; top:0px; left:664px; width:526px; display:none;\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/con-1.png\"></div>\n\t\t\t\t<div id=\"str2\" style=\"position:absolute; top:0px; left:664px; width:526px; z-index:0;\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/con-2.png\" border=\"0\" usemap=\"#Map_p02\"></div>\n\t\t\t\t<div id=\"str3\" style=\"position:absolute; top:0px; left:664px; width:526px; display:none;\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/con-3.png\" border=\"0\" usemap=\"#Map_p03\"></div>\n\t\t\t\t<div id=\"str4\" style=\"position:absolute; top:0px; left:664px; width:526px; display:none;\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/con-4.png\" ></div>\n\t\t\t\t<div id=\"str5\" style=\"position:absolute; top:0px; left:664px; width:526px; display:none;\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/con-5.png\" border=\"0\" usemap=\"#Map_p05\"></div>\n\t\t\t\t<div id=\"str6\" style=\"position:absolute; top:0px; left:664px; width:526px; display:none;\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/con-6.png\" ></div>\n\t\t\t\t<div id=\"str7\" style=\"position:absolute; top:0px; left:664px; width:526px; display:none;\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/con-7.png\" ></div>\n\t\t\t\t<div id=\"str8\" style=\"position:absolute; top:0px; left:664px; width:526px; display:none;\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/con-8.png\" ></div>\n\t\t\t\t<div id=\"str9\" style=\"position:absolute; top:0px; left:664px; width:526px; display:none;\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/con-9.png\"></div>\n                <div id=\"str10\" style=\"position:absolute; top:0px; left:664px; width:526px; display:none;\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/con-10.png\" border=\"0\" usemap=\"#Map_p10\"></div>\n                                                                                                               \n\t\t\t</div>\n\t\t</td>\n  </tr>\n <tr>\n\t<td align=\"center\" class=\"visual4\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/p.jpg\" border=\"0\" usemap=\"#Map_p\"></td>\n  </tr>\n    \n <tr>\n\t\t<td align=\"center\" class=\"visual5\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/e01.jpg\"></td>\n  </tr>\n <tr>\n\t<td align=\"center\" class=\"visual6\"><img src=\"https://image.hanatour.com/usr/manual/md/2020/07/PL00112525/images/e02.jpg\" border=\"0\" usemap=\"#Map_event\"></td>\n  </tr>\n</table>\n<map name=\"Map_p02\">\n  <area shape=\"rect\" coords=\"62,619,476,688\" href=\"#\" onfocus='this.blur()'>\n</map>\n<map name=\"Map_p03\">\n  <area shape=\"rect\" coords=\"62,619,476,688\" href=\"#\" onfocus='this.blur()'>\n</map>\n<map name=\"Map_p05\">\n  <area shape=\"rect\" coords=\"62,619,476,688\" href=\"#\" onfocus='this.blur()'>\n</map>\n<map name=\"Map_p10\">\n  <area shape=\"rect\" coords=\"62,619,476,688\" href=\"#\" onfocus='this.blur()'>\n</map>\n\n<map name=\"Map_p\">\n  <area shape=\"rect\" coords=\"322,604,927,716\" href=\"#\" onfocus='this.blur()'>\n</map>\n\n<map name=\"Map_event\">\n  <area shape=\"rect\" coords=\"163,1857,1044,1996\" href=\"#\" onfocus='this.blur()'>\n</map>\n\n</body>\n</html>\n",
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
        ` || '',
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
        const source = this.inlineScript() //this.$refs.sourceRef.value
        if (process.client) window.eval(source)
      },
      loadScript(src) {
        return new Promise(resolve => {
          axios.get(src).then(response => {
            window.eval(response.data)
            resolve()
          })
        })
      }
    },
    /* render(h) {
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
    } */
  }
</script>

<style scoped>
  .wrap {
    position: relative;
    margin-top: 50px;
  }
</style>
