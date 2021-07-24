const User = require('../model/user')
var crypto = require("crypto");

const { sendSms } = require('../modules/sendSms')
const { tokenGen } = require('../modules/tokenGen')
const config = require('../config.json');

async function authUser(data) {
    let response = await User.find(data)
    if (response.length == 0) {
        let user = await User.find({ login: data.login })

        if (user.length == 0) {
            return false
        } else {
            user = user[0];
        }
        await User.findOneAndUpdate({ login: data.login }, {
            authNum: user.authNum + 1
        })
        setTimeout(() => {
            if (user.authNum == 3){
                User.findOneAndUpdate({ login: data.login }, {
                    authNum: 0
                })
            }
        }, 10000)
        return false
    } else {
        if (response.authNum > 3) {
            return false
        }
        let randomCode = Math.random().toString(36).substring(6);
        let updataData = await User.findOneAndUpdate(data, {
            tempCode: randomCode,
            authLive: Date.now() + 60000,
            authNum: 0,
        }, { new: true })
        sendSms(response[0].phone, randomCode)

        return true
    }
}


async function verefUser(data) {
    let response = await User.find(data)

    if (response.length != 0 && response[0].authLive > Date.now()) {

        let token = tokenGen(data.login)
        while (await User.find({ authToken: token }) != 0) {
            token = tokenGen(data.login)
        }
        await User.findOneAndUpdate(data, { authToken: token })
        return token;
    } else {
        return false
    }
}

async function getUserFromToken(token) {
    if (!token) {
        return false
    }
    let data = await User.find({ authToken: token })
    if (data === undefined) {
        return false
    } else {
        return data
    }
}
async function regenerateTempCode(login){
    let randomCode = Math.random().toString(36).substring(6);

    let response = await User.findOneAndUpdate({login:login}, {
        tempCode: randomCode,
        authLive: Date.now() + 60000,
    }, { new: true })
    sendSms(response.phone, randomCode)
    return response.authLive;
}



module.exports.authUser = authUser
module.exports.regenerateTempCode = regenerateTempCode
module.exports.verefUser = verefUser
module.exports.getUserFromToken = getUserFromToken
