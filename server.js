const express = require('express');
const path = require('path');

const PORT = 3000;
const app = express();

const mainRouter = require('./routes/mainRouter.js');

app.use(express.static(__dirname + '/public'));
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/public/index.html'));
});

app.use('/api', mainRouter);

app.listen(PORT, () => {
  console.log('listening')
})
