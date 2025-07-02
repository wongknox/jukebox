import db from "#db/client";

export async function getTracks() {
  const sql = `
    SELECT *
    FROM tracks
    `;
  const { rows: tracks } = await db.query(sql);
  return tracks;
}

export async function getTrackbyId(id) {
  const sql = `
    SELECT *    
    FROM tracks
    WHERE id = $1
    `;
  const {
    rows: [track],
  } = await db.query(sql, [id]);
  return track;
}
