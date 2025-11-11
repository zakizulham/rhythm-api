// src/server.js
import 'dotenv/config'; 
import Hapi from '@hapi/hapi';
import ClientError from './exceptions/ClientError.js';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // buat nangkep semua error di satu tempat, jadi ga usah try-catch di tiap handler
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      // Kalo errornya emang salah client (400-an)
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // Kalo errornya bukan dari server (kayak 404), biarin Hapi yang urus
      if (!response.isServer) {
        return h.continue;
      }

      // Kalo servernya yang gagal (500)
      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      newResponse.code(500);
      console.error(response); // Nyatet error aslinya di console
      return newResponse;
    }

    // Kalo aman, lanjutin aja
    return h.continue;
  });

  await server.start();
  console.log(`Server nyala di ${server.info.uri}`);
};

init();