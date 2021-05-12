USE GVE;
/*CONSULTA 1*/
SELECT Hospital.Nombre,Hospital.Ubicacion,COUNT(V.Fecha_Muerte) AS Numero_Fallecidos
FROM  Hospital
INNER JOIN Victima V ON Hospital.ID_Hospital = V.ID_Hospital 
WHERE V.Fecha_Muerte !=  '0000-00-00 00:00:00'
GROUP BY Hospital.ID_Hospital
ORDER BY Numero_Fallecidos DESC;


/*CONSULTA 2*/
SELECT Nombre,Apellido,Tratamiento_Victima.Efectividad  FROM Paciente
INNER JOIN Victima ON Paciente.ID_Paciente = Victima.ID_Paciente
INNER JOIN Tratamiento_Victima ON Tratamiento_Victima.ID_Victima  = Victima.ID_Victima
WHERE Tratamiento_Victima.ID_Tratamiento = (SELECT Tratamiento.ID_Tratamiento FROM Tratamiento 
WHERE Tratamiento.Descripcion = 'Transfusiones de sangre')
AND Tratamiento_Victima.Efectividad > 5 AND Paciente.ID_Estado = (SELECT ID_Estado FROM 
Estado WHERE Descripcion = 'En cuarentena')
ORDER BY Tratamiento_Victima.Efectividad DESC;

/*CONSULTA 3*/
#PREGUNTAR SI MANEJAR FECHA
SELECT Nombre,Apellido,Direccion,COUNT(Paciente_Asociado.ID_Asociado) AS No_Asociados FROM Paciente
INNER JOIN Victima ON Victima.ID_Paciente = Paciente.ID_Paciente 
INNER JOIN Paciente_Asociado ON Paciente_Asociado.ID_Paciente = Victima.ID_Paciente 
AND Paciente_Asociado.ID_Paciente = Paciente.ID_Paciente
WHERE Victima.Fecha_Muerte != '0000-00-00 00:00:00'
GROUP BY Paciente_Asociado.ID_Paciente
HAVING 3 < COUNT(No_Asociados)
ORDER BY Paciente.ID_Paciente;
 
/*CONSULTA 4 5*/
SELECT Paciente.Nombre,Paciente.Apellido,COUNT(Paciente_Asociado.ID_Asociado) AS No_Asociados FROM Paciente
INNER JOIN Paciente_Asociado ON Paciente_Asociado.ID_Paciente = Paciente.ID_Paciente
INNER JOIN Paciente_Asociado_Contacto ON Paciente_Asociado_Contacto.ID_Paciente_Asociado = Paciente_Asociado.ID_Paciente_Asociado
WHERE Paciente.ID_Estado = (SELECT ID_Estado FROM Estado WHERE Descripcion = 'Sospecha')
AND Paciente_Asociado_Contacto.ID_Contacto = (SELECT ID_Contacto FROM Contacto WHERE Tipo = 'Beso')
GROUP BY Paciente_Asociado.ID_Paciente
HAVING 2 < COUNT(Paciente_Asociado.ID_Asociado);

/*CONSULTA 5 */
SELECT DISTINCT Paciente.Nombre,Paciente.Apellido,COUNT(Tratamiento_Victima.ID_Tratamiento) AS No_Tratamientos FROM Tratamiento_Victima
INNER JOIN Victima ON Tratamiento_Victima.ID_Victima = Victima.ID_Victima
INNER JOIN Paciente ON Victima.ID_Paciente = Paciente.ID_Paciente  
WHERE Tratamiento_Victima.ID_Tratamiento = (SELECT ID_Tratamiento FROM Tratamiento WHERE Descripcion = 'Oxigeno')
GROUP BY Paciente.ID_Paciente
ORDER BY No_Tratamientos DESC
LIMIT 5;

/*CONSULTA 6*/
SELECT Nombre,Apellido,Victima.Fecha_Muerte FROM Paciente
INNER JOIN Victima ON Victima.ID_Paciente = Paciente.ID_Paciente
INNER JOIN Victima_Ubicacion ON Victima_Ubicacion.ID_Victima = Victima.ID_Victima
INNER JOIN Tratamiento_Victima ON Tratamiento_Victima.ID_Victima = Victima.ID_Victima
WHERE Victima_Ubicacion.ID_Ubicacion = 
(SELECT ID_Ubicacion FROM Ubicacion WHERE Descripcion = '1987 Delphine Well') AND
Tratamiento_Victima.ID_Tratamiento = (SELECT ID_Tratamiento FROM Tratamiento WHERE Descripcion = 'Manejo de la presión arterial')
GROUP BY Fecha_Muerte;

/*CONSULTA 7(3)*/
SELECT Nombre,Apellido,Direccion,COUNT(Tratamiento_Victima.ID_Tratamiento) AS No_Tratamientos,
PA.No_Asociados
FROM Paciente
INNER JOIN Victima ON Victima.ID_Paciente = Paciente.ID_Paciente 
INNER JOIN Tratamiento_Victima ON Tratamiento_Victima.ID_Victima = Victima.ID_Victima,
(SELECT COUNT(Paciente_Asociado.ID_Asociado) AS No_Asociados, Paciente_Asociado.ID_Paciente AS CPA FROM Paciente_Asociado 
INNER JOIN Paciente ON Paciente.ID_Paciente = Paciente_Asociado.ID_Paciente
GROUP BY Paciente.ID_Paciente HAVING COUNT(Paciente_Asociado.ID_Asociado) < 2)  AS PA
WHERE PA.CPA = Paciente.ID_Paciente 
GROUP BY Paciente.Nombre,Paciente.Apellido
HAVING 2 = No_Tratamientos;



