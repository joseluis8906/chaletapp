GRUPOS<template lang="pug">
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
            v-icon(ma) group
            |  Grupo
      v-card-text
        v-layout( row wrap)
          v-flex( xs12 )
            v-text-field( label="Nombre" v-model="Nombre" dark )

      v-card-actions
        v-spacer
        v-btn( dark @click.native="Reset" ) Cancelar
        v-btn( dark primary @click.native="CreateOrUpdate" ) Guardar
</template>

<script>

import GRUPOS from '~/queries/Grupos.gql'
import CREATE_GRUPO from '~/queries/CreateGrupo.gql'
import UPDATE_GRUPO from '~/queries/UpdateGrupo.gql'

export default {
  data: () => ({
    snackbar: {
      context: 'secondary',
      mode: '',
      timeout: 6000,
      text: 'Cargando'
    },
    Id: null,
    Nombre: null,
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
  beforeDestroy () {
    this.$mqtt.unsubscribe('chaletapp/apollo/mutation')
  },
  apollo: {
    Grupos: {
      query: GRUPOS,
      variables () {
        return {
          Nombre: this.Nombre
        }
      },
      loadingKey: 'loading',
      update (data) {
        //console.log(data)
        this.LoadUi(data.Grupos)
      }
    },
  },
  mqtt: {
    'chaletapp/apollo/mutation': function (val) {
      console.log('mqtt')
      var res = (JSON.parse(val))
      var Method = res.Method
      var Obj = res.Obj

      switch (Method) {
        case 'StoreGrupo': this.StoreGrupo(Obj)
      }

    }
  },
  methods: {
    StoreGrupo (Grupo) {
      var store = this.$apollo.provider.defaultClient

      try{
        var data = store.readQuery({
          query: GRUPOS,
        })

        var Existe = false

        for (let i=0; i<data.Grupos.length; i++) {
          if (data.Grupos[i].Id === Grupo.Id) {
            Existe = true
            data.Grupos[i] = Grupo
          }
        }

        (!Existe) ? data.Grupos.push(Grupo) : null;

        store.writeQuery({
          query: GRUPOS,
          data: data
        })

      } catch (Err) {

        var data = {Grupos: []}

        data.Grupos.push(Grupo)

        store.writeQuery({
          query: GRUPOS,
          data: data
        })
      }


      //por Nombre
      try{
        var data = store.readQuery({
          query: GRUPOS,
          variables: {
            Nombre: Grupo.Nombre
          }
        })

        var Existe = false

        for (let i=0; i<data.Grupos.length; i++) {
          if (data.Grupos[i].Id === Grupo.Id) {
            Existe = true
            data.Grupos[i] = Grupo
          }
        }

        (!Existe) ? data.Grupos.push(Grupo) : null;

        store.writeQuery({
          query: GRUPOS,
          variables: {
            Nombre: Grupo.Nombre
          },
          data: data
        })

      } catch (Err) {

        var data = {Grupos: []}

        data.Grupos.push(Grupo)

        store.writeQuery({
          query: GRUPOS,
          variables: {
            Nombre: Grupo.Nombre
          },
          data: data
        })
      }

    },
    CreateOrUpdate () {
      if (this.Id === null) {
        this.Create();
      }else{
        this.Update();
      }
    },
    Create () {
      const Group = {
        Nombre: this.Nombre
      };

      this.Reset ();

      this.$apollo.mutate ({
        mutation: CREATE_GRUPO,
        variables: {
          Nombre: Group.Nombre
        },
        loadingKey: 'loading',
        update: (store, { data: res }) => {
            this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreGrupo', Obj: res.CreateGrupo}))
        },
      })
    },
    Update () {
      //console.log(this.Password)
      const Group = {
        Id: this.Id,
        Nombre: this.Nombre,
      };

      this.Reset ();

      this.$apollo.mutate ({
        mutation: UPDATE_GRUPO,
        variables: {
          Id: Group.Id,
          Nombre: Group.Nombre
        },
        loadingKey: 'loading',
        update: (store, { data: res }) => {
          this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreGrupo', Obj: res.UpdateGrupo}))
        },
      })
    },
    Reset () {
      this.Id = null
      this.Nombre = null
    },
    LoadUi (Grupos) {
      if( Grupos.length === 0 ) {
        this.Id = null
      }

      for (let i=0; i<Grupos.length; i++) {
        if ( this.Nombre === Grupos[i].Nombre ) {
          this.Id = Grupos[i].Id
          this.Nombre = Grupos[i].Nombre
          break
        }else{
          this.Id = null
        }
      }
    }
  }
};


</script>

<style lang="stylus" scoped>
h5.bold
  font-weight bold

.alert-especial
  position absolute

</style>
