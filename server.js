const { json } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const shortId = require('shortid');
const validUrl = require('valid-url');

const app = express();
app.use(express.json())

const URL = require('./Model/Url');

// Connecting to DB
mongoose.connect('mongodb+srv://test:test@drasticcoder.sk0i8sj.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log('Connected to DB'))

const port = 3000;
app.listen(port,()=>{
    console.log(`Server is up and running on port : ${port}`);
})