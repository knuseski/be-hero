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

app.get('/', (req, res) => {
    con.query("SELECT * FROM users", function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.get('/:id', (req, res) => {
    const {id} = req.params;
    con.query("SELECT * FROM users WHERE id = ?", [id], function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.post('/', (req, res) => {
    con.query("INSERT INTO users SET ? ", req.body, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.delete('/:id', (req, res) => {
    const {id} = req.params;
    con.query("DELETE FROM users WHERE id = ?", [id], function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

// TODO Update is missing...
app.patch('/:id', (req, res) => {
    const {id} = req.params;
    con.query("DELETE FROM users WHERE id = ?", [id], function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.listen(PORT, () => console.log('Server is running on port', PORT));
