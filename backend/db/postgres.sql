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
  "Nombre" TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS "UsuarioGrupo" (
  "UsuarioId" BIGINT REFERENCES "Usuario"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  "GrupoId" BIGINT REFERENCES "Grupo"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY("UsuarioId", "GrupoId")
);

CREATE TABLE IF NOT EXISTS "Escenario" (
  "Id" BIGSERIAL PRIMARY KEY,
  "Nombre" TEXT UNIQUE,
  "Imagen" TEXT,
  "Esp1" TEXT,
  "Esp2" TEXT,
  "Esp3" TEXT,
  "PrecioDiurno" DECIMAL,
  "PrecioNocturno" DECIMAL,
  "Likes" INTEGER,
  "Activo" TEXT
);


CREATE TABLE IF NOT EXISTS "Cuenta" (
  "Id" BIGSERIAL PRIMARY KEY,
  "UsuarioId" BIGINT REFERENCES "Usuario"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  "Saldo" DECIMAL
);


CREATE TABLE IF NOT EXISTS "Historial" (
  "Id" BIGSERIAL PRIMARY KEY,
  "ClienteId" BIGINT REFERENCES "Usuario"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  "EmpleadoId" BIGINT REFERENCES "Usuario"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  "Monto" DECIMAL,
  "Tipo" TEXT,
  "Fecha" DATE,
  "Hora" TIME
);


CREATE TABLE IF NOT EXISTS "Compra" (
  "Id" BIGSERIAL PRIMARY KEY,
  "UsuarioId" BIGINT REFERENCES "Usuario"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  "EscenarioId" BIGINT REFERENCES "Escenario"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  "HoraInicial" TIME,
  "HoraFinal" TIME,
  "Tiempo" INTEGER,
  "Abono" DECIMAL,
  "Estado" TEXT,
  "Fecha" DATE,
  "Hora" TIME,
  "Expedicion" DATE,
  "Saldo" DECIMAL
);
