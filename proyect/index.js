const fs = require(`node:fs`);
const bcrypt = require(`bcrypt`);

const path = `./users.json`;
class UserManager {
  constructor(path) {
    this.path = path;
  }

  getUsers = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const users = await fs.promises.readFile(this.path, `utf-8`);
        return JSON.parse(users);
      }
      return [];
    } catch (error) {
      throw new Error(error);
    }
  };
  register = async (obj) => {
    try {
      const users = await this.getUsers();
      const user = { ...obj };
      user.password = bcrypt.hashSync(user.password, 10);
      users.push(user);
      await fs.promises.writeFile(this.path, JSON.stringify(users));
      return user;
    } catch (error) {
      console.error("🚨 Error al escribir el archivo JSON:", error);
      throw new Error(error);
    }
  };

  login = async (email, password) => {
    const users = await this.getUsers();
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("Invalid credentials");

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) throw new Error("Invalid credentials");
    return "Login OK";
  };
}
const userManager = new UserManager(`./users.json`);
const test = async () => {
  await userManager.register({ email: "juan@gmail.com", password: "1234" });
  await userManager.register({ email: "mariano@gmail.com", password: "12345" });
  console.log(await userManager.getUsers());
  console.log(await userManager.login("mariano@gmail.com", "12345"));
};

test();
