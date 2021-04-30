/* eslint-disable */
const express = require('express');
const request = require('request'); // "Request" library
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const router = express.Router();

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
// Your redirect uri
const redirect_uri =
  process.env.NODE_ENV === 'production'
    ? process.env.REDIRECT_URI
    : 'http://localhost:5000/api/v1/spotify/callback/';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

router.get('/login', (req, res) => {
  console.log('login called');
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope =
    'user-read-private user-read-email user-top-read user-follow-read';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

router.get('/callback/', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter
  console.log('callback function called');

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  console.log('\tcode:', code);
  console.log('\tstate:', state);
  console.log('\tstoredState:', storedState);
  //state === null || state !== storedState
  if (state === null) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    };

    console.log('attempting to get access token:');

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token,
          refresh_token = body.refresh_token;
        console.log('access_token:', access_token);

        // use the access token to access the Spotify Web API
        const options = {
          url: 'https://api.spotify.com/v1/me?',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true,
        };

        // Print out the current user’s information
        request.get(options, function (error, response, body) {
          console.log('error:', error);
          if (!error) {
            console.log('body:', body);
          }
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          'https://audiufy.vercel.app/search?' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.redirect(
          'https://audiufy.vercel.app/' +
            querystring.stringify({
              error: 'invalid_token',
            })
        );
      }
    });
  }
});

router.get('/refresh_token', function (req, res) {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

router.get('/topArtists', function (req, res) {
  const access_token = req.query.access_token || null;
  console.log('access_token:', access_token);

  const authOptions = {
    url:
      'https://api.spotify.com/v1/me/top/artists?' +
      querystring.stringify({
        limit: 50,
      }),
    headers: { Authorization: 'Bearer ' + access_token },
    json: true,
  };

  request.get(authOptions, function (error, response, body) {
    console.log('error:', error);
    if (!error) {
      // console.log('body:', body);
      return res.json({ body });
    }
  });
});

router.get('/following', function (req, res) {
  const access_token = req.query.access_token || null;
  console.log('access_token:', access_token);

  const authOptions = {
    url:
      'https://api.spotify.com/v1/me/following?' +
      querystring.stringify({
        type: 'artist',
        limit: 50,
      }),
    headers: { Authorization: 'Bearer ' + access_token },
    json: true,
  };

  request.get(authOptions, function (error, response, body) {
    console.log('error:', error);
    if (!error) {
      console.log('body:', body);
      return res.json({
        ...body,
      });
    }
  });
});

router.get('/user', function (req, res) {
  const access_token = req.query.access_token || null;
  const after = req.query.after || null;
  console.log('access_token:', access_token);

  // use the access token to access the Spotify Web API
  const options = {
    url: 'https://api.spotify.com/v1/me?',
    headers: { Authorization: 'Bearer ' + access_token },
    json: true,
  };

  // Print out the current user’s information
  request.get(options, function (error, response, body) {
    console.log('error:', error);
    if (!error) {
      console.log('body:', body);
      return res.json({
        ...body,
      });
    }
  });
});

module.exports = router;
