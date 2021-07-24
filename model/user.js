const { Schema, model } = require('mongoose')
const schema = new Schema({
    login: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    authToken:{
        type: String,
        required:true,
        default:null
    },
    tempCode:{
        type: String,
        required:true,
        default:null
    },
    authLive:{
        type: Number,
        required:true,
        default:null
    },
    userName:{
        type: String,
        required:true,
        default:null
    },
    authNum:{
        type: Number,
        required:true,
        default:0
    }
})
module.exports = model("User", schema)