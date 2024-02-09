const express = require('express');
const app = express();
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const port = 3000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })

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

const createHeader = async (apiToken) => {
    return {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
        };
}

const getPlaylistItems = async (requestHeader) => {
    try {
        const response = await fetch('https://api.spotify.com/v1/playlists/6nlXed0mS4PF6yMql9ReOK/tracks', requestHeader);
        const jsonResponse = await response.json();
        // console.log(jsonResponse.items)
        return jsonResponse.items;
    } catch(err) {
        console.log(err)
    }
}

// const callApi = async () => {
//     const apiToken = await getToken();
//     const requestHeader = await createHeader(apiToken);
//     const musicItems = await getPlaylistItems(requestHeader);
//     collectDataApi(musicItems);
// };

// callApi();

const collectDataApi = (musicItems) => {
    const apiData = musicItems.map(item => {
        const nameSong = item.track.name;
        const nameArtist = item.track.artists[0].name;
        const imageAlbum = item.track.album.images[0].url;
        const link = item.track['external_urls'].spotify;
        return {nameSong, nameArtist, imageAlbum, link}
    });
    return apiData;
}

app.get('/', async (req, res) => {
    const apiToken = await getToken();
    const requestHeader = await createHeader(apiToken);
    const musicItems = await getPlaylistItems(requestHeader);
    const result = collectDataApi(musicItems);

    console.log(result)
    res.send(result)
    })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })