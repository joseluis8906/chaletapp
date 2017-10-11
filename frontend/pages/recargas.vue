<template lang="pug">
v-layout( align-center justify-center )
  v-snackbar(
    :timeout="snackbar.timeout"
    :success="snackbar.context === 'success'"
    :info="snackbar.context === 'info'"
    :warning="snackbar.context === 'warning'"
    :error="snackbar.context === 'error'"
    :primary="snackbar.context === 'primary'"
    :secondary="snackbar.context === 'secondary'"
    :multi-line="snackbar.mode === 'multi-line'"
    :vertical="snackbar.mode === 'vertical'"
    :top="true"
    v-model="loading" )
      h6(class="grey--text text--lighten-4 mb-0") {{ snackbar.text }}
      v-icon autorenew

  v-flex( xs12 mt-3 md8 lg6 )
    v-card
      v-layout(row wrap pt-3 light-blue)
        v-flex( xs12 )
          h5(class="grey--text text--lighten-4 text-xs-center bold")
            v-icon(ma) attach_money
            |  Recargas
      v-card-text
        v-layout(row wrap)
          v-flex(xs12)
            v-select(v-bind:items="ItemsUsuario"
                     v-model="Usuario"
                     label="Usuario"
                     item-text="UserName"
                     item-value="Id"
                     autocomplete
                     dark)

            v-money(label="Saldo"
                    maskType="currency"
                    v-model="Saldo"
                    readonly)

            v-money(label="Recarga"
                     maskType="currency"
                     v-model="Recarga")

      v-card-actions
        v-spacer
        v-btn( dark @click.native="Reset" ) Cancelar
        v-btn( dark primary @click.native="CryptPassword" ) Guardar

</template>

<style lang="stylus" scoped>
h5.bold
  font-weight bold

.alert-especial
  position absolute
</style>

<script>
import USUARIOS from '~/queries/Usuarios.gql'

import VMoney from '~/components/MonetaryInput.vue'
import axios from 'axios'

export default {
  data: () => ({
    snackbar: {
      context: 'secondary',
      mode: '',
      timeout: 6000,
      text: 'Cargando'
    },
    ItemsUsuario: [],
    Usuario: null,
    Saldo: null,
    Recarga: null,
    loading: 0
  }),
  beforeMount () {
    if (sessionStorage.getItem('x-access-token') === null || sessionStorage.getItem('x-access-token') === null) {
      this.$router.push('/')
    } else {
      var Roles = JSON.parse(sessionStorage.getItem('x-access-roles'))
      this.$store.commit('security/AddRoles', Roles);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$mqtt.subscribe('chaletapp/apollo/mutation')
    })
  },
  apollo: {
    Usuarios: {
      query: USUARIOS,
      loadingKey: 'loading',
      update (data) {
        //console.log(data)
        this.ItemsUsuario = []
        for(let j=0; j<data.Usuarios.length; j++){
          for (let i=0; i < data.Usuarios[j].Grupos.length; i++){
            if (data.Usuarios[j].Grupos[i].Nombre === 'Cliente') {
              this.ItemsUsuario.push(data.Usuarios[j])
            }
          }
        }
      }
    }
  },
  watch: {
  },
  mqtt: {
    'chaletapp/apollo/mutation': function (val) {
      console.log('mqtt')
      var res = (JSON.parse(val))
      var Method = res.Method
      var Obj = res.Obj

      switch (Method) {
        case 'StoreUsuario': this.StoreUsuario(Obj)
      }

    }
  },
  methods: {
    PubMsg () {
      //console.log('enviando: ' + this.Msg)
      this.$mqtt.publish('chaletapp/apollo/mutation', this.Msg)
    },
    LoadUi () {
    },
    Reset () {
      this.Usuario = null,
      this.Saldo = null,
      this.Recarga = null
    }
  },
  components: {
    VMoney
  }
};


</script>
