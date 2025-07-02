import express from "express";
const app = express();

import playlistsRouter from "#api/playlists";
import tracksRouter from "#api/tracks";

app.use(express.json());

app.use("/playlists", playlistsRouter);
app.use("/tracks", tracksRouter);

app.use((err, req, res, next) => {
  console.error("An unexpected server error occurred:", err);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

export default app;
