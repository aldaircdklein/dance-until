const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000"
    }
});
const ip = require('ip');

app.use(cors());

app.get('/ip', function(req, res, next) {
    res.send({address: ip.address()});
});

io.on('connection', (socket) => {

  socket.on('status', (req) => {
    console.log('status',req);
    socket.broadcast.emit('newStatus', {data:req});
  })
  
  socket.on('players', (req) => {
    console.log('newPlayers',req);
    socket.broadcast.emit('newPlayers', {data:req});
  })

  socket.on('finish', (req) => {
    console.log('finish',req);
    socket.broadcast.emit('newFinish', {data:req});
  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

server.listen(3003, () => {
  console.log('listening on *:3003');
});