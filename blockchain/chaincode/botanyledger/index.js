'use strict';

const HerbBatchContract = require('./contracts/HerbBatchContract');
const ProductBatchContract = require('./contracts/ProductBatchContract');

module.exports.HerbBatchContract = HerbBatchContract;
module.exports.ProductBatchContract = ProductBatchContract;
module.exports.contracts = [HerbBatchContract, ProductBatchContract];
