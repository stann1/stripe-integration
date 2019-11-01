# stripe-tests

Instructions
1. Create a 'secret.key' file in the root folder and copy your stripe secret key. If using webhook, create a 'webhook.secret.key' and copy the corresponding key 
2. Setup https://ngrok.com/ to have a publicly available domain for the webhook to work.
3. Run ngrok to listen on port 5000
4. Replace success urls in code and webhook url in stripe dashboard (checkout settings) with the url from ngrok
5. Run nodejs service & go to the ngrok url
6. For test payments - use one of Stripe’s test cards with any three-digit CVC code and an expiration date that’s in the future:
- To demo, use the U.S. test card number 4242 4242 4242 4242 or any other Stripe test card number.
- To test 3D Secure authentication, use 4000 0000 0000 3220.
