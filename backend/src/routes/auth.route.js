import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });



const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.put("/update-profile", upload.single("avatar"),protectRoute, updateProfile);

router.get("/check",protectRoute,checkAuth)

export default router;