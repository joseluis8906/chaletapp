<template lang="pug">
v-container(fluid pt-1 pb-0 pl-0 pr-0 id="inicio")
  v-layout(row wrap pt-0 mt-0)
    v-flex(xs12)
      div(v-swiper:mySwiper="swiperOption")
         div(class="swiper-wrapper")
           div( class="swiper-slide" v-for="(item, i) in items" v-bind:key="i" )
             div(class="g-slide" :style="item.style")

</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          style: {'background-image': "url('/collage.png')"}
        },
      ],
      swiperOption: {
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        speed: 1000,
        loop: true,
        effect: 'fade'
      }
    }
  },
  methods: {
    handleResize () {
      if (process.BROWSER_BUILD) {
        let height = ((window.screen.width * 59.4) / 100);
        this.items[0].style = {
          'background-image': "url('/collage.png')",
          'min-height': height + "px"
        };
        //console.log(this.items[0])
      }
    }
  },
  created () {
    if (process.BROWSER_BUILD) {
      window.addEventListener('resize', this.handleResize)
      window.addEventListener('load', this.handleResize)
    }
  },
  destroyed () {
    if (process.BROWSER_BUILD) {
      window.removeEventListener('resize', this.handleResize)
      window.removeEventListener('load', this.handleResize)
    }
  }
}

</script>

<style lang="stylus" scoped>
.especial-btn
  margin-top 17%
  margin-left 35%

.my-swiper
  height 512px;
  width 100%;

.swiper-slide
  text-align center
  display flex
  justify-content center
  align-items center
  height 100%

.g-slide
  width 100%
  min-height 800px
  background-color black
  background-size 100%
  background-position top
</style>
