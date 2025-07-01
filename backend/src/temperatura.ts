// import express, { Request, Response } from 'express';
// import { insertDataSala } from "../src/services/salaLimpia/Insert.servicesS";
// import { Server, Socket } from 'socket.io';

// const temperaturaEmitter = express();

// // Variable para almacenar la temperatura
// let temperatura: string | null = null;
// let humedad: string | null = null;

// // Endpoint para recibir la temperatura (este es el que tú ya usas para obtener la temperatura)
// temperaturaEmitter.get('/humedad', (req: Request, res: Response) => {
//     let temperatura = req.query.temperatura as string;
//     let temperaturaEntera = Math.floor(parseFloat(temperatura)); // Convierte a número y redondea hacia abajo
    
//     humedad = req.query.humedad as string;
//     console.log(`Temperatura recibida: ${temperatura}°C`);
//     console.log(`Humedad recibida: ${humedad}°C`);

//     const values = {
//         temp_interna: `${temperaturaEntera}°C`,
//         humedad_int: `${humedad}%`
//     }
//     insertDataSala("sala_limpia", values);
//     res.status(200).send(`${temperatura}°C`);
// });
// export default temperaturaEmitter;




import express, { Request, Response } from 'express';
import { insertDataSala } from "./services/salaLimpia/Insert.servicesS";
import { io } from './app';

// const temperaturaEmitter = express.Router();
// import { insertDataSala } from "../src/services/salaLimpia/Insert.servicesS";

const temperaturaEmitter = express();

// Variable para almacenar la temperatura
let temperatura: string | null = null;
let humedad: string | null = null;

// Endpoint para recibir la temperatura y humedad
temperaturaEmitter.get('/humedad', (req: Request, res: Response) => {
    const temperaturax = req.query.temperatura;
    const humedad = req.query.humedad;

//     let temperatura = req.query.temperatura as string;
//     let temperaturaEntera = Math.floor(parseFloat(temperatura)); // Convierte a número y redondea hacia abajo
    
//     humedad = req.query.humedad as string;
//     console.log(`Temperatura recibida: ${temperatura}°C`);
//     console.log(`Humedad recibida: ${humedad}°C`);


    insertDataSala("sala_limpia", { temp_interna: `${temperaturax}°C`, humedad_int: `${humedad}%` })
        .then(() => {
            io.emit("newDataNotification", {
                message: `Sala Limpia: Temperatura: ${temperaturax}°C y Humedad: ${humedad}`,
            });  // Emitir evento a los clientes conectados
            res.status(200).send("Datos insertados correctamente");
        })
        .catch((error) => {
            console.error('Error al insertar datos:', error);
            res.status(500).send('Error al insertar datos');
        });
});

export default temperaturaEmitter;
