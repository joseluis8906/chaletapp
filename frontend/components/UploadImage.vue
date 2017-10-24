<template lang="pug">
  v-flex(xs12 class="pl-0 pr-0")
    div( :style="{width: '100%', height: '256px', backgroundColor: 'black', backgroundImage:`url(${localSrc || 'default.png'}?radom=${Math.random(1)})`, backgroundSize: 'cover', backgroundPosition: 'center center', borderRadius: '5px'}" )
    v-dialog(v-model="dialog" persistent)
      v-btn(dark slot="activator" class="ml-0 light-blue" ) {{ label }}
      v-card
        v-card-title(class="headline") Subir Archivo
        v-card-text
          input( ref="fileInput" type="file" accept=".png, .jpg, .jpeg" @change="subir" style="visibility: hidden" )
          v-btn(class="light-blue" dark @click.native="open") Seleccione un archivo
</template>

<style lang="stylus" scope>

</style>

<script>
import axios from 'axios'

export default {
  props: [
    'value',
    'label',
    'name',
    'src'
  ],
  data: function() {
    return {
      inputFocused: false,
      dialog: false,
      fileName: null,
      localSrc: null
    }
  },
  created () {
    this.localSrc = this.value
  },
  watch: {
    localSrc () {
      this.$emit('input', this.localSrc)
    },
    src () {
      this.localSrc = this.src
    }
  },
  methods: {
    open () {
      this.$refs.fileInput.click()
    },
    subir (evt) {
      let sampleFile = evt.target.files[0]
      let form = new FormData()

      if(sampleFile.type === 'image/jpeg'){
        this.fileName = this.name.split(' ').join('-') + '.jpeg'
      }else{
        this.fileName = this.name.split(' ').join('-') + '.png'
      }
      form.append('sampleFile', sampleFile, this.fileName)

      axios({method: 'POST', url: '/backend/upload/', data: form, headers: {'Content-type': 'nultipart/form-data'}}).then(res => {
          if(res.data.Result===1){
            this.recargarImagen(res.data.Name)
          }
      });
    },
    recargarImagen(Name) {
      this.dialog = false
      this.localSrc = null
      this.localSrc = Name
    }
  }
}
</script>
