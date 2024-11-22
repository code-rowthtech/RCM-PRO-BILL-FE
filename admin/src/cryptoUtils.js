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

// const decrypted = decryptMessage("Oskk0Wn9/sPjJKae4HeRA7FYNa/h7uMObHP2NXsNFWLVwHe2k+bMiqlUEYTV0DG6UXURr5Dx4NKJJPqco2oqdZ8DQWraInEbD0afd1faPeD4zahZyPRHVAgkci088Z4ljSobYrxner7fKEEKD0bm+ZAJSt5SG+F2lhQxtAYLdyNaLx8YNsWbZ1uncZu2NCA507ScUj0pdrXhyDzbT4V/QOD8BSLFylgYDFrPiSiC9jTHadPBgVLz4c9FsRm4OTWbh3X0qrUGzUuWqUq2G5bvefGmkrckCpUlyTeeauntuolUi+9A4o7sPuizk4qjRsuzesDGTNVy5mKlrOM8qbhm45xP5XgTiYCdJJAafVyR41pNHFoTU45wkeC5P629z1kTAQsim6DyI9gl4NhgZJshcGTkoVUFL7P9ZK6c/IFStH1DTDURg5TpVpIf6LFDl/kA/piny/ExjTYBOK5xhNWsM8irgQoOr118/Hno2gTw5xPyzgHGttED7tD61BcY7yUQ");
// console.log("decrypted: ", JSON.parse(decrypted));
