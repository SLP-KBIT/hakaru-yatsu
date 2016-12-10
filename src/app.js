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
  res.redirect('/' + session.id);
})

app.post('/join', (req, res) => {
  if ( Session.isExist(req.body.id) ) {
    res.redirect('/' + req.body.id);
  } else {
    res.render('index', {title: 'Hakaru Yatsu', alert: 'The Session is not Exist!'})
  }
})

app.get('/:id', (req, res) => {
  res.send(req.params.id);
})

io.on('connect', function(socket) {
  console.log('connected');
});

server.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Server listening at http://%s:%s', host, port);
});
