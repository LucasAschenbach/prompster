const { OAuth2Client } = require('google-auth-library');
const config = require('./config.json');

const clientId = config.clientId;
const clientSecret = config.clientSecret;
const redirectUri = 'urn:ietf:wg:oauth:2.0:oob';
const client = new OAuth2Client(clientId, clientSecret, redirectUri);

async function getRefreshToken() {
  const authorizeUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/chromewebstore',
  });

  console.log('Authorize this app by visiting this URL:', authorizeUrl);

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from the page here: ', async (code) => {
    const { tokens } = await client.getToken(code);
    console.log('Refresh token:', tokens.refresh_token);

    rl.close();
  });
}

getRefreshToken();
