const jwt = require('jsonwebtoken');

const createToken = async () => {
    const token = await jwt.sign({_id: "6229df3f44aac2510df9783b"}, "mynameiskhanformkarakdoingnothingintheworld", {expiresIn: "1 seconds"});
    console.log(token);

    const userVerify = await jwt.verify(token, "mynameiskhanformkarakdoingnothingintheworld");
    console.log(userVerify);
}

createToken();
