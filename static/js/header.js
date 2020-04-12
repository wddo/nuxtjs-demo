document.addEventListener('DOMContentLoaded', () => {
  var header = document.querySelector('#lnb')

  header.addEventListener('mouseenter', headerHandler)
  header.addEventListener('mouseleave', headerHandler)
})

function headerHandler(e) {
  var sub = document.querySelector('#sub')

  if (e.type === 'mouseenter') {
    sub.style.display = 'block'
  } else if (e.type === 'mouseleave') {
    sub.style.display = 'none'
  }
}

