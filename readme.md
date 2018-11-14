## Startup steps:

1. run command from terminal
   node init_env.js

2. update file api\_keys/\_key\_mailgun.json with keys (sandboxid, token_pub, token_sec)

3. update file api\_keys/\_key\_stripe.json with keys (token_pub, token_sec)

4. create folder https and provide files cert.pem and key.pem

5. review and update lib/config.js file

6. run command from terminal
   node index.js

## The API routes:

* POST host:3000/login - application/json
   * body
      * email, string
      * password, string

   * response-body
      * email, string
      * id, string(20)
      * expires, number

* PUT host:3000/login - application/json
   * body
      * token, string(20)
      * extend, boolean

   * response-body
      * email, string
      * id, string(20)
      * expires, number

* DELETE host:3000/logout
   * query string
      * id, string(20)

* POST host:3000/users - application/json
   * body
      * fullname, string
      * email, string
      * address, string
      * password, string

* PUT host:3000/users - application/json
  * header
      * token, string(20)
  * body
      * fullname, string
      * email, string
      * address, string
      * password, string

* GET host:3000/users - application/json
  * header
      * token, string(20)
  * response-body
      * fullname, string
      * email, string
      * address, string
      * password, string

* DELETE host:3000/users - application/json
   * header
      * token, string(20)

* GET host:3000/offer
   * header
      * token, string(20)
   * response-body
      * array[object<catalog>]

* POST host:3000/shopping - application/json
   * header
      * token, string(20)
   * body
      * id, string(3) [100-122, 500]
   * response-body
      * object<Cart>
         * totalPrice, number
         * totalCount, number
         * cartItems, Array[object<CartItem>]
            * id, string(3)
            * name, string
            * mixtureCzech, string
            * mixtureEnglish, string
            * price, number

* GET host:3000/shopping
   * header
      * token, string(20)
   * response-body
      * object<Cart>
         * totalPrice, number
         * totalCount, number
         * cartItems, Array[object<CartItem>]
            * id, string(3)
            * name, string
            * mixtureCzech, string
            * mixtureEnglish, string
            * price, number

* DELETE host:3000/shopping
   * header
      * token, string(20)

* POST host:3000/checkout
   * header
      * token, string(20)


## The API documentation (POSTMAN):

https://www.getpostman.com/collections/2b52ea559d7b02b6ae8e

https://documenter.getpostman.com/view/2851355/RzZAme6k

## The Assignment (Scenario):

You are building the API for a pizza-delivery company. Don't worry about a frontend, just build the API. Here's the spec from your project manager:

1. New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.

2. Users can log in and log out by creating or destroying a token.

3. When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system).

4. A logged-in user should be able to fill a shopping cart with menu items

5. A logged-in user should be able to create an order. You should integrate with the Sandbox of Stripe.com to accept their payment. Note: Use the stripe sandbox for your testing. Follow this link and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working: https://stripe.com/docs/testing#cards

6. When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this. Note: Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account

Important Note: If you use external libraries (NPM) to integrate with Stripe or Mailgun, you will not pass this assignment. You must write your API calls from scratch. Look up the "Curl" documentation for both APIs so you can figure out how to craft your API calls.

This is an open-ended assignment. You may take any direction you'd like to go with it, as long as your project includes the requirements. It can include anything else you wish as well.

P.S. Don't forget to document how a client should interact with the API you create!
