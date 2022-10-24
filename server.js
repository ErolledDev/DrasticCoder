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

// Routes
app.post('/',(req,res)=>{
    const link = req.body.url;
    const ID = shortId.generate()

    const SHORT_ID = new URL({
        longUrl:link,
        shortUrl:`http://localhost:3000/${ID}`,
        shortIdentity:ID,
        date:Date.now()
    })    
    SHORT_ID.save((error,results)=>{
        if(error){
            res.status(500).json('something went wrong...');
        }else{
            if (validUrl.isUri(link)) {
                if(SHORT_ID.shortUrl.length<SHORT_ID.longUrl.length){
                    res.status(200).json(SHORT_ID)
                }else{
                    res.status(401).json('URL is already shorter')
                }
            }else{
                res.status(401).json('Please check the URL')
            }
        }
    })

})

app.get('/',(req,res)=>{
    try {
        URL.find({},(error,urls)=>{
            if(!error){
                res.status(200).json(urls)
            }else{
                console.log(error)
            }
        })
    } catch (err) {
        console.log(err);
    }
})

app.get('/:id',async(req,res)=>{
    try {
        const foundURL = await URL.findOne({shortIdentity:req.params.id});
        if(!foundURL){
            res.status(404).json('URL not found...!');
        }else{
            res.status(200).json(foundURL)
        }
    } catch (err) {
        console.log(err);
    }
})

const port = 3000;
app.listen(port,()=>{
    console.log(`Server is up and running on port : ${port}`);
})