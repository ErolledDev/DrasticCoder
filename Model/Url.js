const {model,Schema} = require('mongoose');

const Url = new Schema({
    longUrl : {
        type : String,
        required:true
    },
    shortUrl : {
        type : String ,
        required : true
    },
    shortIdentity : {
        type : String ,
        required :true
    },
    password : {
        type : String
    }
}, {timestamps : true}
)

module.exports= model('Url',Url);