import{Router} from "express";
import { getAllSongs , getFeaturedSongs,getMadeForYouSongs,getTrendingSongs} from "../controllers/song.controller.js";
import {protectRoute, requiredAdmin} from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", protectRoute, requiredAdmin, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);

export default router;