/*CONSULTA 8*/
(SELECT month(Fecha_Sospecha) AS Mes,Nombre,Apellido,COUNT(Tratamiento_Victima.ID_Tratamiento) AS No_Tratamientos FROM Tratamiento_Victima
INNER JOIN Victima ON Tratamiento_Victima.ID_Victima = Victima.ID_Victima
INNER JOIN Paciente ON Victima.ID_Paciente = Paciente.ID_Paciente  
GROUP BY Paciente.ID_Paciente
ORDER BY No_Tratamientos DESC
LIMIT 10)
UNION ALL
(SELECT month(Fecha_Sospecha) AS Mes,Nombre,Apellido,COUNT(Tratamiento_Victima.ID_Tratamiento) AS No_Tratamientos FROM Tratamiento_Victima
INNER JOIN Victima ON Tratamiento_Victima.ID_Victima = Victima.ID_Victima
INNER JOIN Paciente ON Victima.ID_Paciente = Paciente.ID_Paciente  
GROUP BY Paciente.ID_Paciente
ORDER BY No_Tratamientos ASC
LIMIT 10);

/*CONSULTA 9*/
SELECT Hospital.Nombre,COUNT(Victima.Fecha_Muerte) AS Numero_Fallecidos,
(COUNT(Fecha_Muerte)/ (SELECT COUNT(*)FROM Victima )) *100 AS Porcentaje_Victimas 
FROM Hospital 
INNER JOIN Victima  ON Hospital.ID_Hospital = Victima.ID_Hospital 
GROUP BY Hospital.ID_Hospital 
ORDER BY Porcentaje_Victimas DESC;

/*CONSULTA 10*/
#HOSPITAL,CONTACTO,PORCENTAJE
SELECT G.NHospital AS Nombre_Hospital,G.Tipo AS Tipo_Contacto,H.Porcentaje AS Porcentajes FROM
(SELECT DISTINCT T.NHospital,T.UHospital,T.Tipo,SUM(T.Total) AS Suma FROM
(SELECT DISTINCT Paciente.Nombre,Paciente.Apellido,Paciente.Direccion,Paciente.Fecha_Sospecha,
Hospital.Nombre AS NHospital,Hospital.Ubicacion AS UHospital,
Contacto.Tipo,COUNT(Contacto.Tipo) AS Total 
FROM Paciente
INNER JOIN Paciente_Asociado ON Paciente_Asociado.ID_Paciente = Paciente.ID_Paciente
INNER JOIN Paciente_Asociado_Contacto ON Paciente_Asociado_Contacto.ID_Paciente_Asociado = Paciente_Asociado.ID_Paciente_Asociado
INNER JOIN Contacto ON Contacto.ID_Contacto = Paciente_Asociado_Contacto.ID_Contacto
INNER JOIN Victima ON Victima.ID_Paciente = Paciente.ID_Paciente
INNER JOIN Hospital ON Hospital.ID_Hospital = Victima.ID_Hospital
GROUP BY Hospital.Nombre,Paciente.Apellido) AS T
GROUP BY T.NHospital,T.UHospital,T.Tipo) AS G,
(SELECT DISTINCT F.NHospital,F.UHospital,F.Tipo,MAX(F.Suma) AS Maximo,((MAX(F.Suma)/SUM(F.Suma))*100) AS Porcentaje FROM
(SELECT DISTINCT T.NHospital,T.UHospital,T.Tipo,SUM(T.Total) AS Suma FROM 
(SELECT Paciente.Nombre,Paciente.Apellido,Paciente.Direccion,Paciente.Fecha_Sospecha,
Hospital.Nombre AS NHospital,Hospital.Ubicacion AS UHospital,
Contacto.Tipo,COUNT(Contacto.Tipo) AS Total 
FROM Paciente
INNER JOIN Paciente_Asociado ON Paciente_Asociado.ID_Paciente = Paciente.ID_Paciente
INNER JOIN Paciente_Asociado_Contacto ON Paciente_Asociado_Contacto.ID_Paciente_Asociado = Paciente_Asociado.ID_Paciente_Asociado
INNER JOIN Contacto ON Contacto.ID_Contacto = Paciente_Asociado_Contacto.ID_Contacto
INNER JOIN Victima ON Victima.ID_Paciente = Paciente.ID_Paciente
INNER JOIN Hospital ON Hospital.ID_Hospital = Victima.ID_Hospital
GROUP BY Hospital.Nombre,Paciente.Apellido) AS T
GROUP BY T.NHospital,T.UHospital,T.Tipo)  AS F
GROUP BY F.NHospital,F.UHospital) AS H
WHERE G.NHospital = H.NHospital AND G.UHospital = H.UHospital AND G.Suma = H.Maximo
GROUP BY G.NHospital;