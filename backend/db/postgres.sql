CREATE TABLE IF NOT EXISTS "Usuario" (
  "Id" BIGSERIAL PRIMARY KEY,
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
  "Id" BIGSERIAL PRIMARY KEY,
  "Nombre" TEXT UNIQUE,
);

CREATE TABLE IF NOT EXISTS "UsuarioGrupo" (
  "UsuarioId" BIGINT REFERENCES "Usuario"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  "GrupoId" BIGINT REFERENCES "Grupo"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY("UsuarioId", "GrupoId")
);

CREATE TABLE IF NOT EXISTS "Escenario" (
  "Id" BIGSERIAL PRIMARY KEY,
  "Codigo" TEXT UNIQUE,
  "Nombre" TEXT,
  "Imagen" TEXT,
  "Precio" DECIMAL,
  "Activo" TEXT
);
