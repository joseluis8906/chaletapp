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

  v-snackbar( :timeout="$store.state.notificaciones.Timeout"
              :success="$store.state.notificaciones.Context === 'success'"
              :info="$store.state.notificaciones.Context === 'info'"
              :warning="$store.state.notificaciones.Context === 'warning'"
              :error="$store.state.notificaciones.Context === 'error'"
              :primary="$store.state.notificaciones.Context === 'primary'"
              :secondary="$store.state.notificaciones.Context === 'secondary'"
              :multi-line="$store.state.notificaciones.Mode === 'multi-line'"
              :vertical="$store.state.notificaciones.Mode === 'vertical'"
              :top="true"
              v-model="$store.state.notificaciones.State" )
      h6(class="grey--text text--lighten-4 mb-0") {{ $store.state.notificaciones.Msg }}
      v-icon {{ $store.state.notificaciones.Icon }}

  v-flex( xs12 mt-3 md8 lg6 )
    v-card
      v-layout(row wrap pt-3 light-blue)
        v-flex( xs12 )
          h5(class="grey--text text--lighten-4 text-xs-center bold")
            v-icon(ma) person
            |  Usuario
      v-card-text
        v-layout( row wrap)
          v-flex( xs12 )
            //- v-text-field( label="Nombre De Usuario" v-model="UserName" dark )

            v-text-field( label="Cedula" v-model="Cedula" :rules="[rules.required]" dark )

            v-text-field( label="Contraseña" v-model="UiPassword" type="Password" maxlength="4" dark )

            v-text-field( label="Nombre" v-model="Nombre" :rules="[rules.required]" dark )

            v-text-field( label="Apellido" v-model="Apellido" :rules="[rules.required]" dark )

            v-text-field(type="number" label="Edad" v-model="Edad" :rules="[rules.required]" dark )

            v-text-field(label="Telefono" v-model="Telefono" :rules="[rules.required]" dark )

            v-text-field(label="Email" v-model="Email" :rules="[rules.required, rules.email]" dark )

            v-text-field( label="Direccion" v-model="Direccion" :rules="[rules.required]" dark )

            v-select( v-bind:items="ItemsActivo"
                      v-model="Activo"
                      label="Activo"
                      item-value="text"
                      :rules="[rules.required]"
                      dark )

            v-select( label="Grupos"
                      v-bind:items="ItemsGrupo"
                      v-model="SelectedGrupos"
                      item-text="Nombre"
                      item-value="Id"
                      multiple
                      chips
                      hint="Roles Seleccionados"
                      persistent-hint
                      return-object
                      class="select-special"
                      :disabled="DisableGrupoSelect")

            //- v-text-field( label="Msg" v-model="Msg" @keypress.native.enter="PubMsg" dark )

      v-card-actions
        v-spacer
        v-btn( dark @click.native="Reset" ) Cancelar
        v-btn( dark primary @click.native="CryptPassword" :disabled="!Completo" ) Guardar
</template>

<script>

import USUARIOS from '~/queries/Usuarios.gql'
import CREATE_USUARIO from '~/queries/CreateUsuario.gql'
import UPDATE_USUARIO from '~/queries/UpdateUsuario.gql'
import GRUPOS from '~/queries/Grupos.gql'
import USUARIO_ADD_GRUPO from '~/queries/UsuarioAddGrupo.gql'
import USUARIO_REMOVE_GRUPO from '~/queries/UsuarioRemoveGrupo.gql'

import axios from 'axios'

