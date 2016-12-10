import express from 'express';

var app = express();

app.get('/', (req, res) => (
  res.send('Hello World!')
));

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Server listening at http://%s:%s', host, port);
});
