let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      handlePreflightRequest: (req, res) => {
        const headers = {
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
          "Access-Control-Allow-Credentials": true,
        };
        res.writeHead(200, headers);
        res.end();
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
