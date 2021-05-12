var express = require("express");
var app = express();
app.listen(3000, () => {
    console.log("Servidor ejecutándose en el puerto 3000");
});

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'GVE',
});
connection.connect(function(error) {
    if (error) {
        throw error;
    } else {
        console.log('Conexion correcta.');
    }
});

//CONSULTA 1
app.get('/consulta1', (request, response) => {
    connection.query('SELECT Hospital.Nombre,Hospital.Ubicacion,COUNT(V.Fecha_Muerte) AS Numero_Fallecidos FROM Hospital INNER JOIN Victima V ON Hospital.ID_Hospital = V.ID_Hospital WHERE V.Fecha_Muerte != "0000-00-00 00:00:00" GROUP BY Hospital.ID_Hospital ORDER BY Numero_Fallecidos DESC;', (error, result) => {
        if (!error) {
            response.json(result);
        } else {
            console.log(error);
        }

    });
});
//CONSULTA 2
app.get('/consulta2', (request, response) => {
    connection.query('SELECT Nombre,Apellido,Tratamiento_Victima.Efectividad  FROM Paciente INNER JOIN Victima ON Paciente.ID_Paciente = Victima.ID_Paciente INNER JOIN Tratamiento_Victima ON Tratamiento_Victima.ID_Victima = Victima.ID_Victima WHERE Tratamiento_Victima.ID_Tratamiento = (SELECT Tratamiento.ID_Tratamiento FROM Tratamiento WHERE Tratamiento.Descripcion = "Transfusiones de sangre") AND Tratamiento_Victima.Efectividad > 5 AND Paciente.ID_Estado = (SELECT ID_Estado FROM Estado WHERE Descripcion = "En cuarentena") ORDER BY Tratamiento_Victima.Efectividad DESC;', (error, result) => {
        if (!error) {
            response.json(result);
        } else {
            console.log(error);
        }
    });
});
//CONSULTA 3
app.get('/consulta3', (request, response) => {
    connection.query('SELECT Nombre,Apellido,Direccion,COUNT(Paciente_Asociado.ID_Asociado) AS No_Asociados FROM Paciente INNER JOIN Victima ON Victima.ID_Paciente = Paciente.ID_Paciente INNER JOIN Paciente_Asociado ON Paciente_Asociado.ID_Paciente = Victima.ID_Paciente AND Paciente_Asociado.ID_Paciente = Paciente.ID_Paciente WHERE Victima.Fecha_Muerte != "0000-00-00 00:00:00" GROUP BY Paciente_Asociado.ID_Paciente HAVING 3 < COUNT(No_Asociados) ORDER BY Paciente.ID_Paciente;', (error, result) => {
        if (!error) {
            response.json(result);
        } else {
            console.log(error);
        }
    });
});
//CONSULTA 4
app.get('/consulta4', (request, response) => {
    connection.query('SELECT Paciente.Nombre,Paciente.Apellido,COUNT(Paciente_Asociado.ID_Asociado) AS No_Asociados FROM Paciente INNER JOIN Paciente_Asociado ON Paciente_Asociado.ID_Paciente = Paciente.ID_Paciente INNER JOIN Paciente_Asociado_Contacto ON Paciente_Asociado_Contacto.ID_Paciente_Asociado = Paciente_Asociado.ID_Paciente_Asociado WHERE Paciente.ID_Estado = (SELECT ID_Estado FROM Estado WHERE Descripcion = "Sospecha") AND Paciente_Asociado_Contacto.ID_Contacto = (SELECT ID_Contacto FROM Contacto WHERE Tipo = "Beso") GROUP BY Paciente_Asociado.ID_Paciente HAVING 2 < COUNT(Paciente_Asociado.ID_Asociado);', (error, result) => {
        if (!error) {
            response.json(result);
        } else {
            console.log(error);
        }
    });
});
//CONSULTA 5
app.get('/consulta5', (request, response) => {
    connection.query('SELECT DISTINCT Paciente.Nombre,Paciente.Apellido,COUNT(Tratamiento_Victima.ID_Tratamiento) AS No_Tratamientos FROM Tratamiento_Victima INNER JOIN Victima ON Tratamiento_Victima.ID_Victima = Victima.ID_Victima INNER JOIN Paciente ON Victima.ID_Paciente = Paciente.ID_Paciente WHERE Tratamiento_Victima.ID_Tratamiento = (SELECT ID_Tratamiento FROM Tratamiento WHERE Descripcion = "Oxigeno") GROUP BY Paciente.ID_Paciente ORDER BY No_Tratamientos DESC LIMIT 5;', (error, result) => {
        if (!error) {
            response.json(result);
        } else {
            console.log(error);
        }
    });
});
//CONSULTA 6
app.get('/consulta6', (request, response) => {
    connection.query('SELECT Nombre,Apellido,Victima.Fecha_Muerte FROM Paciente INNER JOIN Victima ON Victima.ID_Paciente = Paciente.ID_Paciente INNER JOIN Victima_Ubicacion ON Victima_Ubicacion.ID_Victima = Victima.ID_Victima INNER JOIN Tratamiento_Victima ON Tratamiento_Victima.ID_Victima = Victima.ID_Victima WHERE Victima_Ubicacion.ID_Ubicacion = (SELECT ID_Ubicacion FROM Ubicacion WHERE Descripcion = "1987 Delphine Well") AND Tratamiento_Victima.ID_Tratamiento = (SELECT ID_Tratamiento FROM Tratamiento WHERE Descripcion = "Manejo de la presión arterial") GROUP BY Fecha_Muerte;', (error, result) => {
        if (!error) {
            response.json(result);
        } else {
            console.log(error);
        }
    });
});
//CONSULTA 7
app.get('/consulta7', (request, response) => {
    connection.query('SELECT Nombre,Apellido,Direccion,COUNT(Tratamiento_Victima.ID_Tratamiento) AS No_Tratamientos,PA.No_Asociados FROM Paciente INNER JOIN Victima ON Victima.ID_Paciente = Paciente.ID_Paciente INNER JOIN Tratamiento_Victima ON Tratamiento_Victima.ID_Victima = Victima.ID_Victima,(SELECT COUNT(Paciente_Asociado.ID_Asociado) AS No_Asociados, Paciente_Asociado.ID_Paciente AS CPA FROM Paciente_Asociado INNER JOIN Paciente ON Paciente.ID_Paciente = Paciente_Asociado.ID_Paciente GROUP BY Paciente.ID_Paciente HAVING COUNT(Paciente_Asociado.ID_Asociado) < 2) AS PA WHERE PA.CPA = Paciente.ID_Paciente GROUP BY Paciente.Nombre, Paciente.Apellido HAVING 2 = No_Tratamientos;', (error, result) => {
        if (!error) {
            response.json(result);
        } else {
            console.log(error);
        }
    });
});
//CONSULTA 8
app.get('/consulta8', (request, response) => {
    connection.query('(SELECT month(Fecha_Sospecha) AS Mes,Nombre,Apellido,COUNT(Tratamiento_Victima.ID_Tratamiento) AS No_Tratamientos FROM Tratamiento_Victima INNER JOIN Victima ON Tratamiento_Victima.ID_Victima = Victima.ID_Victima INNER JOIN Paciente ON Victima.ID_Paciente = Paciente.ID_Paciente GROUP BY Paciente.ID_Paciente ORDER BY No_Tratamientos DESC LIMIT 10) UNION ALL(SELECT month(Fecha_Sospecha) AS Mes, Nombre, Apellido, COUNT(Tratamiento_Victima.ID_Tratamiento) AS No_Tratamientos FROM Tratamiento_Victima INNER JOIN Victima ON Tratamiento_Victima.ID_Victima = Victima.ID_Victima INNER JOIN Paciente ON Victima.ID_Paciente = Paciente.ID_Paciente GROUP BY Paciente.ID_Paciente ORDER BY No_Tratamientos ASC LIMIT 10);', (error, result) => {
        if (!error) {
            response.json(result);
        } else {
            console.log(error);
        }
    });
});
//CONSULTA 9
app.get('/consulta9', (request, response) => {
    connection.query('SELECT Hospital.Nombre,COUNT(Victima.Fecha_Muerte) AS Numero_Fallecidos,(COUNT(Fecha_Muerte) / (SELECT COUNT( * ) FROM Victima)) * 100 AS Porcentaje_Victimas FROM Hospital INNER JOIN Victima ON Hospital.ID_Hospital = Victima.ID_Hospital GROUP BY Hospital.ID_Hospital ORDER BY Porcentaje_Victimas DESC;', (error, result) => {
        if (!error) {
            response.json(result);
        } else {
            console.log(error);
        }
    });
});
//CONSULTA 10
app.get('/consulta10', (request, response) => {
    connection.query('SELECT G.NHospital AS Nombre_Hospital,G.Tipo AS Tipo_Contacto,H.Porcentaje AS Porcentajes FROM (SELECT DISTINCT T.NHospital, T.UHospital, T.Tipo, SUM(T.Total) AS Suma FROM(SELECT DISTINCT Paciente.Nombre, Paciente.Apellido, Paciente.Direccion, Paciente.Fecha_Sospecha, Hospital.Nombre AS NHospital, Hospital.Ubicacion AS UHospital, Contacto.Tipo, COUNT(Contacto.Tipo) AS Total FROM Paciente INNER JOIN Paciente_Asociado ON Paciente_Asociado.ID_Paciente = Paciente.ID_Paciente INNER JOIN Paciente_Asociado_Contacto ON Paciente_Asociado_Contacto.ID_Paciente_Asociado = Paciente_Asociado.ID_Paciente_Asociado INNER JOIN Contacto ON Contacto.ID_Contacto = Paciente_Asociado_Contacto.ID_Contacto INNER JOIN Victima ON Victima.ID_Paciente = Paciente.ID_Paciente INNER JOIN Hospital ON Hospital.ID_Hospital = Victima.ID_Hospital GROUP BY Hospital.Nombre, Paciente.Apellido) AS T GROUP BY T.NHospital, T.UHospital, T.Tipo) AS G, (SELECT DISTINCT F.NHospital, F.UHospital, F.Tipo, MAX(F.Suma) AS Maximo, ((MAX(F.Suma) / SUM(F.Suma)) * 100) AS Porcentaje FROM(SELECT DISTINCT T.NHospital, T.UHospital, T.Tipo, SUM(T.Total) AS Suma FROM(SELECT Paciente.Nombre, Paciente.Apellido, Paciente.Direccion, Paciente.Fecha_Sospecha, Hospital.Nombre AS NHospital, Hospital.Ubicacion AS UHospital, Contacto.Tipo, COUNT(Contacto.Tipo) AS Total FROM Paciente INNER JOIN Paciente_Asociado ON Paciente_Asociado.ID_Paciente = Paciente.ID_Paciente INNER JOIN Paciente_Asociado_Contacto ON Paciente_Asociado_Contacto.ID_Paciente_Asociado = Paciente_Asociado.ID_Paciente_Asociado INNER JOIN Contacto ON Contacto.ID_Contacto = Paciente_Asociado_Contacto.ID_Contacto INNER JOIN Victima ON Victima.ID_Paciente = Paciente.ID_Paciente INNER JOIN Hospital ON Hospital.ID_Hospital = Victima.ID_Hospital GROUP BY Hospital.Nombre, Paciente.Apellido) AS T GROUP BY T.NHospital, T.UHospital, T.Tipo) AS F GROUP BY F.NHospital, F.UHospital) AS H WHERE G.NHospital = H.NHospital AND G.UHospital = H.UHospital AND G.Suma = H.Maximo GROUP BY G.NHospital;', (error, result) => {
        if (!error) {
            response.json(result);
        } else {
            console.log(error);
        }
    });
});
//ELIMINAR TEMPORAL
app.get('/eliminarTemporal', (request, response) => {
    connection.query('DROP TABLE Temporal;', (error, result) => {
        if (!error) {
            response.send('Temporal Elimnada');
        } else {
            console.log(error);
        }
    });
});
//ELIMINAR MODELO
app.get('/eliminarModelo', (request, response) => {
    connection.query('SET FOREIGN_KEY_CHECKS=0;', (error, result) => {
        if (error) throw error;
    });

    connection.query('DROP TABLE Hospital,Tratamiento,Ubicacion,Estado,Contacto,Asociado,Paciente,Victima,Tratamiento_Victima,Victima_Ubicacion,Paciente_Asociado,Paciente_Asociado_Contacto;', (error, result) => {
        if (error) throw error;
    });

    connection.query('SET FOREIGN_KEY_CHECKS=1;', (error, result) => {
        if (!error) {
            response.send('Modelo Elimnado');
        } else {
            console.log(error);
        }
    });
});
//CARGAR TEMPORAL
app.get('/cargarTemporal', (request, response) => {

    connection.query('CREATE TABLE IF NOT EXISTS Temporal(Nombre_Victima varchar(50) NOT NULL,Apellido_Victima varchar(50) NOT NULL,Direccion_Victima varchar(50) NOT NULL,Fecha_Primera_Sospecha DATETIME NOT NULL,Fecha_Confirmacion DATETIME NOT NULL,Fecha_Muerte DATETIME,Estado_Victima varchar(50) NOT NULL,Nombre_Asociado varchar(50) NOT NULL,Apellido_Asociado varchar(50) NOT NULL,Fecha_Conocio DATETIME,Contacto_Fisico varchar(50),Fecha_Inicio_Contacto DATETIME,Fecha_Fin_Contacto DATETIME,Nombre_Hospital varchar(50),Direccion_Hospital varchar(50),Ubicacion_Victima varchar(50),Fecha_Llegada DATETIME,Fecha_Retiro DATETIME,Tratamiento varchar(50),Efectividad int,Fecha_Inicio_Tratamiento DATETIME,Fecha_Fin_Tratamiento DATETIME,Efectividad_Victima int);', (error, result) => {
        if (error) throw error;
    });

    var queryT = "LOAD DATA LOCAL INFILE '/home/luis-rivera/Escritorio/Archivos/LAB/Practica 1/GRAND_VIRUS_EPICENTER.csv' INTO TABLE Temporal FIELDS TERMINATED BY ';' LINES TERMINATED BY '\n' IGNORE 1 ROWS;";
    connection.query(queryT, (error, result) => {
        if (error) throw error;
        response.send(result);
    });
});
//CARGAR MODELO
app.get('/cargarModelo', (request, response) => {
    connection.query('CREATE TABLE IF NOT EXISTS Hospital(ID_Hospital int auto_increment,Ubicacion varchar(50) NOT NULL,Nombre varchar(50) NOT NULL,primary key(ID_Hospital));', (error, result) => {
        if (error) throw error;
    });

    connection.query('CREATE TABLE IF NOT EXISTS Tratamiento(ID_Tratamiento int auto_increment,Nivel_efectividad int NOT NULL,Descripcion varchar(50) NOT NULL,primary key(ID_Tratamiento));', (error, result) => {
        if (error) throw error;
    });

    connection.query('CREATE TABLE IF NOT EXISTS Ubicacion(ID_Ubicacion int auto_increment,Descripcion varchar(50) NOT NULL,primary key(ID_Ubicacion));', (error, result) => {
        if (error) throw error;
    });

    connection.query('CREATE TABLE IF NOT EXISTS Estado(ID_Estado int auto_increment,Descripcion varchar(50) NOT NULL,primary key(ID_Estado));', (error, result) => {
        if (error) throw error;
    });

    connection.query('CREATE TABLE IF NOT EXISTS Contacto(ID_Contacto int auto_increment,Tipo varchar(50) NOT NULL,primary key(ID_Contacto));', (error, result) => {
        if (error) throw error;
    });

    connection.query('CREATE TABLE IF NOT EXISTS Asociado(ID_Asociado int auto_increment,Nombre varchar(50) NOT NULL,Apellido varchar(50) NOT NULL,primary key(ID_Asociado));', (error, result) => {
        if (error) throw error;
    });

    connection.query('CREATE TABLE IF NOT EXISTS Paciente(ID_Paciente int auto_increment,Nombre varchar(50) NOT NULL,Apellido varchar(50) NOT NULL,Fecha_Sospecha DATETIME NOT NULL,Direccion varchar(50) NOT NULL,ID_Estado int NOT NULL,primary key(ID_Paciente),foreign key(ID_Estado) references Estado(ID_Estado) on delete cascade on update cascade);', (error, result) => {
        if (error) throw error;
    });

    connection.query('CREATE TABLE IF NOT EXISTS Victima(ID_Victima int auto_increment,Fecha_Confirmacion DATETIME NOT NULL,Fecha_Muerte DATETIME,ID_Hospital int NOT NULL,ID_Paciente int NOT NULL,primary key(ID_Victima),foreign key(ID_Hospital) references Hospital(ID_Hospital) on delete cascade on update cascade,foreign key(ID_Paciente) references Paciente(ID_Paciente) on delete cascade on update cascade);', (error, result) => {
        if (error) throw error;
    });

    connection.query('CREATE TABLE IF NOT EXISTS Tratamiento_Victima(ID_Tratamiento_Victima int auto_increment,Fecha_Inicio_Tratamiento DATETIME,Fecha_Fin_Tratamiento DATETIME,Efectividad int,ID_Tratamiento int,ID_Victima int,primary key(ID_Tratamiento_Victima),foreign key(ID_Tratamiento) references Tratamiento(ID_Tratamiento) on delete cascade on update cascade,foreign key(ID_Victima) references Victima(ID_Victima) on delete cascade on update cascade);', (error, result) => {
        if (error) throw error;
    });

    connection.query('CREATE TABLE IF NOT EXISTS Victima_Ubicacion(ID_Victima_Ubicacion int auto_increment,Fecha_Llegada DATETIME,Fecha_Retiro DATETIME,ID_Victima int,ID_Ubicacion int,primary key(ID_Victima_Ubicacion),foreign key(ID_Victima) references Victima(ID_Victima) on delete cascade on update cascade,foreign key(ID_Ubicacion) references Ubicacion(ID_Ubicacion) on delete cascade on update cascade);', (error, result) => {
        if (error) throw error;
    });

    connection.query('CREATE TABLE IF NOT EXISTS Paciente_Asociado(ID_Paciente_Asociado int auto_increment,Fecha_Conocio DATETIME,ID_Paciente int,ID_Asociado int,primary key(ID_Paciente_Asociado),foreign key(ID_Paciente) references Paciente(ID_Paciente) on delete cascade on update cascade,foreign key(ID_Asociado) references Asociado(ID_Asociado) on delete cascade on update cascade);', (error, result) => {
        if (error) throw error;
    });

    connection.query('CREATE TABLE IF NOT EXISTS Paciente_Asociado_Contacto(ID_Paciente_Asociado_Contacto int auto_increment,Fecha_Inicio DATETIME,Fecha_Fin DATETIME,ID_Paciente_Asociado int,ID_Contacto int,primary key(ID_Paciente_Asociado_Contacto),foreign key(ID_Paciente_Asociado) references Paciente_Asociado(ID_Paciente_Asociado) on delete cascade on update cascade,foreign key(ID_Contacto) references Contacto(ID_Contacto) on delete cascade on update cascade);', (error, result) => {
        if (error) throw error;
    });
    //INSERTAR MODELO
    connection.query('INSERT INTO Hospital(Ubicacion, Nombre) SELECT Direccion_Hospital, Nombre_Hospital FROM Temporal WHERE Temporal.Nombre_Hospital != "" AND NOT EXISTS(SELECT Nombre FROM Hospital WHERE Hospital.Nombre = Temporal.Nombre_Hospital) GROUP BY Temporal.Nombre_Hospital;', (error, result) => {
        if (error) throw error;
    });
    connection.query('/*LLENAR TRATAMIENTO*/ INSERT INTO Tratamiento(Nivel_efectividad, Descripcion) SELECT DISTINCT Efectividad, Tratamiento FROM Temporal WHERE Tratamiento != "" AND NOT EXISTS(SELECT Descripcion FROM Tratamiento WHERE Tratamiento = Descripcion);', (error, result) => {
        if (error) throw error;
    })
    connection.query('/*LLENAR UBICACION*/ INSERT INTO Ubicacion(Descripcion) SELECT DISTINCT Ubicacion_Victima FROM Temporal WHERE Ubicacion_Victima != "" AND NOT EXISTS(SELECT Descripcion FROM Ubicacion WHERE Ubicacion_Victima = Descripcion);', (error, result) => {
        if (error) throw error;
    })
    connection.query('/*LLENAR ESTADO*/ INSERT INTO Estado(Descripcion) SELECT DISTINCT Estado_Victima FROM Temporal WHERE Estado_Victima != "" AND NOT EXISTS(SELECT Descripcion FROM Estado WHERE Estado_Victima = Descripcion);', (error, result) => {
        if (error) throw error;
    })
    connection.query('/*LLENAR CONTACTO*/ INSERT INTO Contacto(Tipo) SELECT DISTINCT Contacto_Fisico FROM Temporal WHERE Contacto_Fisico != "" AND NOT EXISTS(SELECT Tipo FROM Contacto WHERE Contacto_Fisico = Tipo);', (error, result) => {
        if (error) throw error;
    })
    connection.query('/*LLENAR ASOCIADO*/ INSERT INTO Asociado(Nombre, Apellido) SELECT DISTINCT Nombre_Asociado, Apellido_Asociado FROM Temporal WHERE Nombre_Asociado != "" AND Apellido_Asociado != "" AND NOT EXISTS(SELECT Nombre FROM Asociado WHERE Nombre_Asociado = Nombre AND Apellido_Asociado = Apellido);', (error, result) => {
        if (error) throw error;
    })
    connection.query('/*LLENAR PACIENTE*/ INSERT INTO Paciente(Nombre, Apellido, Fecha_Sospecha, ID_Estado, Direccion) SELECT DISTINCT Temporal.Nombre_Victima, Temporal.Apellido_Victima, Temporal.Fecha_Primera_Sospecha, Estado.ID_Estado, Temporal.Direccion_Victima FROM Temporal INNER JOIN Estado ON Temporal.Estado_Victima = Estado.Descripcion;', (error, result) => {
        if (error) throw error;
    })
    connection.query('/*LLENAR VICTIMA*/ INSERT INTO Victima(Fecha_Confirmacion, Fecha_Muerte, ID_Hospital, ID_Paciente) SELECT DISTINCT Temporal.Fecha_Confirmacion, Temporal.Fecha_Muerte, Hospital.ID_Hospital, Paciente.ID_Paciente FROM Temporal INNER JOIN Hospital ON Temporal.Nombre_Hospital = Hospital.Nombre INNER JOIN Paciente ON Temporal.Nombre_Victima = Paciente.Nombre AND Temporal.Apellido_Victima = Paciente.Apellido;', (error, result) => {
        if (error) throw error;
    })
    connection.query('/*LLENAR TRATAMIENTO_VICTIMA*/ INSERT INTO Tratamiento_Victima(Fecha_Inicio_Tratamiento, Fecha_Fin_Tratamiento, Efectividad, ID_Tratamiento, ID_Victima) SELECT DISTINCT Temporal.Fecha_Inicio_Tratamiento, Temporal.Fecha_Fin_Tratamiento, Temporal.Efectividad_Victima, Tratamiento.ID_Tratamiento, Victima.ID_Victima FROM Temporal INNER JOIN Tratamiento ON(Temporal.Tratamiento != "" AND Temporal.Tratamiento = Tratamiento.Descripcion) AND(Temporal.Efectividad != "" AND Temporal.Efectividad = Tratamiento.Nivel_efectividad) INNER JOIN Victima ON(Temporal.Fecha_Confirmacion != "0000-00-00 00:00:00" AND Victima.Fecha_Confirmacion = Temporal.Fecha_Confirmacion) AND Victima.Fecha_Muerte = Temporal.Fecha_Muerte AND Victima.ID_Paciente = (SELECT DISTINCT ID_Paciente FROM Paciente WHERE Paciente.Nombre = Temporal.Nombre_Victima AND Paciente.Apellido = Temporal.Apellido_Victima AND Paciente.Direccion = Temporal.Direccion_Victima);', (error, result) => {
        if (error) throw error;
    })
    connection.query('/*LLENAR VICTIMA_UBICACION*/ INSERT INTO Victima_Ubicacion(Fecha_Llegada, Fecha_Retiro, ID_Victima, ID_Ubicacion) SELECT DISTINCT Temporal.Fecha_Llegada, Temporal.Fecha_Retiro, Victima.ID_Victima, Ubicacion.ID_Ubicacion FROM Temporal INNER JOIN Victima ON Victima.Fecha_Confirmacion = Temporal.Fecha_Confirmacion AND Victima.Fecha_Muerte = Temporal.Fecha_Muerte INNER JOIN Ubicacion ON(Temporal.Ubicacion_Victima != "" AND Temporal.Fecha_Llegada != "0000-00-00 00:00:00" AND Temporal.Fecha_Retiro != "0000-00-00 00:00:00" AND Temporal.Ubicacion_Victima = Ubicacion.Descripcion);', (error, result) => {
        if (error) throw error;
    })
    connection.query('/*LLENAR PACIENTE_ASOCIADO*/ INSERT INTO Paciente_Asociado(Fecha_Conocio, ID_Paciente, ID_Asociado) SELECT DISTINCT Temporal.Fecha_Conocio, Paciente.ID_Paciente, Asociado.ID_Asociado FROM Temporal INNER JOIN Paciente ON Temporal.Nombre_Victima = Paciente.Nombre AND Temporal.Apellido_Victima = Paciente.Apellido INNER JOIN Asociado ON Temporal.Nombre_Asociado = Asociado.Nombre AND Temporal.Apellido_Asociado = Asociado.Apellido;', (error, result) => {
        if (error) throw error;
    })
    connection.query('/*LLENAR PACIENTE_ASOCIADO_CONTACTO*/ INSERT INTO Paciente_Asociado_Contacto(Fecha_Inicio, Fecha_Fin, ID_Paciente_Asociado, ID_Contacto) SELECT DISTINCT Temporal.Fecha_Inicio_Contacto, Temporal.Fecha_Fin_Contacto, Paciente_Asociado.ID_Paciente_Asociado, Contacto.ID_Contacto FROM Temporal INNER JOIN Paciente_Asociado ON Temporal.Fecha_Conocio = Paciente_Asociado.Fecha_Conocio INNER JOIN Contacto ON Temporal.Contacto_Fisico = Contacto.Tipo;', (error, result) => {
        if (error) throw error;
        response.send(result);
    })

});