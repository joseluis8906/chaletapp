import { GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLSchema } from 'graphql';

import Db from './Db.js';

var Usuario = new GraphQLObjectType({
  name: "Usuario",
  description: "Object representation of Usuario",
  fields: () => {
    return {
      Id: {
        type: GraphQLInt,
        resolve(Usuario) {
          return Usuario.Id;
        }
      },
      UserName: {
        type: GraphQLString,
        resolve(Usuario) {
          return Usuario.UserName;
        }
      },
      Password: {
        type: GraphQLString,
        resolve(Usuario) {
          return Usuario.Password;
        }
      },
      Cedula: {
        type: GraphQLString,
        resolve(Usuario) {
          return Usuario.Cedula;
        }
      },
      Nombre: {
        type: GraphQLString,
        resolve(Usuario) {
          return Usuario.Nombre;
        }
      },
      Apellido: {
        type: GraphQLString,
        resolve(Usuario) {
          return Usuario.Apellido;
        }
      },
      Edad: {
        type: GraphQLInt,
        resolve(Usuario) {
          return Usuario.Edad;
        }
      },
      Telefono: {
        type: GraphQLString,
        resolve(Usuario) {
          return Usuario.Telefono;
        }
      },
      Email: {
        type: GraphQLString,
        resolve(Usuario) {
          return Usuario.Email;
        }
      },
      Apellido: {
        type: GraphQLString,
        resolve(Usuario) {
          return Usuario.Apellido;
        }
      },
      Direccion: {
        type: GraphQLString,
        resolve(Usuario) {
          return Usuario.Direccion;
        }
      },
      Activo: {
        type: GraphQLString,
        resolve(Usuario) {
          return Usuario.Activo;
        }
      },
      Grupos: {
        type: new GraphQLList(Grupo),
        resolve(Usuario) {
          return Usuario.getGrupos();
        }
      }
    };
  }
});


var Grupo = new GraphQLObjectType({
  name: "Grupo",
  description: "Object representation of Grupo",
  fields: () => {
    return {
      Id: {
        type: GraphQLInt,
        resolve(Grupo) {
          return Grupo.Id;
        }
      },
      Nombre: {
        type: GraphQLString,
        resolve(Grupo) {
          return Grupo.Nombre;
        }
      },
      Usuarios: {
        type: new GraphQLList(Usuario),
        resolve(Grupo) {
          return Grupo.getUsuarios();
        }
      }
    };
  }
});


var Escenario = new GraphQLObjectType({
  name: "Escenario",
  description: "Object representation of Escenario",
  fields: () => {
    return {
      Id: {
        type: GraphQLInt,
        resolve(Escenario) {
          return Escenario.Id;
        }
      },
      Nombre: {
        type: GraphQLString,
        resolve(Escenario) {
          return Escenario.Nombre;
        }
      },
      Imagen: {
        type: GraphQLString,
        resolve(Escenario) {
          return Escenario.Imagen;
        }
      },
      Esp1: {
        type: GraphQLString,
        resolve(Escenario) {
          return Escenario.Esp1;
        }
      },
      Esp2: {
        type: GraphQLString,
        resolve(Escenario) {
          return Escenario.Esp2;
        }
      },
      /*Esp3: {
        type: GraphQLString,
        resolve(Escenario) {
          return Escenario.Esp3;
        }
      },*/
      PrecioDiurno: {
        type: GraphQLFloat,
        resolve(Escenario) {
          return Escenario.PrecioDiurno;
        }
      },
      PrecioNocturno: {
        type: GraphQLFloat,
        resolve(Escenario) {
          return Escenario.PrecioNocturno;
        }
      },
      Likes: {
        type: GraphQLInt,
        resolve(Escenario) {
          return Escenario.Likes;
        }
      },
      Activo: {
        type: GraphQLString,
        resolve(Escenario) {
          return Escenario.Activo;
        }
      },
    };
  }
});


