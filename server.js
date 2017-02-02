const express = require('express');
const app = express();

const port = 3000;

//Enable pug as a template engine, from the views folder.
app.set('views', './views');
app.set('view engine', 'pug');

//Allow everything in ./public to be public.
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});