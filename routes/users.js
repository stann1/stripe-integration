var express = require('express');
var router = express.Router();
const {STRIPE_SECRET_KEY} = require('../config/constants');
const stripe = require('stripe')(STRIPE_SECRET_KEY);
var debug = require('debug')('app:usersroute');

/* GET users listing. */
router.get('/', async (req, res, next) => {

  try {
    const customers = await stripe.customers.list(
      { limit: 10 }
      );
    //const subscriptions = [{id: 1, name: "name"}, {id: 2, name: "name2"}];
    let subContent = [];
    const result = Object.assign({}, customers, {data: null});
    debug(result);
  
    if(customers && customers.data){
      subContent = customers.data.map(s => JSON.stringify(s));
    }
  
    res.render('users', {customers: subContent});
  } catch (error) {
    next(error);
  }  
});

router.get('/:id/cancel', async (req,res,next) => {

  res.render('users', {message: "Subscription cancelled"});
})

module.exports = router;
