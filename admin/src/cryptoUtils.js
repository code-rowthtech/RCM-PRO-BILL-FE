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

// const decrypted = decryptMessage("abBibiEyoQQbxx80mfuB4pLcgipmBvIRyTkslrmdG2UqqysDFLpRlw4yQM1bkGxOmVq+wLnJZiONr6/mrFhduT+BLchCoYfqAu4alSAT8Xjl7pTMKl97KcQ1H4y2Ft2i7GdMsbtJ9BNP3zo44A0owWBwWVf2mKxtU7OLp0UMI3lJ18m9o5jfThZkeIjX0XEITPeUzsVoJ4Zy9RWucqbL1N75/hGVOBVM4s7FATAf2Jc97W/qV6JV0sg9iQ4LG1XXGwnYdqJGutwVF6jA1k2jqWbtgU+yZpoh4fi+JgjcSbx55PEDloZD3ork/vUJR9gVKgYZ9rmVSQNqABjbpjlpLSMvM1+Y0WbZgFk5+ORfkyDyYTo0EAWNppUIcGdlFaM98JhxHGnwGAVDt+YAqHZD57WQCdi7dNA/zg900DtfMMzCcJboe0rqQsNYhdnZNYWP/rfqbsNKTZyouaqb3U0freRmHrL6ZMI+IAwnNtnyvc4WoE4hbVvVHpZEJa0CLyQWTt599ouQ6jKRZ1GnumTUgecodSSoJNM7TG7aeVAvpgxckUlhDWraHsanwPF4OJh44hLsKM1n2ITpJw35vaL3UISZ2iGZ/2qqA4AtW6X6IB1qSML64d+hLqfIAQ6RA3d5Mv9dO3JQxturLZV/WkG8fzODV6ncodR42p6ytoRe6z9uHYWn8MaRRTC+1jmT66Br3rKc1ermFm6+zQSO31VsHMegcKhqAhUPiIcYoAxZtPGekEa3p7nWkXD4y62/koGBiL1s/gR3Hz7csI9jRe+2UM25UnRfu819h6jkyMYRD3soCOvRnhCMvMXnK5rQfL8EdSwhZsQdJE82tzmOH2k6L3tcqn80lP+racGv5iF0VJHz7sp+8WViHIAaADy0uWySh1pu1AtN3D3hU7VCJH6C228/JPKKkl9k7ZDRG0yw4XgfxI3Md3eE6Db827s+A/VB+ZdUH0LCi/PUOZw8jC78v5uoTdLNjVgcLi20zNluqk/zIzECMOK1qJPnebwrvBfTcvGwPcxmq5XywIXXc7b8O2Q7RjxVWd3K2NTZaDlv7Zcio8ZozYi5ODiN0ovMfJHhbbkS/W7jYZRklsbdbLMXDgsd1H4aJQC7/ollGEVYAIx6egP6gq1ptOuJpYJ9PqsyDNIercvReGp6NMuqdrobDhN1gqaoAUcxjfadW5DsjnJxp6MlRi9Rt+MEd3PhAX5wmPXX1wJ3w6FucH2uoMEe/Vb92IYITlk8P93HYPo+H4wB35Ffmf9O0vF1NkwFW0MOcxTGZWC+pnM9OxtyFR7SPKeczXKksjz9XtnDo8IdPHsV2K0lqbqdFzBo2sHABynTCDP8BuCZDEOrxqW6pfuL2sbi6pH2Zk78MjOP4YHbSDjjDNx0a8ZwZNs6iQg6cecC9S+N+5Df+i6+pS9gMtpxNgMsaupQTzpkxEN6YPUwduySGDO5Cgf82jurq09+8D5WNIzCqUsCJIsNGaDB488CATo0LBCqn2U2aXyotr6ylbWv0fa37NQbMMzKtvCGFSRECGepVzaqP+Ji0OtqB6SiW7giyA9Zlmv8Qct3lthnzOFUT8srF3BzKE1HBmnA9+c9Qd64bGorcgM9GJ9pj9gQzA0qJp3easxkqPXRDm85uBv7Dr4SFAr4brBysGYIMtvuXZfF5DC10oc8vS5nBS7/WX03/oaunGDdgM+k5rFN/4MPSQkohFIFdrNa/ltj4c7X3fqZuwJLmf6Sk2+T/yyCstn+DfeNM2h1P3KLVqrBKcriAs9mEoObtuYJJgwUvnnqZ9y2TEgZUJQYlaSSl912WxOejJN+Z5L5B9K+18vE7viEQRsTRrtzIQ/XhclI3YzHj2cRbWVMtynvriqqxBOsDL4L83vm1JEzBqspqswLq1FVvkRpk/4860ZIyCUur74FRrGhTJP1MDeFc1/6uRUxhdTo7PHUi7kafDl4vfFxEyU=");
// console.log("decrypted: ", JSON.parse(decrypted));
