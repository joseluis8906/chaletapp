<template lang="pug">
doctype html
v-app(id="sandbox" :dark="dark" :light="!dark" standalone)
  v-toolbar
    v-btn(flat @click.native="volver")
      v-icon settings_backup_restore
    v-toolbar-title {{ $store.state.reports.title }}
    v-btn(flat @click.native="imprimir")
      v-icon print

  main
    v-container(fluid ml-0 mt-0 mr-0 mb-0 pl-0 pt-3 pr-0 pb-3 class="blue-grey lighten-4")
      nuxt

  v-footer
    <span> © {{ new Date().getFullYear() }} </span> Airton Tellez & Jorge Santana

</template>

<script>

import { mapState } from 'vuex'

export default {
  data: () => ({
    dark: false,
    footer: {
      fixed: true
    }
  }),
  methods: {
    imprimir () {
      window.print()
    },
    volver () {
      console.log(this.$store.state.reports)
      this.$router.push(this.$store.state.reports.volver)
    }
  }
}
</script>

<style lang="stylus">

#sandbox
  border 1px solid rgba(0, 0, 0, .1)
  overflow hidden

@media print
  body, page
    margin 0mm !important
    box-shadow none !important
    border none !important

  page[size="A8"][layout="Portrait"]
    margin 5mm !important

  .toolbar
    display none !important

  .footer
    display none !important

  .container.pb-3.pt-3
    margin 0 !important
    padding 0 !important
    border none !important

  .progress
    display none !important

  #sandbox
    margin 0 !important
    padding 0 !important
    border none !important

page
  background white
  display block
  overflow: hidden
  margin 12px auto 0px auto
  margin-bottom 0.5cm
  box-shadow 0 0 0.5cm rgba(0,0,0,0.5)

page[size="MidLetter"][layout="Landscape"]
  width 215.9mm
  height 139.7mm
  padding 6mm

page[size="Letter"][layout="Portrait"]
  width 215.9mm
  height 279.4mm
  padding 6mm

page[size="Letter"][layout="Landscape"]
  width 279.4mm
  height 215.9mm
  padding 6mm

page[size="A8"][layout="Portrait"]
  width 57mm
  height 74mm
  padding 2mm
</style>
