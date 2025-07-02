import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackbyId } from "#db/queries/tracks";

router.route("/").get(async (req, res, next) => {
  try {
    const tracks = await getTracks();
    res.send(tracks);
  } catch (error) {
    next(error);
  }
});

router.param("id", async (req, res, next, id) => {
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).send("ID must be a positive integer.");
  }

  try {
    const track = await getTrackbyId(Number(id));

    if (!track) {
      return res.status(404).send("Track not found.");
    }

    req.track = track;
    next();
  } catch (error) {
    next(error);
  }
});

router.route("/:id").get((req, res) => {
  res.send(req.track);
});
