const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const pg = require('pg');

// Start express
const app = express();

// Load .env to the process.env object
dotenv.load();

// Load json bodies into the req object.
app.use(bodyParser.json());

// Set the port to the server's requested port, or 3000 as default.
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

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
const config = {
    user: 'postgres', //env var: PGUSER
    database: 'postgres', //env var: PGDATABASE
    password: '', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

// this initializes a connection pool
// it will keep idle connections open for a 30 seconds
// and set a limit of maximum 10 idle clients
const pool = new pg.Pool(config);

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
pool.connect((err, client, done) => {
    if(err) {
        return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM test1', (err, result) => {
        console.log(result.rows[0].name);
        //call `done()` to release the client back to the pool
        done();
        if(err) {
            return console.error('error running query', err);
        }
    });
});

pool.on('error', (err, client) => {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack);
});