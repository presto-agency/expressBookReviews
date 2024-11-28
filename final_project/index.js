const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const {JWT_SECRET_KEY} = require('./utils/constants');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next){
	try {
		if (res.session?.authorization) {
			const token = req.session.authorization['accessToken']
			
			jwt.verify(token, JWT_SECRET_KEY, (error, user) => {
				if (!error) {
					req.user = user;
          next();
				} else {
					return res.status(403).json({ message: 'User not authenticated!' });
				}
			})
		} else {
			return res.status(403).json({ message: 'User not logged in!' });
		}
	} catch (error) {
		console.log(`Authorization error: ${error}`)
		res.status(403).json({ error: error.message })
	}
});
 
const PORT =4000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
