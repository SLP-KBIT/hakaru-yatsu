import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import socketio from 'socket.io';
import Session from './session';

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.set('views', path.join(process.cwd(), 'views'))
app.set('view engine', 'jade');
app.use(bodyParser());

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
  console.log('connected');
  socket.on('join', function (data) {
    io.sockets.emit('joined', {name: data.name})
  });
});

require('dotenv').config();

server.listen(process.env.HAKARU_PORT, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Server listening at http://%s:%s', host, port);
});
