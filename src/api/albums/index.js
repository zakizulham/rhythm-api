// src/api/albums/index.js
import AlbumsHandler from './handler.js';
import routes from './routes.js';

const albumsPlugin = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, songsService, validator }) => {
    const albumsHandler = new AlbumsHandler(service, songsService, validator);
    server.route(routes(albumsHandler));
  },
};

export default albumsPlugin;