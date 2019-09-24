var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_bPXCK9ZvhJDyUyi8aeaJI0TO003OIZU5lt');
const bodyParser = require('body-parser');
const webhookSecret = 'whsec_vRCUHhQHR3aWVvQGyMARCm2WhTUy6qXi';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'stripe test' });
});

router.get('/success', function(req, res, next) {
  res.render('success');
});

router.get('/cancel', function(req, res, next) {
  res.render('cancel');
});

router.get('/checkout/pro', async (req, res, next) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    subscription_data: {
      items: [{
        plan: 'plan_Fq4spnr9HbkzQI'
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
    
    console.log(event);
    
    // Return a response to acknowledge receipt of the event
    res.json({received: true});
  }
);

module.exports = router;
