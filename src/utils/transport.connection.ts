// import { ClientProxyFactory, Transport } from "@nestjs/microservices";
// import { firstValueFrom } from "rxjs";
// import { CreatedataDto } from "src/gateway/dto/create-gateway.dto";

// export class transportServcie{
//   constructor(){}

//   private createTCPClient(host: string, port: number) {
//     try {
//       return ClientProxyFactory.create({
//         transport: Transport.TCP,
//         options: {
//           host,
//           port,
//         },
//       });
//     } catch (error) {
//         throw new Error(`echec de connection au service :${error} `);      
//     }
//   }

//   async getConnection(data: CreatedataDto){

//     try { 
//           const data = { 
//             moduleName: 'azee',
//             data:[],
//             serviceName:"service",
//             method:"POST",
//             serviceSource:"2"
//            };
//           const client = await this.createTCPClient('192.168.183.153', 3004); 
//           const response = await firstValueFrom(client.send({ cmd: 'process_data' }, data ? data : {}));
//           console.log('Response from FastAPI:', response);
//           return response;
//         } catch (error) {
//           console.error('Error communicating with FastAPI:', error.message);
//           throw error;
//         }
//   }
// }

