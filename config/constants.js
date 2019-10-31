var fs = require('fs');

const getSecretKey = () => {
    return fs.readFileSync("secret.key").toString();
}

module.exports = {
    STRIPE_SECRET_KEY: getSecretKey(),
    STRIPE_PUBLIC_KEY: "pk_test_OTiVCeCxAZjtkvoAG2kZ102S00hXMZ3ztu",
    PLANS: {
        Pro_Month: "plan_G51LZkrmacfT8p",
        Pro_Year: "plan_G5kyCpqeORB2Uh"
    }
};
