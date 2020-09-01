const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const PORT = process.env.PORT;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const usersRoutes = require('./mongoDB/routes/users');
app.use('/users', usersRoutes);

mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log('Connected to mongoDB!'));

app.listen(PORT, () => console.log('Server is running on port', PORT));