var Cuenta = new GraphQLObjectType({
  name: "Cuenta",
  description: "Object representation of Cuenta",
  fields: () => {
    return {
      Id: {
        type: GraphQLInt,
        resolve(Cuenta) {
          return Cuenta.Id;
        }
      },
      UsuarioId: {
        type: GraphQLInt,
        resolve(Cuenta) {
          return Cuenta.UsuarioId;
        }
      },
      Saldo: {
        type: GraphQLFloat,
        resolve(Cuenta) {
          return Cuenta.Saldo;
        }
      }
    }
  }
})


var Compra = new GraphQLObjectType({
  name: "Compra",
  description: "Object representation of Compra",
  fields: () => {
    return {
      Id: {
        type: GraphQLInt,
        resolve(Compra) {
          return Compra.Id;
        }
      },
      UsuarioId: {
        type: GraphQLInt,
        resolve(Compra) {
          return Compra.UsuarioId;
        }
      },
      EscenarioId: {
        type: GraphQLInt,
        resolve(Compra) {
          return Compra.EscenarioId;
        }
      },
      HoraInicial: {
        type: GraphQLString,
        resolve(Compra) {
          return Compra.HoraInicial;
        }
      },
      HoraFinal: {
        type: GraphQLString,
        resolve(Compra) {
          return Compra.HoraFinal;
        }
      },
      Tiempo: {
        type: GraphQLInt,
        resolve(Compra) {
          return Compra.Tiempo;
        }
      },
      Abono: {
        type: GraphQLFloat,
        resolve(Compra) {
          return Compra.Abono;
        }
      },
      Saldo: {
        type: GraphQLFloat,
        resolve(Compra) {
          return Compra.Saldo;
        }
      },
      Estado: {
        type: GraphQLString,
        resolve(Compra) {
          return Compra.Estado;
        }
      },
      Fecha: {
        type: GraphQLString,
        resolve(Compra) {
          return Compra.Fecha;
        }
      },
      Expedicion: {
        type: GraphQLString,
        resolve(Compra) {
          return Compra.Expedicion;
        }
      },
      Hora: {
        type: GraphQLString,
        resolve(Compra) {
          return Compra.Hora;
        }
      },
      Usuario: {
        type: Usuario,
        resolve(Compra) {
          return Compra.getUsuario();
        }
      },
      Escenario: {
        type: Escenario,
        resolve(Compra) {
          return Compra.getEscenario();
        }
      }
    }
  }
})



//Query
var Query = new GraphQLObjectType({
  name: "Query",
  description: "Object representation of Query",
  fields: () => {
    return {
      Hello: {
        type: GraphQLString,
        args: {},
        resolve(root, args) {
          return "world";
        }
      },
      Usuarios: {
        type: new GraphQLList(Usuario),
        args: {
          Id: {type: GraphQLInt},
          UserName: {type: GraphQLString},
          Password: {type: GraphQLString},
          Cedula: {type: GraphQLString},
          Nombre: {type: GraphQLString},
          Apellido: {type: GraphQLString},
          Edad: {type: GraphQLInt},
          Telefono: {type: GraphQLString},
          Email: {type: GraphQLString},
          Direccion: {type: GraphQLString},
          Activo: {type: GraphQLString}
        },
        resolve(root, args) {
          return Db.models.Usuario.findAll({where: args});
        }
      },
      Grupos: {
        type: new GraphQLList(Grupo),
        args: {
          Id: {type: GraphQLInt},
          Nombre: {type: GraphQLString}
        },
        resolve(root, args) {
          return Db.models.Grupo.findAll({where: args});
        }
      },
      Escenarios: {
        type: new GraphQLList(Escenario),
        args: {
          Id: {type: GraphQLInt},
          Nombre: {type: GraphQLString},
          Imagen: {type: GraphQLString},
          Esp1: {type: GraphQLString},
          Esp2: {type: GraphQLString},
          //Esp3: {type: GraphQLString},
          PrecioDiurno: {type: GraphQLFloat},
          PrecioNocturno: {type: GraphQLFloat},
          Likes: {type: GraphQLInt},
          Activo: {type: GraphQLString}
        },
        resolve(root, args) {
          return Db.models.Escenario.findAll({where: args, order: [['Id', 'ASC']]});
        }
      },
      Cuentas: {
        type: new GraphQLList(Cuenta),
        args: {
          Id: {type: GraphQLInt},
          UsuarioId: {type: GraphQLInt},
          Saldo: {type: GraphQLFloat}
        },
        resolve(root, args) {
          return Db.models.Cuenta.findAll({where: args});
        }
      },
      Compras: {
        type: new GraphQLList(Compra),
        args: {
          Id: {type: GraphQLInt},
          UsuarioId: {type: GraphQLInt},
          EscenarioId: {type: GraphQLInt},
          HoraInicial: {type: GraphQLString},
          HoraFinal: {type: GraphQLString},
          Tiempo: {type: GraphQLInt},
          Abono: {type: GraphQLFloat},
          Saldo: {type: GraphQLFloat},
          Estado: {type: GraphQLString},
          Fecha: {type: GraphQLString},
          Expedicion: {type: GraphQLString},
          Hora: {type: GraphQLString}
        },
        resolve(root, args) {
          return Db.models.Compra.findAll({where: args, order: [['Expedicion', 'ASC'], ['Hora', 'ASC']]});
        }
      }
    };
  }
});


