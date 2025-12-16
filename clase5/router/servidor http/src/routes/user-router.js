import { Router } from "express";
import { userManager } from "../managers/user-manager.js";

const userRouter = Router();

userRouter.post("/", async (req, res) => {
  try {
    const user = await userManager.register(req.body);
    res.redirect(`/home/${user.id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default userRouter;
