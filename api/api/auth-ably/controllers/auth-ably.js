'use strict';

const Ably = require('ably/promises');
const ABLY_API_KEY = process.env.ABLY_API_KEY;

const realtime = Ably.Realtime({
    key: ABLY_API_KEY,
    echoMessages: false
});

 
module.exports = {
    async auth(ctx) {
        const clientId =  'id-' + Math.random().toString(36).substr(2, 16)
        const tokenParams = { clientId };
        try {
            const ablyThing = await realtime.auth.createTokenRequest(tokenParams);
            console.log(ablyThing)
            return ablyThing
        }
        catch (err) {
            return ctx.badRequest("Daas not good!!")
        }
    }
};