//mutation
var Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Function to create stuff",
  fields: () => {
    return {
      CreateUsuario: {
        type: Usuario,
        args: {
          UserName: {type: GraphQLString},
          Password: {type: GraphQLString},
          Cedula: {type: GraphQLString},
          Nombre: {type: GraphQLString},
          Apellido: {type: GraphQLString},
          Edad: {type: GraphQLInt},
          Telefono: {type: GraphQLString},
          Email: {type: GraphQLString},
          Direccion: {type: GraphQLString},
          Activo: {type: GraphQLString}
        },
        resolve(_, args) {
          return Db.models.Usuario.create({
            UserName: args.UserName,
            Password: args.Password,
            Cedula: args.Cedula,
            Nombre: args.Nombre,
            Apellido: args.Apellido,
            Edad: args.Edad,
            Telefono: args.Telefono,
            Email: args.Email,
            Direccion: args.Direccion,
            Activo: args.Activo
          });
        }
      },
      UpdateUsuario: {
        type: Usuario,
        args: {
          Id: {type: GraphQLInt},
          UserName: {type: GraphQLString},
          Password: {type: GraphQLString},
          Cedula: {type: GraphQLString},
          Nombre: {type: GraphQLString},
          Apellido: {type: GraphQLString},
          Edad: {type: GraphQLInt},
          Telefono: {type: GraphQLString},
          Email: {type: GraphQLString},
          Direccion: {type: GraphQLString},
          Activo: {type: GraphQLString}
        },
        resolve(_, args) {
          return Db.models.Usuario.findOne({
            where: {Id: args.Id}
          }).then( R => {
            args.Password !== undefined ? R.Password = args.Password : R.Password
            args.Cedula !== undefined ? R.Cedula = args.Cedula : R.Cedula
            args.Nombre !== undefined ? R.Nombre = args.Nombre : R.Nombre
            args.Apellido !== undefined ? R.Apellido = args.Apellido : R.Apellido
            args.Edad !== undefined ? R.Edad = args.Edad : R.Edad
            args.Telefono !== undefined ? R.Telefono = args.Telefono : R.Telefono
            args.Email !== undefined ? R.Email = args.Email : R.Email
            args.Direccion !== undefined ? R.Direccion = args.Direccion : R.Direccion
            args.Activo !== undefined ? R.Activo = args.Activo : R.Activo
            R.save()
            return R
          });
        }
      },
      CreateGrupo: {
        type: Grupo,
        args: {
          Nombre: {type: GraphQLString},
        },
        resolve(_, args) {
          return Db.models.Grupo.create({
            Nombre: args.Nombre
          });
        }
      },
      UpdateGrupo: {
        type: Grupo,
        args: {
          Id: {type: GraphQLInt},
          Nombre: {type: GraphQLString},
        },
        resolve(_, args) {
          return Db.models.Grupo.findOne({
            where: {Id: args.Id}
          }).then (R => {
            args.Nombre !== undefined ? R.Nombre = args.Nombre : R.Nombre
            R.save();
            return R;
          });
        }
      },
      UsuarioAddGrupo: {
        type: Usuario,
        args: {
          UsuarioId: {type: GraphQLInt},
          GrupoId: {type: GraphQLInt}
        },
        resolve(_, args) {
          return Db.models.Usuario.findOne({
            where: {Id: args.UsuarioId}
          }).then(U => {
            if (U !== null){
              return Db.models.Grupo.findOne({
                where: {Id: args.GrupoId}
              }).then(G => {
                if (G !== null) {
                  return U.addGrupo(G).then(R => {
                    return U;
                  })
                } else {
                  return U;
                }
              })
            } else {
              return U;
            }
          });
        }
      },
      UsuarioRemoveGrupo: {
        type: Usuario,
        args: {
          UsuarioId: {type: GraphQLInt},
          GrupoId: {type: GraphQLInt},
        },
        resolve(_, args) {
          return Db.models.Usuario.findOne({
            where: {Id: args.UsuarioId}
          }).then(U => {
            if (U !== null){
              return Db.models.Grupo.findOne({
                where: {Id: args.GrupoId}
              }).then(G => {
                if (G !== null) {
                  U.removeGrupo(G)
                }
                return U;
              })
            } else {
              return U;
            }
          });
        }
      },
      CreateEscenario: {
        type: Escenario,
        args: {
          Nombre: {type: GraphQLString},
          Imagen: {type: GraphQLString},
          Esp1: {type: GraphQLString},
          Esp2: {type: GraphQLString},
          //Esp3: {type: GraphQLString},
          PrecioDiurno: {type: GraphQLFloat},
          PrecioNocturno: {type: GraphQLFloat},
          Likes: {type: GraphQLInt},
          Activo: {type: GraphQLString}
        },
        resolve(_, args) {
          return Db.models.Escenario.create({
            Nombre: args.Nombre,
            Imagen: args.Imagen,
            Esp1: args.Esp1,
            Esp2: args.Esp2,
            //Esp3: args.Esp3,
            PrecioDiurno: args.PrecioDiurno,
            PrecioNocturno: args.PrecioNocturno,
            Likes: args.Likes,
            Activo: args.Activo
          });
        }
      },
      UpdateEscenario: {
        type: Escenario,
        args: {
          Id: {type: GraphQLInt},
          Nombre: {type: GraphQLString},
          Imagen: {type: GraphQLString},
          Esp1: {type: GraphQLString},
          Esp2: {type: GraphQLString},
          //Esp3: {type: GraphQLString},
          PrecioDiurno: {type: GraphQLFloat},
          PrecioNocturno: {type: GraphQLFloat},
          Likes: {type: GraphQLInt},
          Activo: {type: GraphQLString}
        },
        resolve(_, args) {
          return Db.models.Escenario.findOne({
            where: {Id: args.Id}
          }).then(R => {
            args.Nombre !== undefined ? R.Nombre = args.Nombre : R.Nombre
            args.Imagen !== undefined ? R.Imagen = args.Imagen : R.Imagen
            args.Esp1 !== undefined ? R.Esp1 = args.Esp1 : R.Esp1
            args.Esp2 !== undefined ? R.Esp2 = args.Esp2 : R.Esp2
            //R.Esp3 = args.Esp3
            args.PrecioDiurno !== undefined ? R.PrecioDiurno = args.PrecioDiurno : R.PrecioDiurno
            args.PrecioNocturno !== undefined ? R.PrecioNocturno = args.PrecioNocturno : R.PrecioNocturno
            args.Likes !== undefined ? R.Likes = args.Likes : R.Likes
            args.Activo !== undefined ? R.Activo = args.Activo : R.Activo
            R.save()
            return R;
          });
        }
      },
      CreateCuenta: {
        type: Cuenta,
        args: {
          UsuarioId: {type: GraphQLInt},
          Saldo: {type: GraphQLFloat}
        },
        resolve(_, args) {
          return Db.models.Cuenta.create({
            UsuarioId: args.UsuarioId,
            Saldo: args.Saldo
          });
        }
      },
      UpdateCuenta: {
        type: Cuenta,
        args: {
          Id: {type: GraphQLInt},
          UsuarioId: {type: GraphQLInt},
          Saldo: {type: GraphQLFloat}
        },
        resolve(_, args) {
          return Db.models.Cuenta.findOne({
            where: {UsuarioId: args.UsuarioId}
          }).then(R => {
            args.Saldo !== undefined ? R.Saldo = args.Saldo : R.Saldo
            R.save()
            return R;
          });
        }
      },
      CreateCompra: {
        type: Compra,
        args: {
          UsuarioId: {type: GraphQLInt},
          EscenarioId: {type: GraphQLInt},
          HoraInicial: {type: GraphQLString},
          HoraFinal: {type: GraphQLString},
          Tiempo: {type: GraphQLInt},
          Abono: {type: GraphQLFloat},
          Saldo: {type: GraphQLFloat},
          Estado: {type: GraphQLString},
          Fecha: {type: GraphQLString},
          Expedicion: {type: GraphQLString},
          Hora: {type: GraphQLString}
        },
        resolve(_, args) {
          return Db.models.Compra.create({
            UsuarioId: args.UsuarioId,
            EscenarioId: args.EscenarioId,
            HoraInicial: args.HoraInicial,
            HoraFinal: args.HoraFinal,
            Tiempo: args.Tiempo,
            Abono: args.Abono,
            Saldo: args.Saldo,
            Estado: args.Estado,
            Fecha: args.Fecha,
            Expedicion: args.Expedicion,
            Hora: args.Hora,
          });
        }
      },
      UpdateCompra: {
        type: Compra,
        args: {
          Id: {type: GraphQLInt},
          UsuarioId: {type: GraphQLInt},
          EscenarioId: {type: GraphQLInt},
          HoraInicial: {type: GraphQLString},
          HoraFinal: {type: GraphQLString},
          Tiempo: {type: GraphQLInt},
          Abono: {type: GraphQLFloat},
          Saldo: {type: GraphQLFloat},
          Estado: {type: GraphQLString},
          Fecha: {type: GraphQLString},
          Expedicion: {type: GraphQLString},
          Hora: {type: GraphQLString}
        },
        resolve(_, args) {
          return Db.models.Compra.findOne({
            where: {Id: args.Id}
          }).then(R => {
            args.UsuarioId !== undefined ? R.UsuarioId = args.UsuarioId : R.UsuarioId
            args.EscenarioId !== undefined ? R.EscenarioId = args.EscenarioId : R.EscenarioId
            args.HoraInicial !== undefined ? R.HoraInicial = args.HoraInicial : R.HoraInicial
            args.HoraFinal !== undefined ? R.HoraFinal = args.HoraFinal : R.HoraFinal
            args.Tiempo !== undefined ? R.Tiempo = args.Tiempo : R.Tiempo
            args.Abono !== undefined ? R.Abono = args.Abono : R.Abono
            args.Saldo !== undefined ? R.Saldo = args.Saldo : R.Saldo
            args.Estado !== undefined ? R.Estado = args.Estado : R.Estado
            args.Activo !== undefined ? R.Activo = args.Activo : R.Activo
            args.Fecha !== undefined ? R.Fecha = args.Fecha : R.Fecha
            args.Expedicion !== undefined ? R.Expedicion = args.Expedicion : R.Expedicion
            args.Hora !== undefined ? R.Hora = args.Hora : R.Hora
            R.save()
            return R;
          });
        }
      }
    };
  }
});


//schema
var Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
