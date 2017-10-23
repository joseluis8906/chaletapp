<template lang="pug">
  v-flex(xs12 class="pl-0 pr-0")
    div( :style="{width: '100%', height: '256px', backgroundColor: 'black', backgroundImage:`url(${file || 'default.png'})`, backgroundSize: 'cover', backgroundPosition: 'center center', borderRadius: '5px'}" )
    v-dialog(v-model="dialog" persistent)
      v-btn(dark slot="activator" class="ml-0 light-blue") {{ label }}
      v-card
        v-card-title(class="headline") Use Google's location service?
        v-card-text Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
        v-card-actions
          v-spacer
          v-btn(class="green--text darken-1" flat="flat" @click.native="dialog = false") Disagree
          v-btn(class="green--text darken-1" flat="flat" @click.native="dialog = false") Agree
</template>

<style lang="stylus" scope>

</style>

<script>
export default {
  props: [
    'label',
    'file'
  ],
  data: function() {
    return {
      inputFocused: false,
      dialog: false
    }
  },
  watch: {
  },
  methods: {
  },
  computed: {
  }
}
</script>
