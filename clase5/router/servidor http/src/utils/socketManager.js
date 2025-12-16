// Archivo para almacenar la referencia al servidor de sockets
let socketServer = null;

export const setSocketServer = (io) => {
  socketServer = io;
};

export const getSocketServer = () => {
  return socketServer;
};

