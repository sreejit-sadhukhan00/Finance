import arcjet, { tokenBucket } from "@arcjet/next";

const aj=arcjet({
    key:process.env.ARCJET_KEY ||"",
    characteristics:["userID"], //track based on clerk uSerId
    rules:[
        tokenBucket({
            mode:"LIVE",
            refillRate:40,
            interval:3600,
            capacity:40
        })
    ]
});

export default aj;
