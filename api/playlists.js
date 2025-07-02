import express from "express";
const router = express.Router();
export default router;

import {
  getPlaylists,
  createPlaylist,
  getPlaylistbyId,
  getTracksInPlaylist,
} from "#db/queries/playlists";
import { addTrackToPlaylist } from "#db/queries/playlists-tracks";

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const playlists = await getPlaylists();
      res.send(playlists);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).send("Request body required.");
      }
      const { name, description } = req.body;
      if (!name || typeof name !== "string" || name.trim() === "") {
        return res
          .status(400)
          .send("Playlist name is required and must be a non-empty string.");
      }
      if (description === undefined || typeof description !== "string") {
        return res
          .status(400)
          .send("Playlist description is required and must be a string.");
      }
      const playlist = await createPlaylist(name.trim(), description);
      res.status(201).send(playlist);
    } catch (error) {
      next(error);
    }
  });

router.param("id", async (req, res, next, id) => {
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).send("ID must be a positive integer.");
  }
  try {
    const playlist = await getPlaylistbyId(Number(id));
    if (!playlist) {
      return res.status(404).send("Playlist not found.");
    }
    req.playlist = playlist;
    next();
  } catch (error) {
    next(error);
  }
});

router.route("/:id").get((req, res) => {
  res.send(req.playlist);
});

router
  .route("/:id/tracks")
  .get(async (req, res, next) => {
    try {
      if (!req.playlist || typeof req.playlist.id === "undefined") {
        return res
          .status(500)
          .send("Server Error: Playlist context not available.");
      }

      const playlistId = req.playlist.id;

      if (typeof playlistId !== "number") {
        return res.status(500).send("Server Error: Invalid playlist ID type.");
      }

      const tracks = await getTracksInPlaylist(playlistId);

      if (!Array.isArray(tracks)) {
        return res
          .status(500)
          .send("Server Error: Unexpected query result format.");
      }

      res.send(tracks);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    const playlistId = req.playlist.id;

    try {
      if (!req.body) {
        return res.status(400).send("Request body not provided.");
      }
      if (typeof req.body === "object" && Object.keys(req.body).length === 0) {
        return res.status(400).send("Request body cannot be empty.");
      }

      const { trackId } = req.body;

      if (!Number.isInteger(trackId) || trackId <= 0) {
        return res.status(400).send("trackId must be a positive integer.");
      }
      if (trackId === undefined) {
        return res.status(400).send("trackId is required.");
      }

      const playlist_track = await addTrackToPlaylist(playlistId, trackId);
      res.status(201).send(playlist_track);
    } catch (error) {
      if (error.status === 400) {
        return res.status(400).send(error.message);
      }
      if (error.code === "23505") {
        return res.status(400).send("Track is already in this playlist.");
      }
      next(error);
    }
  });
