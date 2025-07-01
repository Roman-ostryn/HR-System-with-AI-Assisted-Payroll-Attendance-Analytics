import 'reflect-metadata';
import { createConnection, ConnectionOptions } from 'typeorm';
import app from './app';
import { AppDataSource } from './db';

async function main() {
  try {
    // Configura la conexión de TypeORM con SqlServerConnectionOptions
    await createConnection(AppDataSource as ConnectionOptions);

    // Inicia tu aplicación después de que la conexión se haya establecido
    app.listen(5003);
    console.log('Server is listening on port', 5003);
  } catch (error) {
    console.error(error);
  }
}

main();
