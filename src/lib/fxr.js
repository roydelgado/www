// simple node module
// converts USD to X currency - limited by API
var http = require('http');

// these are 'private' variables, can't be accessed directly by the app, only through
// our exported modules below

// ""TODO"": create a cached json of the api and improve failed response handling
// and calculate from other currencies
var dataAPIUrl = 'http://api.fixer.io/latest?base=USD';

function roundTwoDecimals (amount) {
    return Math.round(amount * 1000) / 1000;
};

// public functions
exports.convertUSDToCurrency = function (amount, currency, cb) {
    var amount = (isNaN(amount) || (amount < 0)) ? 0 : amount;

    return http.get(dataAPIUrl, function (res) {
        var exchangeRates = '';

        res.on('data', function (data) {
            exchangeRates = JSON.parse(data);
        });

        res.on('end', function () {
            if (exchangeRates.rates[currency]) {
                //console.log('found currency exchange rate', currency, exchangeRates.rates[currency]);
                cb(roundTwoDecimals(amount * exchangeRates.rates[currency]));
            } else {
                cb("not available");
            }
        });
    });
};
