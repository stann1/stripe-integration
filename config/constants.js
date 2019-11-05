var fs = require('fs');
const DEFAULT_PUBLIC_URL = "https://fd7bf1bc.ngrok.io";

const getSecretKey = (name) => {
    if(name === "stripe" && fs.existsSync("secret.key")){
        return fs.readFileSync("secret.key").toString();
    } else if(name === "stripe-webhook" && fs.existsSync("webhook.secret.key")){
        return fs.readFileSync("webhook.secret.key").toString();
    }

    return null;
}

module.exports = {
    STRIPE_SECRET_KEY: getSecretKey("stripe"),
    STRIPE_WEBHOOK_KEY: getSecretKey("stripe-webhook"),
    STRIPE_PUBLIC_KEY: "pk_test_OTiVCeCxAZjtkvoAG2kZ102S00hXMZ3ztu",
    PUBLIC_URL: process.env.NGROK || DEFAULT_PUBLIC_URL,
    PLANS: {
        Pro_Month: "plan_G51LZkrmacfT8p",
        Pro_Year: "plan_G5kyCpqeORB2Uh"
    },
    DEFAULT_PUBLIC_URL
};
