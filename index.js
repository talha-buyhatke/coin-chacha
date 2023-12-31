const express = require("express");
const fs = require("fs");
const app = express();
const port = 3600;
const crypto = require("crypto");
const path = require("path");
const https = require("https");
const dbHandle = require('./db.js');







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


app.post("/ngn/uploadTickerData", async (req, res) => {
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
async function getObj(coinName) {
    try {
        let tQ_sel = 'SELECT * FROM `onramp`.`exchange_table` WHERE coin_id=?';
        let res_sel = await dbHandle.commonQuery(tQ_sel, [coinName]);
        let finalObject = {};
        // console.log(res_sel[0].ex_name, res_sel[0].price);
        finalObject['coin_id'] = coinName;
        let min = null;
        for (let i = 0; i < res_sel.length; i++) {
            finalObject[res_sel[i].ex_name] = res_sel[i].price;
            if (min == null)
                min = parseFloat(res_sel[i].price);
            else if (min > parseFloat(res_sel[i].price))
                min = parseFloat(res_sel[i].price);
        }
        finalObject['price'] = String(min);
        return finalObject;
    }
    catch (e) {

    }
}
async function getAllObjects() {
    try {
        let coinsList = ['btc', 'eth', 'matic', 'xrp', 'shib', 'doge', 'usdt', 'bnb', 'sol', 'dot']
        let finalArray = [];
        for (let i = 0; i < coinsList.length; i++) {
            let objGet = await getObj(coinsList[i]);
            finalArray.push(objGet);
        }
        return finalArray;
    }
    catch (e) {
        console.log(e);
    }
}
app.get("/ngn/getCoins", async (req, res) => {
    try {
        let coins = await getAllObjects();
        return res.json({ status: 1, coins });
    } catch (error) {
        console.log("Error in getCoins", error);
        return res.json({ status: 0, msg: "Something went wrong!" });
    }
});







app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
