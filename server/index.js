const express = require('express')
const mysql = require('mysql');
const cors = require('cors')
require('dotenv/config');
const PORT = process.env.PORT;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to mySQL!");
});

// USERS
app.get('/users', (req, res) => {
    con.query("SELECT * FROM users", function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.get('/users/:id', (req, res) => {
    const {id} = req.params;
    con.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id], function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});


// LOGIN
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    con.query("SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1", [username, password], function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

// REGISTER
app.post('/register', (req, res) => {
    con.query("INSERT INTO users SET ? ", req.body, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});


// GAMES
app.get('/games/', (req, res) => {
    const {device, slide, limit, offset} = req.query;
    con.query('SELECT * FROM games WHERE 1 = 1'
        + (device ? (' AND device = \'' + device + '\'') : '')
        + (slide ? (' AND slide = ' + slide) : '')
        + (limit ? (' LIMIT ' + limit) : '')
        + (offset ? (' OFFSET ' + offset) : ''),
        function (err, result) {
            if (err) {
                throw err;
            }
            con.query('SELECT COUNT(*) AS total FROM games WHERE 1 = 1'
                + (device ? (' AND device = \'' + device + '\'') : '')
                + (slide ? (' AND slide = ' + slide) : ''),
                function (err, count) {
                    if (err) {
                        throw err;
                    }

                    res.json({result, count});
                });
        });
});

app.get('/games/:id', (req, res) => {
    const {id} = req.params;
    con.query("SELECT * FROM games WHERE id = ? LIMIT 1", [id], function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});


// CART
app.get('/getCart/:userId', (req, res) => {
    const {userId} = req.params;
    con.query("SELECT cart.id AS id, games.id AS gameId, games.title, games.price, cart.quantity " +
        "FROM games JOIN cart ON games.id = cart.game_id " +
        "WHERE cart.user_id = ?", [userId], function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.post('/addToCart', (req, res) => {
    const {userId, gameId, quantity} = req.body;
    con.query("SELECT * FROM cart WHERE user_id = ? AND game_id = ?", [userId, gameId], function (err, result) {
        if (err) {
            throw err;
        }
        if (result.length !== 0) {
            const pair = result[0];

            // if there is a pair -> increase quantity
            const newQuantity = parseInt(pair.quantity) + parseInt(quantity);
            con.query("UPDATE cart SET quantity = ? WHERE id = ? ", [newQuantity, pair.id], function (err, result) {
                if (err) {
                    throw err;
                }
                res.json(result);
            });
        } else {
            // add new pair
            con.query("INSERT INTO cart SET ? ", {user_id: userId, game_id: gameId, quantity}, function (err, result) {
                if (err) {
                    throw err;
                }
                res.json(result);
            });
        }
    });
});

app.post('/deleteFromCart', (req, res) => {
    const {userId, gameId} = req.body;
    con.query("DELETE FROM cart WHERE user_id = ? AND game_id = ?", [userId, gameId], function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.post('/clearCart', (req, res) => {
    const {userId} = req.body;
    con.query("DELETE FROM cart WHERE user_id = ?", [userId], function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.listen(PORT, () => console.log('Server is running on port', PORT));
