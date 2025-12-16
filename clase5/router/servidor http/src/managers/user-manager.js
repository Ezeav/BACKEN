import fs from "node:fs";
import crypto from "node:crypto";
import { v4 as uuidv4 } from "uuid";

class UserManager {
  constructor(path) {
    this.path = path;
  }

  getUsers = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const users = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(users); //formato js
      }
      return [];
    } catch (error) {
      throw new Error(error);
    }
  };

  getUserById = async (id) => {
    try {
      const users = await this.getUsers();
      const user = users.find((u) => u.id === id);

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  };

  register = async (obj) => {
    try {
      const users = await this.getUsers();
      //formato js
      const user = {
        id: uuidv4(),
        ...obj,
      };
      user.secret = crypto.randomBytes(128).toString();
      user.password = crypto
        .createHmac("sha256", user.secret)
        .update(user.password)
        .digest("hex");
      users.push(user);
      users.push(user);
      await fs.promises.writeFile(this.path, JSON.stringify(users)); //guardar en formato json
      return user;
    } catch (error) {
      throw new Error(error);
    }
  };

  login = async (email, password) => {
    try {
      const users = await this.getUsers();
      const user = users.find((u) => u.email === email);
      if (!user) throw new Error("Invalid credentials");

      const newCrypto = crypto
        .createHmac("sha256", user.secret)
        .update(password)
        .digest("hex");

      if (user.password !== newCrypto) throw new Error("Invalid credentials");

      return "Login OK";
    } catch (error) {
      throw new Error(error);
    }
  };
}

export const userManager = new UserManager("./users.json");
