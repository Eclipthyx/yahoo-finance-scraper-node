const fs = require('fs');
const getFullDate = require('./getFullDate.js');
const getStockPrice = require('./getStockPrice.js');
const getOptionsData = require('./getOptionsData.js');

var returnprice = function(arg_1){
    return getStockPrice.scrapeStock(arg_1).then(result => { return result } );
}

var returnprice2 = function(arg_1){
    return getOptionsData.scrapeContracts(arg_1).then(result => { return result } );
}
/*
returnprice('F').then(function(stockPrice) {
    var stockPrice = stockPrice;

    returnprice2('F').then(function(optionsData) {
        for(var i in optionsData[0]){
            var contractValue = stockPrice - optionsData[0][i];
            var contractPrice = optionsData[1][i];
            var difference = (stockPrice - optionsData[0][i])-optionsData[1][i];
            //console.log('Contract value:' + contractValue.toFixed(2));
            //console.log('Contract price:' + contractPrice.toFixed(2));
            console.log('Difference:' + difference.toFixed(2));

        }
    })
})
*/


returnprice('F').then(function(stockPrice) {
    var stockPrice = stockPrice;

    returnprice2('F').then(function(optionsData) {
        for(var i in optionsData[0]){

            var targetPrice = 7;//100
            var futureContractValue = targetPrice - optionsData[0][i];
            var contractCount = 100 / optionsData[1][i];

            var positionCost = contractCount * optionsData[1][i];
            var positionValue = contractCount * futureContractValue;
            //console.log('Contract value:' + contractValue.toFixed(2));
            //console.log('Contract price:' + contractPrice.toFixed(2));
            //Always buy 100$ worth of contracts, future intrinsic is value of position at expiration at target price.
            console.log('Strike:' + optionsData[0][i] + ' Future intrinsic value:' + positionValue.toFixed(2));

        }
    })
})

/* Check if there is arbitrage opportunity. Price < 0? Yes
returnprice('F').then(function(stockPrice) {
    var stockPrice = stockPrice;

    returnprice2('F').then(function(optionsData) {
        for(var i in optionsData[0]){

            var targetPrice = 10;//100
            var futureContractValue = targetPrice - optionsData[0][i];
            var contractCount = 100 / optionsData[1][i];

            var positionCost = (stockPrice - (parseFloat(optionsData[0][i]) + parseFloat(optionsData[1][i]))) * 100;
            var positionValue = contractCount * futureContractValue;
            //console.log('Contract value:' + contractValue.toFixed(2));
            //console.log('Contract price:' + contractPrice.toFixed(2));
            console.log('Strike:' + optionsData[0][i] + ' Price:' + positionCost.toFixed(2) + ' Future intrinsic value:' + positionValue.toFixed(2));

        }
    })
})
*/

/*
fs.appendFile('log.csv', result + "," + getFullDate.getFullDate(), function (err) {
    if (err) {
    console.log('fail'); //fail
    } else {
    // done
    }
})
console.log(getFullDate.getFullDate());
*/