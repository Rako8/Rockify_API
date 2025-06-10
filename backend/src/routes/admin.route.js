import{Router} from "express";
import{createAlbum, createSong, deleteAlbum, deleteSong, checkAdmin} from "../controllers/admin.controller.js";
import { protectRoute, requiredAdmin } from "../middleware/auth.middleware.js";



const router = Router();
// this is fro slightly opitimized clean code=>
router.use(protectRoute, requiredAdmin);

router.get("/check", checkAdmin);
router.post("/songs", createSong);// this is to post or upload the song if the user is admin 
router.delete("/songs/:id", deleteSong); //And this one is to delete the song if the user is an admin

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);
export default router;

