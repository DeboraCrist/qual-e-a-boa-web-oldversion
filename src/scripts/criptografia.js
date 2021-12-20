const crypto = require("crypto");
const DADOS_CRIPTOGRAFAR = {
    algoritimo : "aes256",
    secreto : "chaves",
    tipo : "hex",
    codificacao: "utf8"
};

const criptografar = (senha) => {
    const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritimo, DADOS_CRIPTOGRAFAR.secreto);
    cipher.update(senha);
    return cipher.final(DADOS_CRIPTOGRAFAR.tipo);
}

const descriptografar = (senha) => {
    const decipher = crypto.createDecipher(DADOS_CRIPTOGRAFAR.algoritimo, DADOS_CRIPTOGRAFAR.secreto);
    decipher.update(senha, DADOS_CRIPTOGRAFAR.tipo);
    return decipher.final();
};

module.exports = {
    criptografar: criptografar,
    descriptografar: descriptografar
}