var express = require('express');
var router = express.Router();
var debug = require('debug')('app:indexroute');
const {STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY, PLANS} = require('../config/constants');
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const webhookSecret = 'whsec_vRCUHhQHR3aWVvQGyMARCm2WhTUy6qXi';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'stripe test', key: STRIPE_PUBLIC_KEY, plan: PLANS.Pro });
});

router.get('/test', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'eur',
    payment_method_types: ['card'],
    receipt_email: 'jenny.rosen@example.com',
  });

  debug("Test success");
  res.json(paymentIntent);
})

router.get('/success', function(req, res) {
  res.render('success');
});

router.get('/cancel', function(req, res) {
  res.render('cancel');
});

router.get('/checkout/pro', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    subscription_data: {
      items: [{
        plan: PLANS.Pro
      }],
      metadata: {
        subscriptionData: 'subscriptionData'
      }
    },
    client_reference_id: 1111,
    success_url: 'https://68d14cdc.ngrok.io/success',
    cancel_url: 'https://68d14cdc.ngrok.io/cancel',
  });
  return res.json(session);
});

router.post('/webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    debug(event);
    
    // Return a response to acknowledge receipt of the event
    res.json({received: true});
  }
);

module.exports = router;
