const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
const crypto = require("crypto");
const path = require("path");
const https = require("https");

const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Buyhatke@123',
    database: 'coin_chacha',
    connectionLimit: 10,
});

const connection = pool.promise();

// Check if the connection is established
async function checkConnection() {
    try {
        await connection.query('SELECT 1');
        console.log('Connection is established.');
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        connection.end(); // Close the connection
    }
}

checkConnection();






app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,mode,mac,epochtime"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
let key1 = "lkjlh419#JLK@KLSA"

async function getMac(message) {
    try {
        const secretKey = key1;

        const hmac = crypto.createHmac("sha512", secretKey);
        hmac.update(message);
        const mac = hmac.digest("hex");

        // console.log('MAC:', mac);
        return mac;
    } catch (err) {
        console.error("Error:", err);
        throw err;
    }
}




app.get("/", (req, res) => {
    res.send("Welcome to my server!");
});


app.post("/uploadTickerData", async (req, res) => {
    try {
        const data = req.body.data;
        const exchangeName = req.body.ex_name;
        const receivedMac = req.headers["mac"];
        const receivedTimeStamp = req.headers["epochtime"];
        const recreatedMac = await getMac("9h2f348f-293h49" + receivedTimeStamp);
        const now = Date.now();
        if (data && exchangeName && data.length > 0 && receivedMac == recreatedMac) {
            fs.writeFile(
                `tickerDump/${exchangeName + "__" + now.toString()}.txt`,
                data,
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.send({ status: 0, msg: "Error: could not create file" });
                    } else {
                        console.log("File created successfully! at " + now.toString());
                        return res.send({
                            status: 1,
                            msg: "Transaction File created successfully!",
                        });
                    }
                }
            );
        } else {
            res.send({ status: 0, msg: "Error1: Invalid Input" });
        }
    } catch (ee) {
        console.log("Error in uploadTickerData ", ee);
        return res.send({ status: 0, msg: "Something went wrong!" });
    }
});





app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
