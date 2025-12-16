const socket = io();
socket.on("mensaje-server", (message) => {
  console.log(message);
});
