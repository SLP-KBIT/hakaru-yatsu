import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import socketio from 'socket.io';
import Session from './session';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.set('views', path.join(process.cwd(), 'views'))
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(express.static('public'));

app.get('/', (req, res) => (
  res.render('index', { title: 'Hakaru Yatsu' })
));

app.post('/new', (req, res) => {
  const session = new Session()
  res.redirect('/' + session.id + '?name=' + req.body.name);
})

app.post('/join', (req, res) => {
  if ( Session.isExist(req.body.id) ) {
    res.redirect('/' + req.body.id + '?name=' + req.body.name);
  } else {
    res.render('index', {title: 'Hakaru Yatsu', alert: 'The Session is not Exist!'})
  }
})

app.get('/:id', (req, res) => {
  res.render('session', {title: 'Hakaru Yatsu', id: req.params.id, name: req.query.name})
})

io.on('connect', function(socket) {
  var session = null;

  socket.on('join', function (data) {
    session = Session.find(data.id);

    session.join(socket.id, data.name)

    // 送信元のユーザに現在のログインユーザの一覧を送信
    io.to(socket.id).emit('list-user', {users: session.users})
    // 送信元のユーザ以外にユーザが増えたことを通知
    socket.broadcast.emit('joined', {name: data.name})
  });

  socket.on('start', function (data) {
    io.sockets.emit("start", {name: data.name});
  });

  socket.on('stop', function (data) {
    io.sockets.emit("stop", {name: data.name});
  });

  socket.on('disconnect', function () {
    var removed_user = session.find_user(socket.id);
    // 送信元のユーザ以外にユーザが減ったことを通知
    socket.broadcast.emit('removed', removed_user);
    session.remove(socket.id);
  });
});

server.listen(process.env.HAKARU_PORT || 3001, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Server listening at http://%s:%s', host, port);
});
