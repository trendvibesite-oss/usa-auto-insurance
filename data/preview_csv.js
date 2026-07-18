const https = require('https');

const url = 'https://gist.githubusercontent.com/Tucker-Eric/6a1a6b164726f21bb699623b06591389/raw/us_zips.csv';

https.get(url, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
    if (body.includes('\n')) {
      const lines = body.split('\n');
      if (lines.length > 5) {
        console.log('HEADER AND FIRST LINES:');
        console.log(lines.slice(0, 5).join('\n'));
        res.destroy(); // stop downloading
      }
    }
  });
}).on('error', (e) => {
  console.error(e);
});
