import Path from 'path';
import Sequelize from 'sequelize';

var db = Path.resolve(__dirname, '../../db/Db.sqlite');

const Db = new Sequelize(`sqlite://${db}`);

const Usuario = Db.define('Usuario', {
  Id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  UserName: {type: Sequelize.STRING, unique: true},
  Password: Sequelize.STRING,
  Cedula: {type: Sequelize.STRING, unique: true},
  Nombre: Sequelize.STRING,
  Apellido: Sequelize.STRING,
  Edad: Sequelize.INTEGER,
  Telefono: Sequelize.STRING,
  Email: Sequelize.STRING,
  Direccion: Sequelize.STRING,
  Activo: Sequelize.STRING
},
{
  timestamps: false,
  freezeTableName: true
});

const Grupo = Db.define('Grupo', {
  Id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  Nombre: {type: Sequelize.STRING, unique: true}
},
{
  timestamps: false,
  freezeTableName: true
});

const UsuariorGrupo = Db.define('UsuarioGrupo', {
  UsuarioId: {type: Sequelize.INTEGER, references: {model: Usuario, key: 'Id'}},
  GrupoId: {type: Sequelize.INTEGER, references: {model: Grupo, key: 'Id'}}
},
{
  timestamps: false,
  freezeTableName: true
});

Usuario.belongsToMany(Grupo, {through: 'UsuarioGrupo'});
Grupo.belongsToMany(Usuario, {through: 'UsuarioGrupo'});



//open connection
Db.authenticate().then(() => {
  console.log('Db conection success');
  Db.query("PRAGMA foreign_keys=ON").spread( (Result, Metadata) => {
    Db.query("PRAGMA foreign_keys").spread( (Result, Metadata) => {
      console.log(Result);
    });
  });
}).catch(Err => {
  console.log('Db conection failed');
});


export default Db;
