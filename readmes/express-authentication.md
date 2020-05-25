# Authentication with Passport.js & JSON Web Tokens

## Learning Objectives

We will learn how to:

- implement signup and login functionalities for our `Express Recipes` API
- authenticate application users' requests using [Passport.js](passportjs.org) and [JSON Web Tokens](https://jwt.io/)

## Table of Contents

- [Passport.js Overview](#passportjs-overview)
- [JSON Web Tokens Overview](#json-web-tokens-overview)
- [Integrating Passport.js & JSON Web Tokens into Our API](#integrating-passportjs--json-web-tokens-into-our-api)
  - [Step 1: Install Dependencies](#step-1-install-dependencies)
  - [Step 2: Set up Files for User Authentication Routes](#step-2-set-up-files-for-user-authentication-routes)
  - [Step 3: Configure Passport.js Strategy](#step-3-configure-passportjs-strategy)
  - [Step 4: Create User Model Functions](#step-4-create-user-model-functions)
  - [Step 5: Create User Controller Functions](#step-5-create-user-controller-functions)
  - [Step 6: Create User Router Functions](#step-6-create-user-router-functions)
  - [Step 7 (**_CHALLENGE_**): Secure Recipe Routes](#step-7-challenge-secure-recipe-routes)
  - [Step 8: Test Privileged Routes with Postman](#step-8-test-privileged-routes-with-Postman)
  - [**_BONUS_**: Logout](#bonus-logout)
- [**_REVIEW_**](#review)
- [Additional Resources](#additional-resources)

## Passport.js Overview

From [Passport.js](http://www.passportjs.org/docs/):
"_Passport is authentication middleware for Node. It is designed to serve a singular purpose: authenticate requests. When writing modules, encapsulation is a virtue, so Passport delegates all other functionality to the application. This separation of concerns keeps code clean and maintainable, and makes Passport extremely easy to integrate into an application._

_In modern web applications, authentication can take a variety of forms. Traditionally, users log in by providing a username and password. With the rise of social networking, single sign-on using an OAuth provider such as Facebook or Twitter has become a popular authentication method. Services that expose an API often require token-based credentials to protect access._"

Passport.js offers a wide variety of authentication mechanisms (known as "strategies") as individually-packaged modules. Currently, more than [500 authentication strategies exist in the Passport.js ecosystem](http://www.passportjs.org/packages/). Strategies range from verifying a username and password, delegated authentication using OAuth or federated authentication using OpenID.

In this section, we'll be using the [Passport.js authentication strategy based on JSON Web Tokens](http://www.passportjs.org/packages/passport-jwt/) to add authentication to our `Express Recipes` API.

## JSON Web Tokens Overview

In [REST](https://restfulapi.net/) architectures, client-server interactions are stateless. The server does not store any history or state about the client session, as server-based sessions could be costly to implement and often don't scale well.

Rather, session state is stored on the client, and the client is responsible for transferring all the information needed to execute the request to the server.

[JWT (JSON Web Tokens)](https://jwt.io/) is a lightweight and secure approach to transferring state from the client to the server in a REST framework. JWT (pronounced "JOT") is an open-standard authentication strategy that relies on the exchange of [encoded and crytopgraphically signed JSON strings](https://jwt.io/introduction/) between client and server.

JWTs allow us to delegate authentication logic to an authorization server. In fact, we can delega login/signup of a cluster of applications to a single Authorization server.

To understand how JWT works, let's consider a typical login flow that uses JWT-based authentication:

![JWT-Based Authentication](../images/jwt-based-authentication.png)

1. The client makes a HTTP request to the authorization server, sending along the user's login credentials (e.g., email and password).

1. The authorization server validates the user's credentials. If authentication is successful, the server sends a JSON response to the client that includes a JWT access token.

1. The client receives the JWT and [stores it in the browser (e.g., cookie)](<https://blog.logrocket.com/jwt-authentication-best-practices/#:~:text=A%20JWT%20needs%20to%20be,storage%20(or%20session%20storage).>).

1. The next time the client makes a HTTP request to a route that requires authentication, it will first attach the JWT to the request's Authorization headers before sending the request to the application server.

1. On receiving the request, the application server extracts the JWT from the request and verifies the embedded signature. If the verification is successful, the server fulfills the request. Otherwise, the request is blocked and the user will receive an error denying their request to access the resource on the application server.

As you can see, the application server does not have to keep access tokens in-memory in between requests, so it can be `stateless`.

JWTs function like temporary user credentials so the user does not have to repeatedly provide their password to gain access to resources on a server.

Later on in the tutorial, we'll take a look at what a JWT access token actually looks like.

## Integrating Passport.js & JSON Web Tokens into Express Recipes API

Let's authenticate our users using JWT before allowing them access to privileged routes in our `Express Recipes` API!

We will use the `bcrypt` library to encrypt the user's password before storing it in the database. We will also use the popular `jsonwebtoken` library to generate and validate JWTs.

Additionally, we will install `passport` and `passport-jwt`, which is a library for implementing a Passport.js authentication strategy based on JSON Web Tokens.

You can either keep building on top of your code from the previous unit or work off of a fork of [this repo](https://github.com/intro-to-nodejs/express-recipes/tree/master).

For simplicity, we will implement the JWT authentication mechanism directly in the `Express Recipes` application server, rather than in a separate authorization server.

### Step 1: Install Dependencies

1. Navigate to your `express-recipes` folder.

1. Install the following dependencies:

   - [bcrypt](https://www.npmjs.com/package/bcrypt)
   - [express](https://expressjs.com/)
   - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
   - [passport](http://www.passportjs.org/)
   - [passport-jwt]()

   ```
   $ npm install --save bcrypt express jsonwebtoken passport passport-jwt
   ```

**_Here's a [commit](https://github.com/intro-to-nodejs/express-recipes/commit/5251fef98bca5d54dfbcc73601356bc3677dcbf0) showing the changes for Step 1_**

### Step 2: Set up Files for User Authentication Routes

1. In the [Express unit](/intro-to-express.md), we refactored our `Express Recipes` API by separating different parts of the code into a router, model, and controller based on their technical functions.

   Let's follow a similar pattern to organize our user authentication logic:

   ```
   $ touch src/routers/user.js src/models/user.js src/models/users.json src/controllers/user.js
   ```

1. Create a new folder to store middleware functions and within it, create a file called `auth.js`:

   ```
   $ mkdir src/middleware
   $ touch src/middleware/auth.js
   ```

   We will configure our Passport.js strategy in `src/middleware/auth.js` in a future step.

1. We will be storing our users in `src/models/users.json`. This is not a robust database solution since there's no built-in data validation, but it is sufficient for the purposes of this course!

   Add a user to the file to serve as an example of what an entry in the file might look like:

   `src/models/users.json`:

   ```json
   [
     {
       "id": 1,
       "name": "Hou",
       "email": "hou@mail.com",
       "password": "$2b$10$u2r3EK7.p4l9bzQd74nGNepvIHw5gF84j4Dy6/kJmtNR4OC.A5t5O"
     }
   ]
   ```

   Notice that the user's `password` is hashed, for security reasons. Later, we will see how we can use `bcrypt` to hash a user's password before storing it in our database.

1. Store our JWT-related configuration variables in a config file:

   `src/config/index.js`:

   ```js
   module.exports = {
     // JWT_SECRET will be used to create a signature for signing and validating the JWTs
     JWT_SECRET: '##%%MyS3cr3tK3Y%%##',
     JWT_SESSION: {
       // Since we are using JWTs, we don't need sessions, so we set it to false here. Otherwise, Passport.js will attempt to create a session.
       session: false,
     },
     // Expire tokens after a certain amount of time so users can't stay logged in forever
     JWT_EXPIRES_IN: 24 * 60 * 60,
   };
   ```

   We will use these variables later on to configure our Passport.js strategy.

   Your `src/` tree should look something like this:

    <img src="../images/src-file-structure.png" alt="src/ file structure" width="200" height="300"/>

**_Here's a [commit](https://github.com/intro-to-nodejs/express-recipes/commit/b207c2bf706bc088e92d86f71f8e52f62921ed4e) showing the changes for Step 2_**

### Step 3: Configure Passport.js Strategy

1. Before Passport.js can authenticate a request, we must set up the Passport.js authentication middleware and configure Passport.js to use the JWT authentication strategy:

   `src/middleware/auth.js`:

   ```js
   // import the libraries and classes we need
   const passport = require('passport');
   const { Strategy, ExtractJwt } = require('passport-jwt');

   const { JWT_SECRET, JWT_SESSION } = require('../config/');
   const { findUser } = require('../models/user');

   const secret = process.env.JWT_SECRET || JWT_SECRET;

   // Create a new instance of the JWT Passport.js strategy
   const strategy = new Strategy(
     // We pass an object literal as the first argument
     // to new Strategy to control how a token is extracted from the request
     {
       // Extract the 'bearer' token from the authorization header,
       // as the encoded JWT string is stored there
       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
       // A string for verifying the token's signature
       secretOrKey: secret,
     },
     async (jwtPayload, done) => {
       try {
         // jwtPayload contains the decoded JWT payload, which includes the user's id.
         // Find that user in the database
         const user = await findUser({ id: jwtPayload.id });

         if (!user) {
           const err = new Error('User not found');
           err.status = 404;
           throw err;
         }

         // done is an error-first callback with signature done(error, user, info)
         // pass the found user to the route handler
         done(null, user);
       } catch (error) {
         done(error);
       }
     }
   );

   // Register the strategy configured above so that Passport.js can use it authentication
   passport.use(strategy);

   // A middleware for initializing passport
   const initialize = () => {
     return passport.initialize();
   };

   // We'll add this middleware to privileged routes later on
   const authenticate = () => {
     return passport.authenticate('jwt', JWT_SESSION);
   };

   module.exports = {
     initialize,
     authenticate,
   };
   ```

1. In `src/index.js`, load the `auth` middleware when starting the server (see the commit below).

**_Here's a [commit](https://github.com/intro-to-nodejs/express-recipes/commit/50b54cbec247b5383088e7dd0cbebf946ec7784b) showing the changes for Step 3_**

### Step 4: Create User Model Functions

Create functions that create and authenticate users with JWT authorization tokens:

`src/models/user.js`:

```js
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const path = require('path');

const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/');
const usersFilePath = path.join(__dirname, './users.json');

// Authenticate the user and return an authorization token for the user.
// We will use this function later on to authenticate a user who's logging in.
const authenticateUser = async ({ id, email, password }) => {
  const user = await findUser({ email });
  // Hash the user's password and compare the result with the hash saved in the database to see if the password is correct.
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!user || !isPasswordValid) {
    throw new Error('Unable to login');
  }

  // Call jwt.sign, which returns an authentication token.
  // The first argument is an object that contains the data to
  // be embedded in the token. We can pass in a unique identifier for
  // the user, such as the user's id stored in the database
  // The second argument is a string, which could be any random series
  // of characters used to sign the token to ensure the token has not been tampered with
  // when it is sent back to the server later on
  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { token };
};

// Save the new user to the database and return an authorization token for the user
const createUser = async ({ email, name, password }) => {
  const data = await fs.readFile(usersFilePath);
  const users = JSON.parse(data);
  const user = await findUser({ email });

  if (user) {
    throw new Error('Email already exists!');
  }

  const newUser = {
    id: users.length + 1, // Not a robust database incrementor
    email,
    name,
    // Here, we pass the user's password to bcrypt's hash function to create a hash, which is stored in the database instead of the user's original password. Hashing is a one-way operation, so the hash cannot be reversed to its original form.
    // The first argument is the password to be encrypted, and the second argument is the number of salt rounds. The higher the number of salt rounds used, the stronger the resulting hashed password becomes
    password: await bcrypt.hash(password, 10),
  };

  // Generate the JWT with jwt.sign. The return value is an authentication token
  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN, // Currently set to expire in 24 hours
  });

  users.push(newUser);

  // save the new user to our database
  await fs.writeFile(usersFilePath, JSON.stringify(users));

  return { token };
};

const findUser = async ({ id, email }) => {
  const data = await fs.readFile(usersFilePath);
  const users = JSON.parse(data);

  const existingUser = users.find(
    user => user.id === id || user.email === email
  );

  return existingUser;
};

module.exports = {
  authenticateUser,
  createUser,
  findUser,
};
```

**_Here's a [commit](https://github.com/intro-to-nodejs/express-recipes/commit/d4b0c42efb1b665ac63cb62a70db10ccdc24711c) showing the changes for Step 4_**

### Step 5: Create User Controller Functions

1. Handle user signup and login:

   `src/controllers/user.js`:

   ```js
   const { createUser, authenticateUser } = require('../models/user');

   const handleSignup = async (req, res, next) => {
     try {
       // Create a new user and return a token to the client
       const { token } = await createUser(req.body);
       // Let's have our server issue a JWT to the client when a user signs up.
       res.json({ token });
     } catch (error) {
       next(error);
     }
   };

   const handleLogin = async (req, res, next) => {
     try {
       // Authenticate the user and return a token to the client
       const { token } = await authenticateUser(req.body);
       // Imagine if the user is required to provide their login credentials every time they want to access our coveted recipes. This would not be an ideal user experience.
       // Instead, let's have our server issue a JWT to the client when a user logs in.
       res.json({ token });
     } catch (error) {
       next(error);
     }
   };

   module.exports = {
     handleSignup,
     handleLogin,
   };
   ```

After the user signs up or logs in, the server returns a token to the client that the client can attach to any future requests that need to be authenticated.

**_Here's a [commit](https://github.com/intro-to-nodejs/express-recipes/commit/c5a1b6150aef734c8a6867c60a8ccf39cc9ffb80) showing the changes for Step 5_**

### Step 6: Create User Router Functions

1. Route the requests to the appropriate controllers:

   `src/routers/user.js`:

   ```js
   const express = require('express');
   const { handleSignup, handleLogin } = require('../controllers/user');
   const router = express.Router();

   router.post('/signup', handleSignup);
   router.post('/login', handleLogin);

   module.exports = router;
   ```

1. In `src/index.js`, mount the user authentication `/api/v1/users` routes.

**_Here's a [commit](https://github.com/intro-to-nodejs/express-recipes/commit/a85377641c6c09c7314e57770036427218ba52c0) showing the changes for Step 6_**

### Step 7 (**_CHALLENGE_**): Secure Recipe Routes

1. We can now make use of the `authenticate` middleware to restrict access to privileged operations the API. For example, to allow only authenticated users to create and save a new database, we can pass `authenticate` as the first argument to the `POST` handler:

   `src/routers/recipe.js`:

   ```diff
   + const auth = require('../middleware/auth');
   ...
   - router.route('/').get(getAllRecipes).post(saveRecipe);
   + router.route('/').get(getAllRecipes).post(auth.authenticate(), saveRecipe);
   ```

   **_CHALLENGE_**: Restrict any `PUT` and `DELETE` routes to authenticated users only.

**_Here's a [commit](https://github.com/intro-to-nodejs/express-recipes/commit/4924a35cd574e08b63b89420b686a4b69e96ad4b) showing the changes and solutions for Step 7_**

### Step 8: Test Privileged Routes with Postman

Test your API in Postman to ensure only authorized users can perform mutative database operations!

1. Send a request to the `POST /api/v1/recipes` route (remember to set the `Content-Type` in the Headers tab to `application/json`):

   ![POST request](../images/post-unauthorized.png)

   You should see an `Unauthorized` message if you tried to send the request above.

   Because `POST /api/v1/recipes` is now a protected route, we'd have to sign up for an account first before we can use this route!

1. Send a request to the `POST /api/v1/users/signup` route (remember to set the `Content-Type` in the Headers tab to `application/json`):

   ![POST signup](../images/post-signup.png)

   In the image above, you can see an access token is included in the response. That's our JWT!

   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTk0NTIxMDIwLCJleHAiOjE1OTQ2MDc0MjB9.pcdjNFwezYNdZTYjwWndGowLDkhjcl-debci5BLS8AY"
   }
   ```

   If you look carefully, you can see that a JWT is made up of three distinct parts separated by a period.

   - The first part (`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`) is the **_header_**, which is a base64-encoded JSON string that contains information about the type of token it is (i.e., JWT) and the algorithm that was used to generate it (i.e., `HS256`)

   - The second part (`eyJpZCI6MiwiaWF0IjoxNTk0NTIxMDIwLCJleHAiOjE1OTQ2MDc0MjB9`) is the **_payload_** or **_claims_**, which is also a base64-encoded JSON string that contains the data that we provided to create the token (i.e., `user.id`, expiry time)

   - The third part (`pcdjNFwezYNdZTYjwWndGowLDkhjcl-debci5BLS8AY`) is the **_signature_**, which is used to securely validate the token and is calculated using the encoded header, encoded payload, secret, and the algorithm specified in the header; this signature can only be created by somebody in possession of all four pieces of information.

   Head over to [base64decode.org](https://www.base64decode.org/) and decode the token:

   ![JWT Decoded](../images/jwt-decoded.png)

   As you can see, a JWT is not encrypted, so anybody who steals the token can still read its contents, so be careful not to put sensitive information in the payload!

   It's hard to tamper with a JWT, as long as the secret used for the signature is kept private. We use the exact same secret that the token was created with to validate it.

1. Send a request to the `POST /api/v1/recipes` route again, this time attaching the token to the Authorization headers as a Bearer Token.

   ![POST authorized](../images/post-authorized.png)

   You should see a `201 Created` message indicating successful recipe creation!

1. Test the `PUT` and `DELETE` routes.

### BONUS: Logout

A detailed discussion of token invalidation is outside the scope of this course. Take a look at [this article](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/#logout) if you're interested in learning more!

## **_REVIEW_**

- What is Passport.js?

- What is a JWT? Why are JWTs useful for implementing RESTful architectures?

- How can we secure user passwords in our backend?

## Additional Resources:

- [JSON Web Token Wikipedia](https://en.wikipedia.org/wiki/JSON_Web_Token)
- [JWT Authentication](https://blog.logrocket.com/jwt-authentication-best-practices/)
- [Session-Based Authentication](https://auth0.com/docs/sessions)
- [REST Architecture](https://restfulapi.net/)
- [Pros & Cons of JWTs](https://fusionauth.io/learn/expert-advice/tokens/pros-and-cons-of-jwts)
- [The Complete Guide to JSON Web Tokens](https://blog.angular-university.io/angular-jwt/)
- [The JWT Handbook](https://assets.ctfassets.net/2ntc334xpx65/o5J4X472PQUI4ai6cAcqg/13a2611de03b2c8edbd09c3ca14ae86b/jwt-handbook-v0_14_1.pdf)
