const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV0xNL1h4YUd3aFFBdkZsWmV0dk5Ob3pqYkxEb0t1d1YxdWNiWVJwNTdHOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ1g5VjByaUNiQmZqWmxUU0M3THptejdEVjFEaUgrdTZCZzJOMkgwZUhoWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJJTHpRWTBNNjFaVUlNRjFEcFhJczV4Qk9mYnB0TlRHMUFaZGQ4Z1cxNDI4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJvRDhJTkhjOEFkSWRqL3p3bmh4T09LOEkyNUhjWFJ6NDhNMlIwZDNLZ0hFPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjZHZTg3cEN4aHcvUTVXb2pudEo4cjVyYXJEQjNwS0lHV0VubEExK2RvSDA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlZQbHV0aXpqT0RmdGJ3UWRuVExNSmJ4TTlOQXd4SzNNOWU3T2Q4TVdJbFE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU0hReE8vcEhZWTFkakpaSlBOZG1WY1EvczM1ZFYzUk9zMER6R1NXejJsaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYy9zVzdzendVWUpVRGZFNW8vZ1pETExHMkZQaGJPakxDWFJ4SVUyNDVoND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ii9qcHpyOVNmanAxanIwVGFGTG55M3ZUV2V0MG03bjRzWWlEVjB0ZDBlay9HaWtvRWxLWlNFQnJNZTI1SDh5T2xlVUlRcGpQMFpBRExvN2krVDJVNWhRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjMxLCJhZHZTZWNyZXRLZXkiOiI5L0tOU1k5L25Lb1VVTkpDMFlvRkY5UTVJUU9DM2xPYkJiMkpvNGpmeGdrPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJtQ0lUZFhicFNTNklsRlFUclR3WW9RIiwicGhvbmVJZCI6IjQ2YTljY2U3LTIxY2YtNGZmMi05MjQ1LWU2ZThlMTMzYmYxZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrZXBTVVF5azJwTjFnNlBSY3VuanhaMkdQdVU9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU2Y4Vjd5Q1h5dFR5TWpxSWFIUlA5RTF5ejAwPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjFDUUZRQ0xaIiwibWUiOnsiaWQiOiI5NDc3MTc3ODA2MDozM0BzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJ+8J2Zg/CdmLzwnZmN8J2ZjvCdmYPwnZi88J2ZifCdmLzDlyJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTnFUcU80QkVMV21wclFHR0FnZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoieXZYWk5iSFlldnBZQU11NXJXTUtOY09TeVFqOW1mM3JxcC8yanc4Q2YxVT0iLCJhY2NvdW50U2lnbmF0dXJlIjoia3pWVUQxVkdVWVJ5WFpwNXZxajBxUDJ6M2I5NG1nSWpJT0MrT2Y0eTl3UXUvYjJjQVZsR3lUNjBqNWFqcExkelJDTnZ4R0hrRG1lQkZjM2ZPKy9wQ3c9PSIsImRldmljZVNpZ25hdHVyZSI6Ik85VUZlOWNMZ29iYUhmYkYyNERPWFVHaTNzckR5cXlVN29SYlo5Y09oUXpwLzhORkxRKzBITlZYQUhHa0tVU0tZdjFadXRFK3VrbTI1d2lweE42K2pBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3NzE3NzgwNjA6MzNAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCY3IxMlRXeDJIcjZXQURMdWExakNqWERrc2tJL1puOTY2cWY5bzhQQW45ViJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyMDI5MjE2Mn0=',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "ʜᴀʀꜱʜᴀɴᴀ",
    NUMERO_OWNER : process.env.OWNER_NUMBER || "94771778060",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'BMW MD',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || '',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/071f797dda6aef5ae3877.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

