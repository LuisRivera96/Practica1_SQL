USE GVE;
LOAD DATA LOCAL INFILE '/home/luis-rivera/Escritorio/Archivos/LAB/Practica 1/GRAND_VIRUS_EPICENTER.csv'
INTO TABLE Temporal
FIELDS TERMINATED BY ';'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

/********************************************LLENAR MODELO*********************************************/
/*LLENAR HOSPITAL*/
INSERT INTO Hospital(Ubicacion, Nombre)
SELECT Direccion_Hospital, Nombre_Hospital FROM Temporal
WHERE Temporal.Nombre_Hospital != '' AND NOT EXISTS(SELECT Nombre FROM Hospital WHERE Hospital.Nombre = Temporal.Nombre_Hospital)
GROUP BY Temporal.Nombre_Hospital;


/*LLENAR TRATAMIENTO*/
INSERT INTO Tratamiento(Nivel_efectividad, Descripcion)
SELECT DISTINCT Efectividad, Tratamiento FROM Temporal
WHERE Tratamiento != "" AND NOT EXISTS(SELECT Descripcion FROM Tratamiento WHERE Tratamiento = Descripcion);

/*LLENAR UBICACION*/
INSERT INTO Ubicacion(Descripcion)
SELECT DISTINCT Ubicacion_Victima FROM Temporal
WHERE Ubicacion_Victima != "" AND NOT EXISTS(SELECT Descripcion FROM Ubicacion 
WHERE Ubicacion_Victima = Descripcion);

/*LLENAR ESTADO*/
INSERT INTO Estado(Descripcion)
SELECT DISTINCT Estado_Victima FROM Temporal
WHERE Estado_Victima != "" AND NOT EXISTS(SELECT Descripcion FROM Estado WHERE Estado_Victima = Descripcion);

/*LLENAR CONTACTO*/
INSERT INTO Contacto(Tipo)
SELECT DISTINCT Contacto_Fisico FROM Temporal
WHERE Contacto_Fisico != "" AND NOT EXISTS(SELECT Tipo FROM Contacto WHERE Contacto_Fisico = Tipo);

/*LLENAR ASOCIADO*/
INSERT INTO Asociado(Nombre, Apellido)
SELECT DISTINCT Nombre_Asociado, Apellido_Asociado FROM Temporal
WHERE Nombre_Asociado != "" AND Apellido_Asociado != "" 
AND NOT EXISTS(SELECT Nombre FROM Asociado WHERE Nombre_Asociado = Nombre AND Apellido_Asociado = Apellido);

/*LLENAR PACIENTE*/
INSERT INTO Paciente(Nombre,Apellido,Fecha_Sospecha,ID_Estado,Direccion)
SELECT DISTINCT Temporal.Nombre_Victima,Temporal.Apellido_Victima,Temporal.Fecha_Primera_Sospecha,
Estado.ID_Estado,Temporal.Direccion_Victima FROM Temporal
INNER JOIN Estado ON Temporal.Estado_Victima = Estado.Descripcion;

/*LLENAR VICTIMA*/
INSERT INTO Victima(Fecha_Confirmacion,Fecha_Muerte,ID_Hospital,ID_Paciente)
SELECT DISTINCT Temporal.Fecha_Confirmacion,Temporal.Fecha_Muerte,
Hospital.ID_Hospital,Paciente.ID_Paciente FROM Temporal
INNER JOIN Hospital ON Temporal.Nombre_Hospital = Hospital.Nombre
INNER JOIN Paciente ON Temporal.Nombre_Victima = Paciente.Nombre AND Temporal.Apellido_Victima = Paciente.Apellido;

/*LLENAR TRATAMIENTO_VICTIMA*/
INSERT INTO Tratamiento_Victima(Fecha_Inicio_Tratamiento,Fecha_Fin_Tratamiento,
Efectividad,ID_Tratamiento,ID_Victima)
SELECT DISTINCT Temporal.Fecha_Inicio_Tratamiento,Temporal.Fecha_Fin_Tratamiento,Temporal.Efectividad_Victima,
Tratamiento.ID_Tratamiento,Victima.ID_Victima FROM Temporal
INNER JOIN Tratamiento ON (Temporal.Tratamiento != "" AND Temporal.Tratamiento = Tratamiento.Descripcion) AND 
(Temporal.Efectividad != "" AND Temporal.Efectividad = Tratamiento.Nivel_efectividad)
INNER JOIN Victima ON (Temporal.Fecha_Confirmacion != '0000-00-00 00:00:00' AND 
Victima.Fecha_Confirmacion = Temporal.Fecha_Confirmacion ) 
AND  Victima.Fecha_Muerte = Temporal.Fecha_Muerte  AND Victima.ID_Paciente = 
(SELECT DISTINCT ID_Paciente FROM Paciente WHERE Paciente.Nombre = Temporal.Nombre_Victima AND 
Paciente.Apellido = Temporal.Apellido_Victima AND Paciente.Direccion = Temporal.Direccion_Victima);


/*LLENAR VICTIMA_UBICACION*/
INSERT INTO Victima_Ubicacion(Fecha_Llegada,Fecha_Retiro,ID_Victima,ID_Ubicacion)
SELECT DISTINCT Temporal.Fecha_Llegada,Temporal.Fecha_Retiro,Victima.ID_Victima,Ubicacion.ID_Ubicacion
FROM Temporal 
INNER JOIN Victima ON Victima.Fecha_Confirmacion = Temporal.Fecha_Confirmacion AND 
Victima.Fecha_Muerte = Temporal.Fecha_Muerte
INNER JOIN Ubicacion ON (Temporal.Ubicacion_Victima != "" AND 
Temporal.Fecha_Llegada != '0000-00-00 00:00:00' AND 
Temporal.Fecha_Retiro != '0000-00-00 00:00:00' AND
Temporal.Ubicacion_Victima = Ubicacion.Descripcion);

/*LLENAR PACIENTE_ASOCIADO*/
INSERT INTO Paciente_Asociado(Fecha_Conocio,ID_Paciente,ID_Asociado)
SELECT DISTINCT Temporal.Fecha_Conocio,Paciente.ID_Paciente,Asociado.ID_Asociado
FROM Temporal
INNER JOIN Paciente ON Temporal.Nombre_Victima = Paciente.Nombre AND 
Temporal.Apellido_Victima = Paciente.Apellido
INNER JOIN Asociado ON Temporal.Nombre_Asociado = Asociado.Nombre AND
Temporal.Apellido_Asociado = Asociado.Apellido;

/*LLENAR PACIENTE_ASOCIADO_CONTACTO*/
INSERT INTO Paciente_Asociado_Contacto(Fecha_Inicio,Fecha_Fin,ID_Paciente_Asociado,ID_Contacto)
SELECT DISTINCT Temporal.Fecha_Inicio_Contacto,Temporal.Fecha_Fin_Contacto,
Paciente_Asociado.ID_Paciente_Asociado,Contacto.ID_Contacto
FROM Temporal
INNER JOIN Paciente_Asociado ON Temporal.Fecha_Conocio = Paciente_Asociado.Fecha_Conocio
INNER JOIN Contacto ON Temporal.Contacto_Fisico = Contacto.Tipo;