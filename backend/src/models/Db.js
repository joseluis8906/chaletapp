import Path from 'path';
import Sequelize from 'sequelize';

//var db = Path.resolve(__dirname, '../../db/Db.sqlite');
//const Db = new Sequelize(`sqlite://${db}`);

const Db = new Sequelize('unixjs02', 'unixjs', 'K3J9 8LMN 02F3 B3LW', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

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


//Escenario
const Escenario = Db.define('Escenario', {
  Id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  Nombre: Sequelize.STRING,
  Imagen: Sequelize.STRING,
  Esp1: Sequelize.STRING,
  Esp2: Sequelize.STRING,
  //Esp3: Sequelize.STRING,
  PrecioDiurno: Sequelize.DECIMAL,
  PrecioNocturno: Sequelize.DECIMAL,
  Likes: Sequelize.INTEGER,
  Activo: Sequelize.STRING
},
{
  timestamps: false,
  freezeTableName: true
});


//Cuenta
const Cuenta = Db.define('Cuenta', {
  Id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  UsuarioId: {type: Sequelize.INTEGER, references: {model: Usuario, key: 'Id'}},
  Saldo: Sequelize.DECIMAL
},
{
  timestamps: false,
  freezeTableName: true
});

Cuenta.belongsTo(Usuario);
Usuario.hasOne(Cuenta);


//Historial
const Historial = Db.define('Historial', {
  Id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  UsuarioId: {type: Sequelize.INTEGER, references: {model: Usuario, key: 'Id'}},
  Monto: Sequelize.DECIMAL,
  Tipo: Sequelize.STRING,
  Fecha: Sequelize.DATEONLY,
  Hora: Sequelize.TIME
},
{
  timestamps: false,
  freezeTableName: true
});

Historial.belongsTo(Usuario);
Usuario.hasMany(Historial);


//Compra
const Compra = Db.define('Compra', {
  Id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  UsuarioId: {type: Sequelize.INTEGER, references: {model: Usuario, key: 'Id'}},
  EscenarioId: {type: Sequelize.INTEGER, references: {model: Escenario, key: 'Id'}},
  HoraInicial: Sequelize.TIME,
  HoraFinal: Sequelize.TIME,
  Tiempo: Sequelize.INTEGER,
  Precio: Sequelize.DECIMAL,
  Estado: Sequelize.STRING,
  Fecha: Sequelize.DATEONLY,
  Expedicion: Sequelize.DATEONLY,
  Hora: Sequelize.TIME,
},
{
  timestamps: false,
  freezeTableName: true
});

Compra.belongsTo(Usuario);
Usuario.hasMany(Compra);

Compra.belongsTo(Escenario);
Escenario.hasMany(Compra);


//open connection
Db.authenticate().then(() => {
  console.log('Db conection success');
  /*Db.query("PRAGMA foreign_keys=ON").spread( (Result, Metadata) => {
    Db.query("PRAGMA foreign_keys").spread( (Result, Metadata) => {
      console.log(Result);
    });
  });*/
}).catch(Err => {
  console.log('Db conection failed');
});


export default Db;
