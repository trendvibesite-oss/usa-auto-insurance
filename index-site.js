const fs = require('fs');
const path = require('path');

// Target config
const CONFIG = {
  domain: 'https://auto-insurance.businesstraverse.com',
  serviceAccountFile: path.join(__dirname, 'service_account.json'),
  stateFile: path.join(__dirname, 'submitted_urls.txt'),
  sitemaps: [
    path.join(__dirname, 'dist', 'sitemap-part-1.xml'),
    path.join(__dirname, 'dist', 'sitemap-part-2.xml')
  ],
  dailyLimit: 200
};

// Main Run Pipeline
async function run() {
  console.log('🚗 Starting Google Indexing API automation...');

  // 1. Verify service account file exists
  if (!fs.existsSync(CONFIG.serviceAccountFile)) {
    console.error(`\n❌ ERROR: credentials file not found at: ${CONFIG.serviceAccountFile}`);
    console.error('Please download your GCP service account JSON key file, rename it to "service_account.json", and place it in the project folder.\n');
    process.exit(1);
  }

  // 2. Install googleapis package if missing
  try {
    require.resolve('googleapis');
  } catch (e) {
    console.log('📦 Installing "googleapis" package. Please wait...');
    const { execSync } = require('child_process');
    execSync('npm install googleapis', { stdio: 'inherit' });
  }

  const { google } = require('googleapis');

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

  console.log(`📊 Found total of ${urls.length} URLs in sitemaps.`);
  if (urls.length === 0) {
    console.error('❌ No URLs found. Make sure your site generator has run and generated dist/ folder.');
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

  // 6. Setup Google auth client
  const auth = new google.auth.GoogleAuth({
    keyFile: CONFIG.serviceAccountFile,
    scopes: ['https://www.googleapis.com/auth/indexing']
  });
  const authClient = await auth.getClient();
  
  // 7. Process batch (up to daily limit)
  const batchSize = Math.min(queue.length, CONFIG.dailyLimit);
  const batch = queue.slice(0, batchSize);
  console.log(`⚡ Processing batch of ${batchSize} URLs...`);

  const indexing = google.indexing({
    version: 'v3',
    auth: authClient
  });

  let successCount = 0;
  for (let i = 0; i < batch.length; i++) {
    const url = batch[i];
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED'
        }
      });
      
      console.log(`[${i + 1}/${batchSize}] ✅ Submitted: ${url}`);
      fs.appendFileSync(CONFIG.stateFile, `${url}\n`, 'utf8');
      successCount++;
      
      // Delay slightly between requests to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error(`[${i + 1}/${batchSize}] ❌ Failed: ${url} | Error: ${err.message}`);
      if (err.message.includes('Quota exceeded') || err.code === 429) {
        console.error('\n🛑 Google Indexing API daily quota limit exceeded. Stopping execution.');
        break;
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`🎉 Daily run complete! Successfully submitted ${successCount} URLs.`);
  console.log(`📄 Total submitted so far: ${submitted.size + successCount}/${urls.length}`);
  console.log(`======================================================\n`);
}

run().catch(err => {
  console.error('❌ Critical crash during indexing execution:', err);
});
