/**
 * Created by orel- on 15/May/17.
 */

const express = require("express");
const fetch = require("node-fetch");
const btoa = require("btoa");
const { catchAsync } = require("../utils");

const router = express.Router();

const CLIENT_ID = `975998220314476556`;
const CLIENT_SECRET = `tbOg8fGQUH5cOoXNlS0LURtCtmsuqXuW`;

const redirect = "http://localhost:50451/api/discord/callback";

router.get("/login", (req, res) => {
  res.redirect(
    `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify%20email%20guilds&response_type=code&redirect_uri=${redirect}`
  );
});

router.get(
  "/callback",
  catchAsync(async (req, res) => {
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: redirect,
      code: req.query.code,
      scope: ["identify", "email", "guilds"],
    };

    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: new URLSearchParams(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const json = await response.json();

    const fetchDiscordUserInfo = await fetch(
      "http://discordapp.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${json.access_token}`,
        },
      }
    );
    const userInfo = await fetchDiscordUserInfo.json();

    res.redirect(`/?token=${json.access_token}`);

    console.log(userInfo);
  })
);

module.exports = router;
