<template lang="pug">
  v-flex(xs12 class="pl-0 pr-0")
    div( :style="{width: '100%', height: '256px', backgroundColor: 'black', backgroundImage:`url(${localSrc || 'default.png'}?radom=${Math.random(1)})`, backgroundSize: 'cover', backgroundPosition: 'center center', borderRadius: '5px'}" )
    v-dialog(v-model="dialog" persistent)
      v-btn(dark slot="activator" class="ml-0 light-blue" ) {{ label }}
      v-card
        v-card-title(class="headline") Subir Archivo
        v-card-text(class="text-xs-center")
            v-progress-circular(v-bind:size="100"
                                v-bind:width="15"
                                v-bind:rotate="360"
                                v-bind:value="progressValue"
                                class="teal--text") {{ progressValue }}

            input( ref="fileInput" type="file" accept=".png, .jpg, .jpeg" @change="subir" style="visibility: hidden" )
            v-btn(class="light-blue" dark @click.native="open") Seleccione un archivo
            v-btn(warning class="mt-3" @click.native="dialog=false") Cancelar
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
      localSrc: null,
      progressValue: 0
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

      let config = {

      }

      axios({method: 'POST', url: '/backend/upload/', data: form, headers: {'Content-type': 'nultipart/form-data'}, onUploadProgress: progressEvent => {
        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        console.log('subiendo: '+percentCompleted)
        this.progressValue = percentCompleted
        // do whatever you like with the percentage complete
        // maybe dispatch an action that will update a progress bar or something
      }}).then(res => {
          if(res.data.Result===1){
            this.progressValue = 0
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
