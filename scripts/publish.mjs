import fs from 'fs';
import archiver from 'archiver';
import { OAuth2Client } from 'google-auth-library';

const config = JSON.parse(fs.readFileSync(new URL('./config.json', import.meta.url)));

async function main() {
  try {
    // Create a zip archive of your extension folder
    const zipPath = 'prompster.zip';
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip');
    output.on('close', async () => {
      try {
        // Authenticate and get the access token
        const oauth2Client = new OAuth2Client(config.clientId, config.clientSecret);
        oauth2Client.setCredentials({refresh_token: config.refreshToken});
        const {token} = await oauth2Client.getAccessToken();

        // Create webstore instance
        const webstore = (await import('chrome-webstore-upload')).default({
          extensionId: config.extensionId,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          refreshToken: config.refreshToken,
          accessToken: token
        });

        // Upload the new version to the Chrome Web Store
        const uploadRes = await webstore.uploadExisting(fs.createReadStream(zipPath));

        if (uploadRes.uploadState === 'FAILURE') {
          console.error('Upload failed:', uploadRes.itemError);
          return;
        }

        // Publish the new version
        const publishRes = await webstore.publish('default');
        console.log('Publish status:', publishRes.status[0]);
      } catch (err) {
        console.error('Error uploading the extension:', err);
      } finally {
        // Clean up the zip file
        fs.unlinkSync(zipPath);
      }
    });

    archive.pipe(output);
    archive.directory('dist-chrome/', false);
    archive.finalize();
  } catch (err) {
    console.error('Error creating the zip archive:', err);
  }
}

main();
