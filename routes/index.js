const { Router } = require("express");

const {validate}= require('../modules/requiredInput') 
const {authUser,verefUser,getUserFromToken,regenerateTempCode}= require('../modules/auth') 
// const {}= require('../modules/auth') 
const {extractCookies}= require('../modules/cookie') 

const schema = require('../model/user')

const User = require('../model/user')

const fs = require('fs');
const { cookie } = require("request");
const route = Router();

route.get('^/$|/home', async (req, res) => {
    let returnUser = await getUserFromToken(extractCookies(req.headers.cookie).authToken)
    res.render('home',{
        title:'home',
        returnUser,
        error:null
    })
});

route.get("/register", async(req, res) => {
    res.render('register',{
        title:'Main',
        error:null
    })
})

route.post("/register", async(req, res) => {
    let validateRez= await validate(req.body,['login','password','phone','name'],'register')
    
    if(validateRez.result){
        let user = new User({
            login: req.body.login,
            password: req.body.password,
            phone: req.body.phone,
            userName: req.body.name,
            authToken:"null",
            tempCode:"null",
            authLive:0,
            authNum:0,
        })
        await user.save()
        res.redirect('/login')
    }else{
        res.render('register',{
            title:'Main',
            error: validateRez.errors
        })
    }
    
})

route.get("/login", async(req, res) => {
    res.render('login',{
        title:'Login',
        error:null
    })
})
route.post("/login", async(req, res) => {
    let validateRez = await validate(req.body,['login','password'])
    if(validateRez.result){
        let data = await authUser(req.body);
        if(data == false){
            res.render('login',{
                title:'login',
                error: ['Login or password is invalid']
            })
        }else{
            res.render('login2',{
                title:'login 2 step',
                error: null,
                data: req.body
            })
        }
    }else{
        res.render('login',{
            title:'login',
            error: validateRez.errors
        })
    }
})
route.post('/veref',async (req,res)=>{
    let validateRez= await validate(req.body,['login','password',"tempCode"])
    
    if(validateRez.result){
        let result = await verefUser(req.body);
        if(result != false){
            res.cookie('authToken',result)
            res.redirect('/profile')
        }else{
            res.render('login2',{
                title:'login',
                error: ['code is Invalide'],
                data:req.body
            })
        }
    }else{
        res.render('login2',{
            title:'login',
            error: validateRez.errors,
            data:req.body
        })
    }
})

route.get('/logout', (req, res)=>{
    res.cookie('authToken','')
    res.redirect('/');
});

route.get("/profile", async(req, res) => {
    console.log(req.headers.cookie)
    let userData = await getUserFromToken(extractCookies(req.headers.cookie).authToken)
    // let result = await User.find({authToken})
    console.log(userData)
    if(userData === false){
        res.redirect('/register')
    }else{
        res.render('profile',{
            title:'Main',
            userData:userData[0],
            error:null
        }) 
    }
});
route.post("/regenTempCode", async(req, res) => {
    let validateRez= await validate(req.body,['login']);
    console.log(req)
    if(validateRez.result){
        res.status(200);
        regenerateTempCode(req.body.login);
    }else{
        res.status(500);
    }
    res.send(validateRez)
});
module.exports = route