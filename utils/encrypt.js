const aes256 = require("aes256");
//the secret key used for encrypting and decrypting messages
const secret_key = "uI2ooxtwHeI6q69PS98fx9SWVGbpQohO";
//returns the encrypted text
exports.to_Encrypt = (text) => {
  const encrypted = aes256.encrypt(secret_key, text);
  return encrypted;
};
//welcome message is not decrypted
exports.to_Decrypt = (cipher) => {
  if (cipher.startsWith("Welcome")) {
    return cipher;
  }
  //decryped message is returned
  const decrypted = aes256.decrypt(secret_key, cipher);
  return decrypted;
};
