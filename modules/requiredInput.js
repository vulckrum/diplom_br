const User = require('../model/user')
async function validate (data,reqArray,type){
    let error = [];
    reqArray.map((element)=>{
        if(Object.keys(data).includes(element)){
            let emptyValidate = notEmpty(data,element);
            if(!(emptyValidate == true)){
                error.push(emptyValidate)
            }
        } else {
            error.push(`${element} is not exist`)
        }
    })
    if(type == 'register'){
        if(await loginFree(data.login) == false){
            error.push(`Login buzy`)
        }
    }
    if(error.length == 0){
        return {
            result:true
        }
    }else{
        return {
            result:false,
            errors:error
        }
    }

}
function notEmpty(data,key){
    let info = data[key]
    if(info == null || info == undefined || info == 'null' || info == 'undefined' || info == ''){
        return `${key} is empty`
    }else{
        return true
    }
}
async function loginFree(Userlogin){
    let req = await User.find({login:Userlogin})
    if(req.length == 0){
        return true
    }else{
        return false
    }
}
module.exports.validate = validate