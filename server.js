const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

//Start express
const app = express();

//Load .env to the process.env object
dotenv.load();

//Load json bodies into the req object.
app.use(bodyParser.json());

//Set the port to the server's requested port, or 3000 as default.
const port = process.env.PORT || 3000;

//Enable pug as a template engine, from the views folder.
app.set('views', './views');
app.set('view engine', 'pug');

//Allow everything in ./public to be public.
app.use(express.static('./public'));

//Load the controllers.
const SplashController = require('./controllers/splash');
const TestController = require('./controllers/tests');

/*app.get('/', (req, res) => {
    res.send('Welcome to MetaCard!');
});*/

app.get('/splash', SplashController.splash);
app.get('/cardDemo', TestController.cardDemo);

//Send to splash whenever page not specified @Sean
app.get('/', SplashController.splash);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});