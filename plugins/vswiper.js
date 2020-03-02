export default {
  bind: function(el, binding) {
    new Swiper(el, {
      slidesPerView: 1,
      loop: false /*
      autoplay: {
        delay: 2000
      }, */,
      spaceBetween: 10,
      observer: true /*,
      observeParents: true  ,
      observeSlideChildren: true */,
      on: {
        observerUpdate: function(e) {
          console.log(e)
          if (
            e.type === "childList" &&
            e.target.classList.contains("swiper-wrapper")
          ) {
            const swiper = e.target.parentElement.swiper
            console.log(e.target.style.display)

            swiper.destroy(false, false)
            new Swiper(e.target.parentElement, swiper.params)
          }
        }
      }
    })
  }
}
