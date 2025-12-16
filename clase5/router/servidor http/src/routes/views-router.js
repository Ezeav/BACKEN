import Router from "express";
import { userManager } from "../managers/user-manager.js";
import { productManager } from "../managers/product-manager.js";

const router = Router();

router.get("/ruta1", (req, res) => {
  res.render("view1");
});

router.get("/form", (req, res) => {
  res.render("form");
});

router.get("/home/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userManager.getUserById(id);
    res.render("dashboard", { user });
  } catch (error) {
    res.render("error", { error: error.message });
  }
});

router.get("/home", async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.render("home", { products });
  } catch (error) {
    res.render("home", { products: [] });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.render("realTimeProducts", { products: [] });
  }
});

export default router;
