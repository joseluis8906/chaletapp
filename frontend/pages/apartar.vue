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

  v-flex( xs12 md10 lg8 mt-5 )
    v-layout(row wrap justify-space-around class="g-layout")
      v-fliped-card(title="Cancha de futbol 01"
                    src="/cancha01.jpeg"
                    esp1="60x18 m"
                    esp2="Grava sintética"
                    esp3="Cubierta anti-lluvia"
                    :precio=20000
                    :likes=3)

</template>

<style lang="stylus" scoped>

h5.bold
  font-weight boldoverflow hidden

.alert-especial
  position absolute

</style>

<script>

import ESCENARIOS from '~/queries/Escenarios.gql'
import VFlipedCard from '~/components/FlipedCard.vue'

export default {
  data: () => ({
    snackbar: {
      context: 'secondary',
      mode: '',
      timeout: 6000,
      text: 'Cargando'
    },
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
  apollo: {
    Escenarios: {
      query: ESCENARIOS,
      variables () {
        return {
          Tipo: this.Tipo,
          Codigo: this.Codigo
        }
      },
      loadingKey: 'loading',
      update (data) {
        //console.log(data)
        this.LoadUi(data.Escenarios)
      }
    },
  },
  methods: {
    LoadUi () {
    }
  },
  components: {
    VFlipedCard
  }
};


</script>
