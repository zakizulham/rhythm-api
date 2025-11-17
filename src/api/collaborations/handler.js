// src/api/collaborations/handler.js
class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    // Cek dulu, apakah user ini owner dari playlist yang mau diajak kolab
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    
    // Cek user yang mau diajak collab (Pake UsersService)
    await this._usersService.getUserById(userId);

    // Baru tambah collab
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

export default CollaborationsHandler;