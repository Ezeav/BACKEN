import fs from "fs";
import { v4 as uuidv4 } from "uuid";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getAll = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, `utf-8`);
        return JSON.parse(products);
      }
      return [];
    } catch (error) {
      throw new Error(error);
    }
  };

  getById = async (id) => {
    try {
      const products = await this.getAll();
      const idToSearch = isNaN(id) ? id : parseInt(id);
      const productExist = products.find((p) => {
        return p.id === idToSearch || p.id === id || p.id === parseInt(id);
      });
      if (!productExist) {
        throw new Error(`Product with ID ${id} not found`);
      }
      return productExist;
    } catch (error) {
      throw new Error(
        error.message || "Error desconocido al buscar el producto por ID."
      );
    }
  };
  create = async (obj) => {
    try {
      const product = {
        id: uuidv4(),
        ...obj,
      };
      const products = await this.getAll();
      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return product;
    } catch (error) {
      throw new Error(error);
    }
  };
  update = async (obj, id) => {
    try {
      const products = await this.getAll();
      let productExist = await this.getById(id);
      productExist = { ...productExist, ...obj };
      const newArray = products.filter((product) => product.id !== id);
      newArray.push(productExist);
      await fs.promises.writeFile(this.path, JSON.stringify(newArray, null, 2));
      return productExist;
    } catch (error) {
      throw new Error(
        error.message || `Error al actualizar el producto con ID: ${id}`
      );
    }
  };

  delete = async (id) => {
    try {
      const product = await this.getById(id);
      const products = await this.getAll();
      const idToSearch = isNaN(id) ? id : parseInt(id);
      const newArray = products.filter((p) => {
        return p.id !== idToSearch && p.id !== id && p.id !== parseInt(id);
      });
      await fs.promises.writeFile(this.path, JSON.stringify(newArray, null, 2));
      return `Producto con id: ${product.id} eliminado`;
    } catch (error) {
      throw new Error(
        error.message || `Error al eliminar el producto con ID: ${id}`
      );
    }
  };
}
export const productManager = new ProductManager(`./data/products.json`);
