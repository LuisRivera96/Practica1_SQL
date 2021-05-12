CREATE DATABASE GVE;
USE GVE;
CREATE TABLE Hospital
(
ID_Hospital int auto_increment,
Ubicacion varchar(50) NOT NULL,
Nombre varchar(50) NOT NULL,
primary key(ID_Hospital)
);

CREATE TABLE Tratamiento
(
ID_Tratamiento int auto_increment,
Nivel_efectividad int NOT NULL,
Descripcion varchar(50) NOT NULL,
primary key(ID_Tratamiento)
);

CREATE TABLE Ubicacion
(
ID_Ubicacion int auto_increment,
Descripcion varchar(50) NOT NULL,
primary key(ID_Ubicacion)
);

CREATE TABLE Estado
(
ID_Estado int auto_increment,
Descripcion varchar(50) NOT NULL,
primary key(ID_Estado)
);

CREATE TABLE Contacto
(
ID_Contacto int auto_increment,
Tipo varchar(50) NOT NULL,
primary key(ID_Contacto)
);

CREATE TABLE Asociado
(
ID_Asociado int auto_increment,
Nombre varchar(50) NOT NULL,
Apellido varchar(50) NOT NULL,
primary key(ID_Asociado)
);

CREATE TABLE Paciente
(
ID_Paciente int auto_increment,
Nombre varchar(50) NOT NULL,
Apellido varchar(50) NOT NULL,
Fecha_Sospecha DATETIME NOT NULL,
Direccion varchar(50) NOT NULL,
ID_Estado int NOT NULL,
primary key(ID_Paciente),
foreign key(ID_Estado) references Estado(ID_Estado) on delete cascade on update cascade
);

CREATE TABLE Victima
(
ID_Victima int auto_increment,
Fecha_Confirmacion DATETIME NOT NULL,
Fecha_Muerte DATETIME,
ID_Hospital int NOT NULL,
ID_Paciente int NOT NULL,
primary key(ID_Victima),
foreign key(ID_Hospital) references Hospital(ID_Hospital) on delete cascade on update cascade,
foreign key(ID_Paciente) references Paciente(ID_Paciente) on delete cascade on update cascade
);

CREATE TABLE Tratamiento_Victima
(
ID_Tratamiento_Victima int auto_increment,
Fecha_Inicio_Tratamiento DATETIME,
Fecha_Fin_Tratamiento DATETIME,
Efectividad int,
ID_Tratamiento int,
ID_Victima int,
primary key(ID_Tratamiento_Victima),
foreign key(ID_Tratamiento) references Tratamiento(ID_Tratamiento) on delete cascade on update cascade,
foreign key(ID_Victima) references Victima(ID_Victima) on delete cascade on update cascade
);

CREATE TABLE Victima_Ubicacion
(
ID_Victima_Ubicacion int auto_increment,
Fecha_Llegada DATETIME,
Fecha_Retiro DATETIME,
ID_Victima int,
ID_Ubicacion int,
primary key(ID_Victima_Ubicacion),
foreign key(ID_Victima) references Victima(ID_Victima) on delete cascade on update cascade,
foreign key(ID_Ubicacion) references Ubicacion(ID_Ubicacion) on delete cascade on update cascade
);

CREATE TABLE Paciente_Asociado
(
ID_Paciente_Asociado int auto_increment,
Fecha_Conocio DATETIME,
ID_Paciente int,
ID_Asociado int,
primary key(ID_Paciente_Asociado),
foreign key(ID_Paciente) references Paciente(ID_Paciente) on delete cascade on update cascade,
foreign key(ID_Asociado) references Asociado(ID_Asociado) on delete cascade on update cascade
);

CREATE TABLE Paciente_Asociado_Contacto
(
ID_Paciente_Asociado_Contacto int auto_increment,
Fecha_Inicio DATETIME,
Fecha_Fin DATETIME,
ID_Paciente_Asociado int,
ID_Contacto int,
primary key(ID_Paciente_Asociado_Contacto),
foreign key(ID_Paciente_Asociado) references Paciente_Asociado(ID_Paciente_Asociado) on delete cascade on update cascade,
foreign key(ID_Contacto) references Contacto(ID_Contacto) on delete cascade on update cascade
);

CREATE TABLE Temporal
(
Nombre_Victima varchar(50) NOT NULL,
Apellido_Victima varchar(50) NOT NULL,
Direccion_Victima varchar(50) NOT NULL,
Fecha_Primera_Sospecha DATETIME NOT NULL,
Fecha_Confirmacion DATETIME NOT NULL,
Fecha_Muerte DATETIME,
Estado_Victima varchar(50) NOT NULL,
Nombre_Asociado varchar(50) NOT NULL,
Apellido_Asociado varchar(50) NOT NULL,
Fecha_Conocio DATETIME ,
Contacto_Fisico varchar(50) ,
Fecha_Inicio_Contacto DATETIME,
Fecha_Fin_Contacto DATETIME,
Nombre_Hospital varchar(50),
Direccion_Hospital varchar(50),
Ubicacion_Victima varchar(50),
Fecha_Llegada DATETIME,
Fecha_Retiro DATETIME,
Tratamiento varchar(50),
Efectividad int,
Fecha_Inicio_Tratamiento DATETIME,
Fecha_Fin_Tratamiento DATETIME,
Efectividad_Victima int
);