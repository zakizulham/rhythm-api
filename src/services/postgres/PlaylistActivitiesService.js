// src/services/postgres/PlaylistActivitiesService.js
import { nanoid } from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import pool from './Pool.js';

class PlaylistActivitiesService {
  constructor() {
    this._pool = pool;
  }

  async addActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();
    
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Aktivitas playlist gagal ditambahkan');
    }
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
             FROM playlist_song_activities
             LEFT JOIN users ON playlist_song_activities.user_id = users.id
             LEFT JOIN songs ON playlist_song_activities.song_id = songs.id
             WHERE playlist_song_activities.playlist_id = $1
             ORDER BY playlist_song_activities.time ASC`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

export default PlaylistActivitiesService;