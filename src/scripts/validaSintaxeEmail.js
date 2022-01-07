const validaSintaxeEmail = (email) => {
    console.log(email);

    let aux = email.indexOf('@');
    let gmail = email.slice(aux, email.length);
    
    if (gmail != "@gmail.com") {
        return false;
    } else {
        return true;
    }
}

module.exports = validaSintaxeEmail; 