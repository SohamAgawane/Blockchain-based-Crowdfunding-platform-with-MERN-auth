const express = require('express')
const app =  express();
const bodyparser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
// add mongoDB setup
require('./Models/db');
const AuthRouter = require('./Routes/AuthRouter');
const BookmarkRouter = require('./Routes/BookmarkRouter');

const PORT = process.env.PORT || 8080;

// test
app.get('/test', (req, res)=>{
    res.send('Testing..');
})

app.use(bodyparser.json());
app.use(express.json());

app.use(cors());
app.use('/auth', AuthRouter);
app.use('/bookmarks', BookmarkRouter);

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}...`);
})
