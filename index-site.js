const fs = require('fs');
const path = require('path');

// Target config
const CONFIG = {
  domain: 'https://auto-insurance.businesstraverse.com',
  serviceAccountFile: path.join(__dirname, 'service_account.json'),
  keysFolder: path.join(__dirname, 'keys'),
  stateFile: path.join(__dirname, 'submitted_urls.txt'),
  sitemaps: [
    path.join(__dirname, 'dist', 'sitemap-part-1.xml'),
    path.join(__dirname, 'dist', 'sitemap-part-2.xml')
  ]
};

// Main Run Pipeline
async function run() {
  console.log('🚗 Starting Google Indexing API automation...');

  // 1. Install googleapis package if missing
  try {
    require.resolve('googleapis');
  } catch (e) {
    console.log('📦 Installing "googleapis" package. Please wait...');
    const { execSync } = require('child_process');
    execSync('npm install googleapis', { stdio: 'inherit' });
  }

  const { google } = require('googleapis');

  // 2. Load all available JSON keys
  let keyFiles = [];
  if (fs.existsSync(CONFIG.keysFolder)) {
    const files = fs.readdirSync(CONFIG.keysFolder);
    keyFiles = files.filter(f => f.endsWith('.json')).map(f => path.join(CONFIG.keysFolder, f));
  }
  
  // If keys folder doesn't exist or is empty, fall back to default service_account.json
  if (keyFiles.length === 0) {
    if (fs.existsSync(CONFIG.serviceAccountFile)) {
      keyFiles.push(CONFIG.serviceAccountFile);
    }
  }

  if (keyFiles.length === 0) {
    console.error(`\n❌ ERROR: No credentials found!`);
    console.error(`Please do one of the following:`);
    console.error(`1. Place a single key file at: ${CONFIG.serviceAccountFile}`);
    console.error(`2. Create a folder named "keys" and put one or more JSON key files in it: ${CONFIG.keysFolder}\n`);
    process.exit(1);
  }

  console.log(`🔑 Found ${keyFiles.length} service account key file(s) for submission.`);

  // 3. Load all URLs from sitemaps
  console.log('📍 Parsing URLs from sitemaps...');
  const urls = [];
  CONFIG.sitemaps.forEach(sitemapPath => {
    if (fs.existsSync(sitemapPath)) {
      const content = fs.readFileSync(sitemapPath, 'utf8');
      const matches = content.match(/<loc>(.*?)<\/loc>/g);
      if (matches) {
        matches.forEach(m => {
          const url = m.replace(/<\/?loc>/g, '').trim();
          // Only target service+city combo landing pages under the /services/ subdirectory
          if (url && url.startsWith(`${CONFIG.domain}/services/`)) {
            urls.push(url);
          }
        });
      }
    }
  });

  console.log(`📊 Found total of ${urls.length} target combo URLs in sitemaps.`);
  if (urls.length === 0) {
    console.error('❌ No target URLs found. Make sure your site generator has run and generated dist/ folder.');
    process.exit(1);
  }

  // 4. Load already submitted URLs
  let submitted = new Set();
  if (fs.existsSync(CONFIG.stateFile)) {
    const content = fs.readFileSync(CONFIG.stateFile, 'utf8');
    submitted = new Set(content.split('\n').map(u => u.trim()).filter(Boolean));
  }
  console.log(`💾 Previously submitted URLs loaded: ${submitted.size}`);

  // 5. Filter unsubmitted URLs
  const queue = urls.filter(url => !submitted.has(url));
  console.log(`⏳ Queue of unsubmitted URLs: ${queue.length}`);

  if (queue.length === 0) {
    console.log('🎉 All URLs have already been submitted!');
    process.exit(0);
  }

  // 6. Process Queue with Key Rotation
  let keyIndex = 0;
  let successCount = 0;
  let urlIndex = 0;

  // Initialize first key client
  let currentKeyFile = keyFiles[keyIndex];
  console.log(`\n➡️ Using key [${keyIndex + 1}/${keyFiles.length}]: ${path.basename(currentKeyFile)}`);
  
  let auth = new google.auth.GoogleAuth({
    keyFile: currentKeyFile,
    scopes: ['https://www.googleapis.com/auth/indexing']
  });
  let authClient = await auth.getClient();
  let indexing = google.indexing({ version: 'v3', auth: authClient });

  // Limit loop up to total queue size
  while (urlIndex < queue.length) {
    const url = queue[urlIndex];
    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED'
        }
      });
      
      console.log(`[+] Success (${successCount + 1}): ${url}`);
      fs.appendFileSync(CONFIG.stateFile, `${url}\n`, 'utf8');
      successCount++;
      urlIndex++; // Move to next URL
      
      // Delay slightly between requests
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      const errMsg = err.message || '';
      console.error(`[-] Failed: ${url} | Error: ${errMsg}`);
      
      // If quota exceeded or 429 rate limited, rotate the key!
      if (errMsg.includes('Quota exceeded') || errMsg.includes('tooManyRequests') || err.code === 429) {
        keyIndex++;
        if (keyIndex >= keyFiles.length) {
          console.error(`\n🛑 All ${keyFiles.length} key files have exceeded their daily quotas. Stopping execution.`);
          break;
        }
        
        currentKeyFile = keyFiles[keyIndex];
        console.log(`\n🔄 Quota limit hit. Rotating to key [${keyIndex + 1}/${keyFiles.length}]: ${path.basename(currentKeyFile)}`);
        
        auth = new google.auth.GoogleAuth({
          keyFile: currentKeyFile,
          scopes: ['https://www.googleapis.com/auth/indexing']
        });
        authClient = await auth.getClient();
        indexing = google.indexing({ version: 'v3', auth: authClient });
        
        // Do NOT increment urlIndex, so it retries the failed URL with the new key!
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // For other errors (like permission denied / auth errors), skip the URL and move forward
        urlIndex++;
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`🎉 Daily run complete! Successfully submitted ${successCount} URLs.`);
  console.log(`💾 Total submitted so far: ${submitted.size + successCount}/${urls.length}`);
  console.log(`======================================================\n`);
}

run().catch(err => {
  console.error('❌ Critical crash during indexing execution:', err);
});
