var crypto = require('crypto');
const config = require('../config.json');
function tokenGen(login){
    return `${login}${aesEncode(login+getRandomString()+getTimeStamp()+SHA256Encode(login+getRandomString()+getTimeStamp()))}`
}

function getTimeStamp(){
    return Date.now();
}

function getRandomString(){
    return crypto.randomBytes(20).toString('hex');
}

function aesEncode(text){
    var mykey = crypto.createCipher('aes-128-cbc', config.aesPass);
    var mystr = mykey.update(text, 'utf8', 'hex')
    mystr += mykey.final('hex');
    return mystr; //34feb914c099df25794bf9ccb85bea72
}

function aesDecode (text){
    var mykey = crypto.createDecipher('aes-128-cbc', config.aesPass);
    var mystr = mykey.update(text, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr; //text
}

function SHA256Encode(lines) {
    const hash = crypto.createHash('sha256');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim(); // Перерозпределения стороки
      if (line === '') continue; // строка не пустая
      hash.write(line); // перезаписал буфер
    }
  
    return hash.digest('base64'); // вернул хеш
  }
module.exports.tokenGen = tokenGen