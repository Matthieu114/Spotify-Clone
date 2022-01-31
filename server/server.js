const express = require("express");
const cors = require("cors");
const spotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", (req, res) => {
  const code = req.body.code;

  const spotifyApi = new spotifyWebApi({
    clientId: "af8f13c3293b44e38287e574fd56b9dd",
    clientSecret: "a4baeb3b6b164d0e8004d6a9824ad3a5",
    redirectUri: "http://localhost:3000"
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in
      });
    })
    .catch((err) => {
      res.sendStatus(400);
    });
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new spotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "af8f13c3293b44e38287e574fd56b9dd",
    clientSecret: "a4baeb3b6b164d0e8004d6a9824ad3a5",
    refreshToken
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in
      });
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

app.listen(3001);
