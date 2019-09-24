# stripe-tests

Instructions
1. Setup https://ngrok.com/ to have a publicly available domain for the webhook to work.
2. Run ngrok to listen on port 3000
3. Replace success urls in code and webhook url in stripe dashboard (checkout settings) with the url from ngrok
4. Run nodejs service & go to the ngrok url
