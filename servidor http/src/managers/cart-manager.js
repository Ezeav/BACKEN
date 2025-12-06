import { v4 as uuidv4 } from "uuid";
import { productManager } from "./product-manager.js";
import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  getAllCarts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const productsCart = await fs.promises.readFile(this.path, `utf-8`);
        return JSON.parse(productsCart);
      }
      return [];
    } catch (error) {
      throw new Error(error);
    }
  };
  saveCarts = async (cartsArray) => {
    try {
      const data = JSON.stringify(cartsArray, null, 2); // Convierte a JSON con formato legible
      await fs.promises.writeFile(this.path, data); // Escribe en el archivo carts.json
    } catch (error) {
      throw new Error(`Error al guardar los carritos: ${error.message}`);
    }
  };
  createCart = async () => {
    try {
      const newCart = {
        id: uuidv4(),
        products: [],
      };
      const carts = await this.getAllCarts();
      carts.push(newCart);
      await this.saveCarts(carts);
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw new Error("No se pudo crear el carrito.");
    }
  };
  getCartById = async (id) => {
    try {
      const carts = await this.getAllCarts();
      const idToSearch = isNaN(id) ? id : parseInt(id);
      const cartExist = carts.find((c) => {
        return c.id === idToSearch || c.id === id || c.id === parseInt(id);
      });
      if (!cartExist) {
        throw new Error(`Cart with ID: ${id} not found`);
      }
      return cartExist;
    } catch (error) {
      throw new Error(
        error.message || "Error desconocido al buscar el producto por ID."
      );
    }
  };
  addProdToCart = async (cartId, productId) => {
    try {
      // Verificar que el producto existe
      await productManager.getById(productId);

      // Obtener el carrito
      const cart = await this.getCartById(cartId);

      // Buscar si el producto ya existe en el carrito
      const existingProductIndex = cart.products.findIndex(
        (p) => p.product === productId || p.product === parseInt(productId)
      );

      if (existingProductIndex !== -1) {
        // Si el producto ya existe, incrementar quantity
        cart.products[existingProductIndex].quantity += 1;
      } else {
        // Si no existe, agregar el producto con quantity 1
        cart.products.push({
          product: isNaN(productId) ? productId : parseInt(productId),
          quantity: 1,
        });
      }

      // Obtener todos los carritos y actualizar el carrito modificado
      const allCarts = await this.getAllCarts();
      const cartIndex = allCarts.findIndex((c) => c.id === cart.id);

      if (cartIndex !== -1) {
        allCarts[cartIndex] = cart;
        await this.saveCarts(allCarts);
      } else {
        throw new Error(`Cart with ID: ${cartId} not found in carts array`);
      }

      return cart;
    } catch (error) {
      throw new Error(
        error.message || `Error al agregar el producto al carrito`
      );
    }
  };
}

export const cartManager = new CartManager(`./data/productsCart.json`);
