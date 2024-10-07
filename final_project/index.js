const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const secretKey = require('./router/auth_users.js').secretKey;

const app = express();

app.use(express.json());


app.use("/customer",session({
    secret:"fingerprint_customer",
    resave: true, 
    saveUninitialized: true,
    cookie: {maxAge: 60* 60* 1000} // Cookie expires in 1 hour
}))

app.use("/customer/auth/*", function auth(req,res,next){
    if (req.session.authorization) {
        let token = req.session.authorization['token'];
        console.log("Using Session ID: ", req.sessionID);
        console.log("Session details: ", req.session);

        jwt.verify(token, secretKey, (err, user) => {
            if (!err) {
                req.user = user;
                console.log("Authenticated token for: ", user);
                next(); 
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
