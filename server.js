const express = require('express');
const app = express();

const port = 3000;

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.send('Hello world!');
    res.end();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});