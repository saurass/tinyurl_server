const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ( {host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, ns: "rsmq"} );
const queuename = process.env.CLICK_TRACK_QUEUE_NAME;

exports.push = (msg) => {
    rsmq.sendMessage({ qname: queuename, message: msg.toString()}, function (err, resp) {
        if (err) {
            console.error(err)
            return
        }
    });
}