export default {
  data: () => ({
    snackbar: {
      context: 'secondary',
      mode: '',
      timeout: 6000,
      text: 'Cargando'
    },
    Id: null,
    //UserName: null,
    Password: null,
    Cedula: null,
    Nombre: null,
    Apellido: null,
    Edad: null,
    Telefono: null,
    Email: null,
    Direccion: null,
    Activo: null,
    Msg: null,
    UiPassword: null,
    SelectedGrupos: [],
    OldSelectedGrupos: [],
    SelectedGruposForUi: false,
    DisableGrupoSelect: true,
    ItemsActivo: [
      {text: 'Si'},
      {text: 'No'}
    ],
    ItemsGrupo: [],
    loading: 0,
    Completo: false,
    rules: {
      required: (value) => !!value || 'Obligatorio.',
      email: (value) => {
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Correo Inválido.'
      }
    }
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
    Usuarios: {
      query: USUARIOS,
      variables () {
        return {
          //UserName: this.UserName
          Cedula: this.Cedula
        }
      },
      loadingKey: 'loading',
      update (data) {
        this.LoadUi(data.Usuarios)
      }
    },
    Grupos: {
      query: GRUPOS,
      loadingKey: 'loading',
      update (data) {
        this.ItemsGrupo = data.Grupos
      }
    }
  },
  watch: {
    SelectedGrupos () {
      this.CheckGrupos()
    },
    Id (value) {
      (value === null) ? this.DisableGrupoSelect = true : this.DisableGrupoSelect = false
    },
    Cedula () {
      this.Validar()
    },
    Password () {
      this.Validar()
    },
    Nombre () {
      this.Validar()
    },
    Apellido () {
      this.Validar()
    },
    Edad () {
      this.Validar()
    },
    Telefono () {
      this.Validar()
    },
    Email () {
      this.Validar()
    },
    Direccion () {
      this.Validar()
    },
    Activo () {
      this.Validar()
    },
  },
  mqtt: {
    'chaletapp/apollo/mutation': function (val) {
      console.log('mqtt usuario')
      var res = (JSON.parse(val))
      var Method = res.Method
      var Obj = res.Obj

      switch (Method) {
        case 'StoreUsuario':
          this.StoreUsuario(Obj)
          break;
      }

    }
  },
  methods: {
    Validar () {
      if(
        this.Cedula !== null && this.Cedula !== '' &&
        this.Nombre !== null && this.Nombre !== '' &&
        this.Apellido !== null && this.Apellido !== '' &&
        this.Edad !== null && this.Edad !== '' &&
        this.Telefono !== null && this.Telefono !== '' &&
        this.Email !== null && this.Email !== '' &&
        this.Direccion !== null && this.Direccion !== '' &&
        this.Activo !== null && this.Activo !== ''
      ){
        this.Completo = true
      }else {
        this.Completo = false
      }


    },
    /*PubMsg () {
      //console.log('enviando: ' + this.Msg)
      this.$mqtt.publish('chaletapp/apollo/mutation', this.Msg)
    },*/
    StoreUsuario (Usuario) {
      var store = this.$apollo.provider.defaultClient

      try {
        var data = store.readQuery({
          query: USUARIOS,
          variables: {
            //UserName: Usuario.UserName
            Cedula: Usuario.Cedula
          }
        })

        var Existe = false

        for (let i=0; i<data.Usuarios.length; i++) {
          if (data.Usuarios[i].Id === Usuario.Id) {
            Existe = true
            data.Usuarios[i] = Usuario
          }
        }

        (!Existe) ? data.Usuarios.push(Usuario) : null;

        store.writeQuery({
          query: USUARIOS,
          variables: {
            //UserName: Usuario.UserName
            Cedula: Usuario.Cedula
          },
          data: data
        })

      } catch (Err) {

        var data = {Usuarios: []}

        data.Usuarios.push(Usuario)

        store.writeQuery({
          query: USUARIOS,
          variables: {
            //UserName: Usuario.UserName
            Cedula: Usuario.Cedaula
          },
          data: data
        })

      }

    },
    CheckGrupos () {
      if(this.Id !== null) {
        if(!this.SelectedGruposForUi) {
          if (this.SelectedGrupos.length > this.OldSelectedGrupos.length) {
            //console.log('Nuevo Rol')
            const UsuarioAddGrupo = {
              UsuarioId: this.Id,
              GrupoId: this.SelectedGrupos[this.SelectedGrupos.length-1].Id
            };

            this.$apollo.mutate ({
              mutation: USUARIO_ADD_GRUPO,
              variables: {
                UsuarioId: UsuarioAddGrupo.UsuarioId,
                GrupoId: UsuarioAddGrupo.GrupoId
              },
              loadingKey: 'loading',
              update: (store, { data: res }) => {
                //console.log(res)
                this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreUsuario', Obj: res.UsuarioAddGrupo}))
              }
            }).then(() => {
              this.$store.commit('notificaciones/changeContext', 'success')
              this.$store.commit('notificaciones/changeIcon', 'done_all')
              this.$store.commit('notificaciones/changeMsg', 'Guardado Exitoso')
              this.$store.commit('notificaciones/changeState', 1)
            }).catch(() => {
              this.$store.commit('notificaciones/changeContext', 'error')
              this.$store.commit('notificaciones/changeIcon', 'error_outline')
              this.$store.commit('notificaciones/changeMsg', 'Error Guardando')
              this.$store.commit('notificaciones/changeState', 1)
            })

            this.OldSelectedGrupos = this.SelectedGrupos
          }
          else if (this.SelectedGrupos.length < this.OldSelectedGrupos.length) {
            //console.log('Rol Eliminado')
            for(let i=0; i<this.OldSelectedGrupos.length; i++){
              if(this.SelectedGrupos.indexOf(this.OldSelectedGrupos[i]) === -1){

                const UsuarioRemoveGrupo = {
                  UsuarioId: this.Id,
                  GrupoId: this.OldSelectedGrupos[i].Id
                };

                this.$apollo.mutate ({
                  mutation: USUARIO_REMOVE_GRUPO,
                  variables: {
                    UsuarioId: UsuarioRemoveGrupo.UsuarioId,
                    GrupoId: UsuarioRemoveGrupo.GrupoId
                  },
                  loadingKey: 'loading',
                  update: (store, { data: res }) => {
                    this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreUsuario', Obj: res.UsuarioRemoveGrupo}))
                  }
                }).then(() => {
                  this.$store.commit('notificaciones/changeContext', 'success')
                  this.$store.commit('notificaciones/changeIcon', 'done_all')
                  this.$store.commit('notificaciones/changeMsg', 'Guardado Exitoso')
                  this.$store.commit('notificaciones/changeState', 1)
                }).catch(() => {
                  this.$store.commit('notificaciones/changeContext', 'error')
                  this.$store.commit('notificaciones/changeIcon', 'error_outline')
                  this.$store.commit('notificaciones/changeMsg', 'Error Guardando')
                  this.$store.commit('notificaciones/changeState', 1)
                })

                break
              }
            }

            this.OldSelectedGrupos = this.SelectedGrupos
          }
        }
        this.SelectedGruposForUi = false
      }
    },
    CryptPassword (){
      if (this.UiPassword !== null && this.UiPassword !== '') {
        axios.get(`/backend/generatepassword/${this.UiPassword}`).then(res => {
          this.Password = res.data.Password
          this.CreateOrUpdate()
        }).catch(err => {
          console.log(err)
        });
      } else {
        this.CreateOrUpdate()
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
      const Usuario = {
        //UserName: this.UserName,
        UserName: this.Cedula,
        Password: this.Password,
        Cedula: this.Cedula,
        Nombre: this.Nombre,
        Apellido: this.Apellido,
        Edad: this.Edad,
        Telefono: this.Telefono,
        Email: this.Email,
        Direccion: this.Direccion,
        Activo: this.Activo,
      };

      this.Reset ();

      this.$apollo.mutate ({
        mutation: CREATE_USUARIO,
        variables: {
          UserName: Usuario.UserName,
          Password: Usuario.Password,
          Cedula: Usuario.Cedula,
          Nombre: Usuario.Nombre,
          Apellido: Usuario.Apellido,
          Edad: Usuario.Edad,
          Telefono: Usuario.Telefono,
          Email: Usuario.Email,
          Direccion: Usuario.Direccion,
          Activo: Usuario.Activo
        },
        loadingKey: 'loading',
        update: (store, { data: res }) => {
          this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreUsuario', Obj: res.CreateUsuario}))
        }
      }).then(() => {
        this.$store.commit('notificaciones/changeContext', 'success')
        this.$store.commit('notificaciones/changeIcon', 'done_all')
        this.$store.commit('notificaciones/changeMsg', 'Guardado Exitoso')
        this.$store.commit('notificaciones/changeState', 1)
      }).catch(() => {
        this.$store.commit('notificaciones/changeContext', 'error')
        this.$store.commit('notificaciones/changeIcon', 'error_outline')
        this.$store.commit('notificaciones/changeMsg', 'Error Guardando')
        this.$store.commit('notificaciones/changeState', 1)
      })

    },
    Update () {
      //console.log(this.Password)
      const Usuario = {
        Id: this.Id,
        UserName: this.Cedula,
        Password: this.Password,
        Cedula: this.Cedula,
        Nombre: this.Nombre,
        Apellido: this.Apellido,
        Edad: this.Edad,
        Telefono: this.Telefono,
        Email: this.Email,
        Direccion: this.Direccion,
        Activo: this.Activo,
      };

      this.Reset ();

      this.$apollo.mutate ({
        mutation: UPDATE_USUARIO,
        variables: {
          Id: Usuario.Id,
          UserName: Usuario.UserName,
          Password: Usuario.Password,
          Cedula: Usuario.Cedula,
          Nombre: Usuario.Nombre,
          Apellido: Usuario.Apellido,
          Edad: Usuario.Edad,
          Telefono: Usuario.Telefono,
          Email: Usuario.Email,
          Direccion: Usuario.Direccion,
          Activo: Usuario.Activo
        },
        loadingKey: 'loading',
        update: (store, { data: res }) => {
          //console.log(JSON.stringify(res))
          this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreUsuario', Obj: res.UpdateUsuario}))
        },
      }).then(() => {
        this.$store.commit('notificaciones/changeContext', 'success')
        this.$store.commit('notificaciones/changeIcon', 'done_all')
        this.$store.commit('notificaciones/changeMsg', 'Actualización Exitosa')
        this.$store.commit('notificaciones/changeState', 1)
      }).catch(() => {
        this.$store.commit('notificaciones/changeContext', 'error')
        this.$store.commit('notificaciones/changeIcon', 'error_outline')
        this.$store.commit('notificaciones/changeMsg', 'Error de Actualización')
        this.$store.commit('notificaciones/changeState', 1)
      })
    },
    Reset () {
      this.Id = null
      this.UserName = null
      this.Password = null
      this.Cedula = null
      this.Nombre = null
      this.Apellido = null
      this.Edad = null
      this.Telefono = null
      this.Email = null
      this.Direccion = null
      this.UiPassword = null
      this.Activo = null
      this.SelectedGrupos = []
    },
    LoadUi (Usuarios) {
      if( Usuarios.length === 0 ) {
        this.Id = null
        this.UserName = null
        this.Password = null
        this.UiPassword = null
        //this.Cedula = null
        this.Nombre = null
        this.Apellido = null
        this.Edad = null
        this.Telefono = null
        this.Email = null
        this.Direccion = null
        this.Activo = null
        this.SelectedGrupos = []
        this.OldSelectedGrupos = []
      }

      for (let i=0; i<Usuarios.length; i++) {
        if ( /*this.UserName === Usuarios[i].UserName*/ this.Cedula === Usuarios[i].Cedula ) {
          this.Id = Usuarios[i].Id
          this.UserName = Usuarios[i].UserName
          this.Password = Usuarios[i].Password
          //this.Cedula = Usuarios[i].Cedula
          this.Nombre = Usuarios[i].Nombre
          this.Apellido = Usuarios[i].Apellido
          this.Edad = Usuarios[i].Edad
          this.Telefono = Usuarios[i].Telefono
          this.Email = Usuarios[i].Email
          this.Direccion = Usuarios[i].Direccion
          this.Activo = Usuarios[i].Activo
          this.SelectedGruposForUi = true
          this.SelectedGrupos = Usuarios[i].Grupos
          this.OldSelectedGrupos = Usuarios[i].Grupos
          break
        }else{
          this.Id = null
          this.Password = null
          this.UiPassword = null
          this.Cedula = null
          this.Nombre = null
          this.Apellido = null
          this.Edad = null
          this.Telefono = null
          this.Email = null
          this.Direccion = null
          this.Activo = null
          this.SelectedGrupos = []
          this.OldSelectedGrupos = []
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
