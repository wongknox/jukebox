import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  console.log("Seeding database...");

  const playlistsData = [
    { name: "Morning Jams", description: "Upbeat tunes to start the day" },
    {
      name: "Focus & Study",
      description: "Ambient and instrumental for concentration",
    },
    { name: "Workout Mix", description: "High-energy tracks for your workout" },
    { name: "Chill Vibes", description: "Relaxing music for winding down" },
    {
      name: "Road Trip Anthems",
      description: "Sing-along classics for long drives",
    },
    { name: "Party Starters", description: "Get the celebration going" },
    { name: "Classical Collection", description: "Timeless masterpieces" },
    {
      name: "Indie Discoveries",
      description: "New and interesting independent artists",
    },
    { name: "Gaming Soundtrack", description: "Epic music for epic quests" },
    { name: "Sleep Aid", description: "Soft, calming sounds for bedtime" },
  ];
  const playlistIds = {};

  console.log(`Inserting ${playlistsData.length} playlists...`);
  for (const playlist of playlistsData) {
    const { rows } = await db.query(
      `INSERT INTO playlists (name, description) VALUES ($1, $2) RETURNING id;`,
      [playlist.name, playlist.description]
    );
    playlistIds[playlist.name] = rows[0].id;
  }
  console.log("Playlists inserted:", playlistIds);

  const tracksData = [
    { name: "Sunrise Serenade", duration_ms: 240000 },
    { name: "Coding Flow", duration_ms: 300000 },
    { name: "Pump It Up", duration_ms: 180000 },
    { name: "Sunset Glow", duration_ms: 270000 },
    { name: "Highway Drive", duration_ms: 210000 },
    { name: "Bass Drop", duration_ms: 150000 },
    { name: "Moonlight Sonata", duration_ms: 360000 },
    { name: "Hidden Gem", duration_ms: 200000 },
    { name: "Hero's Journey", duration_ms: 420000 },
    { name: "Dreamscape", duration_ms: 500000 },
    { name: "Morning Coffee", duration_ms: 220000 },
    { name: "Deep Work", duration_ms: 320000 },
    { name: "Cardio Beat", duration_ms: 190000 },
    { name: "Evening Breeze", duration_ms: 280000 },
    { name: "Open Road", duration_ms: 250000 },
    { name: "Dance Floor", duration_ms: 160000 },
    { name: "Violin Concerto", duration_ms: 380000 },
    { name: "Acoustic Wonder", duration_ms: 230000 },
    { name: "Fantasy World", duration_ms: 400000 },
    { name: "Rainy Day Calm", duration_ms: 480000 },
    { name: "Electro Groove", duration_ms: 210000 },
    { name: "Meditate", duration_ms: 600000 },
  ];
  const trackIds = [];

  console.log(`Inserting ${tracksData.length} tracks...`);
  for (const track of tracksData) {
    const { rows } = await db.query(
      `INSERT INTO tracks (name, duration_ms) VALUES ($1, $2) RETURNING id;`,
      [track.name, track.duration_ms]
    );
    trackIds.push(rows[0].id);
  }
  console.log("Tracks inserted, IDs:", trackIds);

  const playlistsTracksToInsert = [];

  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Morning Jams"],
    track_id: trackIds[0],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Morning Jams"],
    track_id: trackIds[2],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Morning Jams"],
    track_id: trackIds[10],
  });

  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Focus & Study"],
    track_id: trackIds[1],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Focus & Study"],
    track_id: trackIds[11],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Focus & Study"],
    track_id: trackIds[6],
  });

  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Workout Mix"],
    track_id: trackIds[2],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Workout Mix"],
    track_id: trackIds[12],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Workout Mix"],
    track_id: trackIds[5],
  });

  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Chill Vibes"],
    track_id: trackIds[3],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Chill Vibes"],
    track_id: trackIds[13],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Chill Vibes"],
    track_id: trackIds[19],
  });

  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Road Trip Anthems"],
    track_id: trackIds[4],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Road Trip Anthems"],
    track_id: trackIds[14],
  });

  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Party Starters"],
    track_id: trackIds[15],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Party Starters"],
    track_id: trackIds[20],
  });

  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Classical Collection"],
    track_id: trackIds[16],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Indie Discoveries"],
    track_id: trackIds[17],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Gaming Soundtrack"],
    track_id: trackIds[8],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Gaming Soundtrack"],
    track_id: trackIds[18],
  });
  playlistsTracksToInsert.push({
    playlist_id: playlistIds["Sleep Aid"],
    track_id: trackIds[9],
  });

  console.log(
    `Inserting ${playlistsTracksToInsert.length} playlists_tracks records...`
  );
  const insertPromises = playlistsTracksToInsert.map((pt) => {
    const sql = `
      INSERT INTO playlists_tracks (playlist_id, track_id)
      VALUES ($1, $2);
    `;
    return db.query(sql, [pt.playlist_id, pt.track_id]);
  });

  await Promise.all(insertPromises);
  console.log(
    `Inserted ${playlistsTracksToInsert.length} playlist_track relationships.`
  );

  console.log("Database seeding complete.");
}
