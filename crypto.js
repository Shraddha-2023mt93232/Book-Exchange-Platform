// Encrypt the data
const CryptoJS = require('crypto-js');

const key = "FASDAssignment";
const encryptedData = (data) => {
    return CryptoJS.AES.encrypt(data, key).toString();
}

// Decrypt the data
const decryptedData = (data) => {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}

module.exports = {encryptedData,decryptedData};
