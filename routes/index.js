var express = require('express');
var router = express.Router();
var debug = require('debug')('app:indexroute');
var debugWebHook = require('debug')('app:webhook');
const {STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY, PLANS, STRIPE_WEBHOOK_KEY, PUBLIC_URL} = require('../config/constants');
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');

/* GET home page. */
router.get(['/','/index'], function(req, res) {
  res.render('index', { title: 'Stripe test', key: STRIPE_PUBLIC_KEY, plan: PLANS.Pro_Month, redirectTo: PUBLIC_URL });
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
  const {session_id} = req.query;
  res.render('success', {session: session_id});
});

router.get('/cancel', function(req, res) {
  res.render('cancel');
});

router.get('/checkout/pro', async (req, res) => {
  const {period, custmail, custId} = req.query;
  debug("query param: " + period || "none");
  
  let plan = PLANS.Pro_Month;
  if(period && period.toLowerCase() === "year"){
    plan = PLANS.Pro_Year;
  }

  const stripeSession = {
    payment_method_types: ['card'],
    subscription_data: {
      items: [{
        plan: plan
      }],
      metadata: {
        subscriptionData: 'subscriptionData'
      }
    },
    client_reference_id: 1111,
    success_url: `${PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${PUBLIC_URL}/cancel`,
  };

  if(!custId){
    debug("Creating session for new customer: " + custmail);
    stripeSession.customer_email = custmail;
  } else{
    debug("Creating session for existing customer: " + custId);
    stripeSession.customer = custId;
  }

  const session = await stripe.checkout.sessions.create(stripeSession);
  return res.json(session);
});

router.post('/webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    debug("Webhook origin: ", req.headers['referer'] || req.headers['origin']);
    debug("Webhook remote addr: ", req.socket.remoteAddress);
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_KEY);
      debugWebHook(event.type)
    } catch (err) {
      debugWebHook(err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Fulfill the purchase...
      debugWebHook(session);
    }
    
    // Return a response to acknowledge receipt of the event
    res.json({received: true});
  }
);

module.exports = router;
