var context = require('rabbit.js').createContext('amqp://rabbitmq');

var messenger = {
    request: function (queue, data, callback) {
        var request = context.socket("REQ");
        console.log("sending request to " + queue);
        request.on("data", function (message) {
            console.log("data received");
            callback(JSON.parse(message));
        });

        request.connect(queue, function () {
            request.write(JSON.stringify(data), "utf8");
        })
    }
};

module.exports = messenger;