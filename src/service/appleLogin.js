const models = require('../models');
const User = models.User;
const axios = require('axios');
const queryString = require('query-string');
var rand = require('csprng');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require("fs");

const JWT_SECRET = process.env.JWT_SECRET;
const clientId = process.env.APPLE_CLIENT_ID;

const keyId = process.env.APPLE_PN_KEY_ID;
const teamId = process.env.APPLE_TEAM_ID;
const keyPath = process.env.KEY_PATH;

const createJwt = (user) => {
  const jwtToken = jwt.sign({
      id: user.dataValues.id,
      firstName: user.dataValues.firstName,
      email: user.dataValues.email,
      tokenString: user.dataValues.tokenString
  }, JWT_SECRET);
  return jwtToken
}

getClientSecret = () => {
  const privateKey = fs.readFileSync(keyPath);
  const token = jwt.sign({}, privateKey, {
    algorithm: "ES256",
    expiresIn: "2 days",
    audience: "https://appleid.apple.com",
    issuer: teamId, 
    subject: clientId, 
    keyid: keyId
  });
  return token;
}

module.exports = {
    authApple: async (req, res) => {
        const bearerHeader = req.headers["authorization"];
        var bearerToken;
        
        if (typeof bearerHeader !== 'undefined') {
          const bearer = bearerHeader.split(" ");
          bearerToken = bearer[1];
        }
        
        const clientSecret = getClientSecret();
        const requestBody = {
          grant_type: 'authorization_code',
          code: bearerToken,
          client_id: CLIENT_ID,
          client_secret: clientSecret
        }
        
        try {
          const response = await axios.request({
            method: 'POST',
            url: 'https://appleid.apple.com/auth/token',
            data: queryString.stringify(requestBody),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          })

          tokenString = rand(160, 36);
          var user = {};
          user = await User.findOne({
            where: {
              [Op.or]: [
                {id: req.body.id},
                {email: req.body.email}
              ]
            }
          })
        
          if (user) {
            await user.update({
                tokenString: tokenString,
            })
            if (user.deviceToken != req.body.deviceToken) {
              await user.update({
                  deviceToken: req.body.deviceToken
              })
            }
          }
          else {
            user = await User.create({
                id: req.body.id,
                deviceToken: req.body.deviceToken,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                tokenString: tokenString
            })
          }

            const token = createJwt(user);
            let userDetails = { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, token: token }
            res.status(200).send(userDetails);
        }
        catch(error) {
          res.status(500).send();
        }
      }
}