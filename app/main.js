const net = require('net');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log('Logs from your program will appear here!');

const server = net.createServer((socket) => {
  socket.on('close', () => {
    socket.end();
    server.close();
  });
  socket.on('data', (data) => {
    console.log(data.toString());
    const strArr = data.toString().split(' ');
    const target = strArr[1];
    console.log(strArr);
    if (target === '/') {
      socket.write('HTTP/1.1 200 OK\r\n\r\n');
      socket.end();
      return;
    }
    if (target.includes('/echo/')) {
      const str = target.slice(6);
      const length = str.length;
      socket.write(
        'HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ' +
          length +
          '\r\n\r\n' +
          str
      );
      socket.end();
      return;
    }
    if (target.includes('/user-agent')) {
      const userAgentHeader = strArr[4].split('\r\n')[0];
      socket.write(
        'HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ' +
          userAgentHeader.length +
          '\r\n\r\n' +
          userAgentHeader
      );
      socket.end();
      return;
    }
    if (target.includes('/files/')) {
      const file = target.slice(7);
      const fs = require('fs');
      try {
        const data = fs.readFileSync(file).toString();
        socket.write(
          'HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ' +
            data.length +
            '\r\n\r\n' +
            data
        );
        socket.end();
      } catch (e) {
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.end();
      }
      return;
    }

    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    socket.end();
  });
});

server.listen(4221, 'localhost');
