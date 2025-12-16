import express from "express";
import productRouter from "./routes/product-router.js";
import cartRouter from "./routes/cart-router.js";
import { loggerHttp } from "./middlewares/loggerHttp.js";
import viewsRouter from "./routes/views-router.js";
import path from "path";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { setSocketServer } from "./utils/socketManager.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
import userRouter from "./routes/user-router.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const server = express();
const port = 4040;

// Middleware para parsear JSON
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// Middleware de logging (debe ir antes de las rutas)
server.use(loggerHttp);
server.use("/api/products", productRouter);
server.use("/api/carts", cartRouter);
server.use(express.static("public"));
server.use("/api/users", userRouter);
server.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    // CORRECCIÓN 3: Usamos __dirname, que apunta a 'src/', para llegar a 'views/layouts'
    layoutsDir: path.join(__dirname, "views", "layouts"),
    extname: ".handlebars",
  })
);
server.set("views", path.join(__dirname, "views"));
server.set("view engine", "handlebars");
server.use("/", viewsRouter);
server.get("/", (req, res) => {
  res.render("websocket");
});

const httpServer = server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const socketServer = new Server(httpServer);
setSocketServer(socketServer);

socketServer.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);
  socket.emit("mensaje-server", "bienvenidos a web socket");
});
