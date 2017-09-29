/*basic and test*/
PRAGMA foreign_key=ON;
CREATE TABLE IF NOT EXISTS "Usuario" (
  "Id" INTEGER PRIMARY KEY,
  "UserName" TEXT UNIQUE,
  "Password" TEXT,
  "Cedula" TEXT UNIQUE,
  "Nombre" TEXT,
  "Apellido" TEXT,
  "Edad" INTEGER,
  "Telefono" TEXT,
  "Email" TEXT UNIQUE,
  "Direccion" TEXT,
  "Activo" TEXT
);

CREATE TABLE IF NOT EXISTS "Grupo" (
  "Id" INTEGER PRIMARY KEY,
  "Nombre" TEXT UNIQUE,
);

CREATE TABLE IF NOT EXISTS "UsuarioGrupo" (
  "UsuarioId" INTEGER REFERENCES "Usuario"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  "GrupoId" INTEGER REFERENCES "Grupo"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY("UsuarioId", "GrupoId")
);
