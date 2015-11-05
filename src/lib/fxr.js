//simple node module
//converts USD to X currency - limited by API

//these are 'private' variables, can't be accessed directly by the app, only through
//our exported modules below
var dataAPIUrl = 'http://api.fixer.io/latest?base=USD'
  , exchangeRates = {
        'date':'2015-11-05',
        'rates': {
            'AUD': 1.3997,
            'BGN': 1.7971,
            'BRL': 3.8008,
            'CAD': 1.3158,
            'CHF': 0.99541,
            'CNY': 6.3461,
            'CZK': 24.85,
            'DKK': 6.854,
            'GBP': 0.65478,
            'HKD': 7.7507,
            'HRK': 6.9416,
            'HUF': 288.5,
            'IDR': 13555.0,
            'ILS': 3.8898,
            'INR': 65.892,
            'JPY': 121.89,
            'KRW': 1140.0,
            'MXN': 16.537,
            'MYR': 4.2985,
            'NOK': 8.5514,
            'NZD': 1.5115,
            'PHP': 46.905,
            'PLN': 3.8952,
            'RON': 4.0877,
            'RUB': 63.278,
            'SEK': 8.6296,
            'SGD': 1.4068,
            'THB': 35.562,
            'TRY': 2.8682,
            'USD': 1,
            'ZAR': 13.886,
            'EUR': 0.91886
        }
    };

function roundTwoDecimals(amount) {
    return Math.round(amount * 100) / 100;
};

//public functions
exports.convertCurrencyToUSD = function(amount, currency) {
    var amount = (isNaN(amount) || (amount < 0)) ? 0 : amount ;
    if (exchangeRates.rates[currency]) {
        return roundTwoDecimals(amount / exchangeRates.rates[currency]) ;
    } else {
        return 0.00;
    }
};

exports.convertUSDToCurrency = function(amount, currency) {
    var amount = (isNaN(amount) || (amount < 0)) ? 0 : amount ;
    if (exchangeRates.rates[currency]) {
        return roundTwoDecimals(amount * exchangeRates.rates[currency])
    } else {
        return 0.00;
    }
};