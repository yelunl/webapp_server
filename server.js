const express = require('express');
const app = express();
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const port = 3000;

const getToken = async () => {
    try {
        const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " + btoa(clientId + ":" + clientSecret),
                },
                body: "grant_type=client_credentials",
            },
        );

        const jsonResponse = await response.json();
        return jsonResponse.access_token;
    } catch (err) {
        console.log(err);
    }

}

app.get('/', async (req, res) => {
    const result = await getToken();
    res.send(result)
    })
//   })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })