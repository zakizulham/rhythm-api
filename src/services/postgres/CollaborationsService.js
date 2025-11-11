// src/services/postgres/CollaborationsService.js
import InvariantError from '../../exceptions/InvariantError.js';
import pool from './Pool.js';

class CollaborationsService {
  constructor() {
    this._pool = pool;
  }

  // Cek kalo user adalah kolaborator
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

export default CollaborationsService;