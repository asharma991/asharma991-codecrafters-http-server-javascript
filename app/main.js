const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
    server.close();
  });
  socket.on("data", (data) => {
    console.log(data.toString());
    const strArr = data.toString().split(" ");
    const target = strArr[1];
    if (target!=='/') {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      socket.end();
      return;
    }
    socket.write('HTTP/1.1 200 OK\r\n\r\n');
    socket.end();
  });
});


server.listen(4221, "localhost");
