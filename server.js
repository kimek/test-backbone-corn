const express = require('express');
const path = require('path');
const cornRoutes = require('./routes/corn-routes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api', cornRoutes);

app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Corn server listening on http://localhost:${PORT}`);
});
