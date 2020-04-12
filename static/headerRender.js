var iframe = document.createElement('iframe')
iframe.src = '//localhost:3000/header'
document.body.append(iframe)

var header = document.createElement('div')
header.id = 'header'
document.body.append(header)

var script= document.createElement('script')
script.type= 'text/javascript'
script.src= '/js/header.js'
document.body.appendChild(script)

function call(html) {
  document.querySelector('#header').innerHTML = html
}
