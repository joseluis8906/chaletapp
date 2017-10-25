<template lang="pug">
v-container(fluid style="max-width:1024px")
  v-layout(row wrap)
    v-flex(xs12 blue style="min-height: 320px")
      v-container(pa-1)
        v-layout(row)
        v-layout(row)
          v-flex(xs12 md9)

          v-flex(xs12 md3)
            h5(class="title") Los Mejores Escenarios


  v-layout(row wrap mt-2)
    v-flex(xs12 md8 black style="min-height: 256px") negro izquierdo
    v-flex(xs12 md4 blue style="min-height: 256px") azul derecho

  v-layout(row wrap mt-2)
    v-flex(xs12 md9 black style="min-height: 256px") negro izquierdo
    v-flex(xs12 md3 grey style="min-height: 256px") Gris derecho

  v-layout(row wrap mt-2)
    v-flex(xs12 md9 blue style="min-height: 256px") Azul izquierdo
    v-flex(xs12 md3 yellow style="min-height: 256px") Negro derecho


</template>

<script>

import GCarousel from '~components/GCarousel.vue'


export default {
  data () {
    return {
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
