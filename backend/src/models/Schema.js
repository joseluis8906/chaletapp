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
            R.Password = args.Password
            R.Cedula = args.Cedula
            R.Nombre = args.Nombre
            R.Apellido = args.Apellido
            R.Edad = args.Edad
            R.Telefono = args.Telefono
            R.Email = args.Email
            R.Direccion = args.Direccion
            R.Activo = args.Activo
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
            R.Nombre = args.Nombre;
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
