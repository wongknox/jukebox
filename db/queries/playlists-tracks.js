import db from "#db/client";
import { getTrackbyId } from "#db/queries/tracks";

export async function addTrackToPlaylist(playlistId, trackId) {
  const track = await getTrackbyId(trackId);
  if (!track) {
    const error = new Error("Track not found.");
    error.status = 400;
    throw error;
  }
  const sql = `
        INSERT INTO playlists_tracks (playlist_id, track_id)
        VALUES ($1, $2)
        RETURNING *; -- Return the newly created join table record
    `;
  const {
    rows: [playlist_track],
  } = await db.query(sql, [playlistId, trackId]);
  return playlist_track;
}
