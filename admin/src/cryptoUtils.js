import keypair from "keypair";
import nodeRSA from "node-rsa";

// Define the public and private keys
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
    MIIBOwIBAAJBAMvK1LJ7bwihkocQQnx4i95eN5Rj1pAyfGhPnDEz2pHx/MFmYEGbGkP5LO3J
    Yjm3ilA8v/6qvbe0a79NS+TSbVkCAwEAAQJAL/5CfQ4IphW29kvj/IA/IE079ZxViXv6RG6L
    MCMwFDJmuRszrk4uXWtOXf8eoqr8SgoLgjC2UYFUz2ctFpV2oQIhAP+1c5wCbLVNU1ljbIoe
    M1F5kIVyVqL0ahPmZQJVdy4lAiEAzAY+Y57bHiUHoBmUzCKns6nAEu9hiAhlikrCVCV1GiUC
    IAGogpRra5sNYlH9FBIdOgX4PNiwsiEiZqG0Z8lJFpnFAiEAw0Uyj1xqcbaVTslNHfgJNC7C
    9ByC55TJwot85NaY9rUCIQCBb0F9E+yEYqftDhUulpJjenUQFmSYKnxDpdf+sJZsoQ==
    -----END RSA PRIVATE KEY-----`;

const pubKey = `-----BEGIN RSA PUBLIC KEY-----
    MEgCQQDLytSye28IoZKHEEJ8eIveXjeUY9aQMnxoT5wxM9qR8fzBZmBBmxpD+SztyWI5t4pQ
    PL/+qr23tGu/TUvk0m1ZAgMBAAE=
    -----END RSA PUBLIC KEY-----`;

// Function to encrypt a message
export function encryptMessage(text) {
    const cipher = new nodeRSA({ b: 512 });
    cipher.importKey(pubKey, "pkcs1-public");
    const encrypted = cipher.encrypt(text, "base64");
    return encrypted;
}

// Function to decrypt a message
export function decryptMessage(encryptedText) {
    const decipher = new nodeRSA(privateKey, "pkcs1");
    const decrypted = decipher.decrypt(encryptedText, "utf8");
    return decrypted;
}

// Example usage
// const text = { email: "djvndfkjsn@mdg/sdfsv", password: 'sfjndkjfndsfn' };
// const encrypted = encryptMessage(text);
// // console.log("encrypted: ", encrypted);

// const decrypted = decryptMessage("C7GIBT+L9IzzJMCWFG4cnR8Nm5b9a5kRZ6UuCxsq+KLpAKr2WzTLGhuK74Z6n3+hL4IZTaNF5WWiH0h5gBKMdalvKwHUV6hzgYbk0k0EQRMBgg+eyni10FKd8vGargJf3z9YbFz2qp/7HlYJuuAR4EammI+cAPi46mUgLYqIm0KDK7Q0Dm9TKc+S7CB1KgNJyurrTYRk4Z8ond4TpKzw8kSkPWE63NIbbj6uF7EJEdR7TSPw14TJrneQf2/aEpZbuzw2oVcXQ/wbzh/TDNPn9ZdHvU5GU3/rnC9WAt9zggOUI0lq/hkqyvzRnFvrIrDYIzOLsnRE4ATRoQIozzHapA==");
// console.log("decrypted: ", decrypted);
