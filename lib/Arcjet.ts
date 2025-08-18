import arcjet, { tokenBucket } from "@arcjet/next";

const aj=arcjet({
    key:process.env.ARCJET_KEY ||"",
    characteristics:["userID"], //track based on clerk uSerId
    rules:[
        tokenBucket({
            mode:"LIVE",
            refillRate:10,
            interval:3600,
            capacity:10
        })
    ]
});

export default aj;
