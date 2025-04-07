const express = require('express');
const mongoose = require('mongoose');
const shortId = require('shortid');
const validUrl = require('valid-url');
const path = require('path');
const ejs = require('ejs');

const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Set strictQuery to handle deprecation warning
mongoose.set('strictQuery', false);

const app = express();
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const URL = require('./Model/Url');

// Connecting to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to DB'))
    .catch(err => console.error('Could not connect to DB:', err.message));

// Routes
app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/add",(req,res)=>{
    res.render("add",{message:""});
})

app.get('/add-link', async(req, res) => {
    let {url,identifier,password } = req.query;

    let message="123";

    if (!url) {
        message = "Please enter a valid URL"
    }

    // if (validUrl.isUri(url)) {
    //    return res.status(401).json('Please check the URL')
    // }
    
    if(identifier){
        URL.findOne({ shortIdentity: identifier }, (error, result) => {
            if (result) {
                message = "short link already exists"
                // return res.status(401).json('short link already exists')
            }
        })
    } else {
        const ID = shortId.generate()
        identifier = ID
    }

    const _url = {
        longUrl: url,
        shortUrl: `${process.env.BACKEND_URL}/${identifier}`,
        shortIdentity: identifier,
    }

    if(password){
        _url.password = password
    }

    const result = await URL.create(_url);
    
    if(result){
        message = "link generated successfully"
        //    return res.status(200).json({message:"link generated successfully",result})
    } else{
        message = "something went wrong..."
        // return  res.status(500).json('something went wrong...')
    }
    
    return res.render("add",{message})
})

// TODO: edit route
app.post('/edit/:id', async(req, res) => {
        const id = req.params.id;
        const pass = req.query.password;
    
        const foundURL = await URL.findOne({ shortIdentity: id });
    
        if (!foundURL) {
            return res.status(401).json('Please enter a valid URL')
        }
       if(foundURL.password == pass){
            return res.render("edit")
       } else {
            return res.status(401).json('Please enter a valid password')
       }
    })

app.get('/:id', async (req, res) => {
    try {
        const foundURL = await URL.findOne({ shortIdentity: req.params.id });
        if (!foundURL) {
            res.redirect("/");
        } else {
            res.redirect(foundURL.longUrl)
        }
    } catch (err) {
        console.log(err);
    }
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is up and running on port : ${port}`);
})