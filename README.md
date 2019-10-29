# stripe-tests

Instructions
1. Create a 'secret.key' file in the root folder and copy your stripe secret key
2. Setup https://ngrok.com/ to have a publicly available domain for the webhook to work.
3. Run ngrok to listen on port 5000
4. Replace success urls in code and webhook url in stripe dashboard (checkout settings) with the url from ngrok
5. Run nodejs service & go to the ngrok url
