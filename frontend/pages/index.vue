<template lang="pug">
v-container(fluid style="max-width:1024px")
  v-layout(row wrap pa-0)
    v-flex(xs12 style="min-height: 320px; background-color: rgb(22,45,80)" pa-0)
      v-container(fluid pa-0)
        v-layout(row wrap)
          v-flex(xs12)
            v-toolbar(dark)
              v-toolbar-title Chalet Escenarios Deportivos
              v-spacer
              v-toolbar-side-icon(class="hidden-md-and-up")
              v-toolbar-items(class="hidden-sm-and-down")
                v-btn(flat) Inicio
                v-btn(flat) Nosotros

          v-flex(xs12 md9)
            img(src="/imagen1.jpg" width="100%" class="ml-1")

          v-flex(xs12 md3 pa-2)
            h2(class="display-1 grey--text text--lighten-4" style="font-family: 'Alfa Slab One', cursive;") Los Mejores Escenarios
            p(class="body-1 grey--text text--lighten-4 pa-2" style="font-family: 'Roboto Thin', sans-serif;")
              | Todos nuestros escenarios cuentan con las mejores condiciones de seguridad y equipación, son espacios diseñados para
              | que se desarrollen las actividades deportivas de forma segura y responsable, contamos con personal capacitado en el mantenimiento y reparación de todas nuestas
              | instalaciones, no pierdas la oportunidad de venir y conocer nuestos campos de futbol y circuitos de competencia.


  v-layout(row wrap mt-2 style="background-color: transparent")
    v-flex(xs12 md8)
      img(src="/imagen2.png" width="100%")
    v-flex(xs12 md4)
      img(src="/imagen3.png" width="100%")

  v-layout(row wrap mt-2)
    v-flex(xs12 md9 pt-5 pl-2 pb-2 style="min-height: 480px; background-image: url('/imagen4.png'); background-size: 100% 100%; background-position: left top")
      youtube(:video-id="videoId" :startTime="startTime" :player-width="playerWidth" :player-height="playerHeight" class="mt-4")
    v-flex(xs12 md3 grey style="min-height: 256px") Gris derecho

  v-layout(row wrap mt-2)
    v-flex(xs12 md9 blue style="min-height: 256px") Azul izquierdo
    v-flex(xs12 md3 yellow style="min-height: 256px") Negro derecho


</template>

<script>

import GCarousel from '~components/GCarousel.vue'
import { getIdFromURL, getTimeFromURL } from 'vue-youtube-embed'

export default {
  data () {
    return {
      videoId: null,
      startTime: null,
      playerWidth: '750',
      playerHeight: '390'
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
  },
  mounted () {
    this.$nextTick(() => {
      this.videoId = this.$youtube.getIdFromURL('https://www.youtube.com/watch?v=bjnsD1qsHYY')
      this.startTime = this.$youtube.getTimeFromURL('https://www.youtube.com/watch?v=bjnsD1qsHYY')
    });
  },
  methods:{
    handleResize () {
      let width = window.screen.width

      if(width>1024){
        this.playerWidth = '750'
      }else{
        this.playerWidth = '400'
      }
    }
  },
  layout: 'page',
  components: {
    GCarousel,
  },
  head () {
    return {
      meta: [{name: "viewport", content: "width=device-width, initial-scale=1, maximun-scale=1, user-scalable=no, minimal-ui"}],
      title: "Chalet Escenarios Deportivos"
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>

h1, h2
  font-weight normal;

ul
  list-style-type none
  padding 0


li
  display inline-block
  margin 0 10px

a
  color #42b983

</style>
