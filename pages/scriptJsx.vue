<script>
  const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/
  const regexg = /<script\b[^>]*>([\s\S]*?)<\/script>/g
  const regexpSrc = /src\=?[\'|\"](.+)[\'|\"]/i

  export default {
    created() {
      console.log('created')
    },
    mounted() {
      console.log('mounted')
    },
    data() {
      return {
        htmlSource: `<script src="https://code.jquery.com/jquery-3.5.0.min.js"><\/script>
          <script> console.log("a"); <\/script>
                text
          <script>  console.log("b")  <\/script>`
      }
    },
    computed: {
      vhtml : function () {
        return this.htmlSource.match(regexg)
      }
    },
    render(h) {
      return h('div',
        {
          innerHTML: 'text'
        }, h('client-only',
          Array.apply(null, { length: this.vhtml.length }).map((item, idx) => {
            const src = this.vhtml[idx].match(regexpSrc) //src 대응
            const inline = this.vhtml[idx].match(regex) //inline 스크립트 대응
            let vnode

            if (src) {
              vnode = h('script', {
                attrs: {src: src.length > 1 ? src[1] : ''}
              })
            } else {
              vnode = h('script', {
                domProps: {
                  innerHTML: inline.length > 1 ? inline[1] : ''
                }
              })
            }

            return vnode
          }).concat(['text'])
        )
      )
    }
  }
</script>

<style scoped>

</style>
