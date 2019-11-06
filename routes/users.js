var express = require('express');
var router = express.Router();
const {STRIPE_SECRET_KEY} = require('../config/constants');
const stripe = require('stripe')(STRIPE_SECRET_KEY);
var debug = require('debug')('app:usersroute');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  res.render('users', {customers: []});
});

router.get('/all', async (req, res, next) => {
  try {
    const customers = await stripe.customers.list(
      { limit: 10 }
    );
    
    let subContent = [];
    const result = Object.assign({}, customers, {data: null});
    debug(result);
  
    if(customers && customers.data){
      subContent = customers.data.map(cus => {
        let subscriptions = [];
        if (cus.subscriptions && cus.subscriptions.data) {
          subscriptions = cus.subscriptions.data.map(sub => sub.id);
        }
        return {id: cus.id, email: cus.email, subscriptions, data: JSON.stringify(cus)}
      });
    }
  
    res.render('users', {customers: subContent});
  } catch (error) {
    next(error);
  }  
});

router.get('/:id/cancel', async (req,res,next) => {
  debug("Cancelling subscription for user: " + req.params.id);
  res.render('users', {message: "All Subscriptions cancelled for customer " + req.params.id});
})

router.get('/cancelsubscription/:subid', async (req,res,next) => {
  const subId = req.params.subid;
  debug("Cancelling subscription: " + subId);
  try {
    const result = await stripe.subscriptions.del(subId);
    debug(result)
    res.render('users', {message: `Subscription ${subId} cancelled`});
  } catch (error) {
    return next(error);
  }
})

module.exports = router;
