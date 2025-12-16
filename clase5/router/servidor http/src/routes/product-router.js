import { Router } from "express";
import { productManager } from "../managers/product-manager.js";
import { productValidator } from "../middlewares/product-validator.js";
import { upload } from "../middlewares/multer.js";
import { getSocketServer } from "../utils/socketManager.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getById(id);
    res.json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", [productValidator], async (req, res) => {
  try {
    // Asegurar que si viene "name" también se asigne a "title"
    const productData = {
      ...req.body,
      title: req.body.name || req.body.title
    };
    const newProduct = await productManager.create(productData);
    const socketServer = getSocketServer();
    if (socketServer) {
      socketServer.emit("producto-agregado", newProduct);
    }
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/test-multer", upload.single("image"), async (req, res) => {
  try {
    console.log(req.file);
    const newProduct = await productManager.create({
      ...req.body,
      image: req.file.path,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.update(req.body, id);
    res.json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await productManager.delete(id);
    const socketServer = getSocketServer();
    if (socketServer) {
      socketServer.emit("producto-eliminado", id);
    }
    res.json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
