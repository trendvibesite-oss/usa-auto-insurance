const fs = require('fs');
const path = require('path');
const https = require('https');

const zipsFile = path.join(__dirname, 'user_zipcodes.txt');
const outputFile = path.join(__dirname, 'cities.json');
const csvUrl = 'https://gist.githubusercontent.com/Tucker-Eric/6a1a6b164726f21bb699623b06591389/raw/us_zips.csv';

// 1. Read and format user ZIP codes
if (!fs.existsSync(zipsFile)) {
  console.error(`Error: ${zipsFile} not found.`);
  process.exit(1);
}

const rawZips = fs.readFileSync(zipsFile, 'utf8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

const targetZips = new Set(rawZips.map(zip => {
  // Pad with leading zeros up to 5 digits
  return zip.padStart(5, '0');
}));

console.log(`Loaded ${targetZips.size} target ZIP codes.`);

// 2. Download and parse the US ZIPs CSV
console.log('Downloading US ZIP codes database...');
https.get(csvUrl, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Download complete. Parsing database...');
    parseCSV(data);
  });
}).on('error', (e) => {
  console.error('Error downloading database:', e);
});

function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  // Mappings container
  const matched = [];
  
  // Track unique city-state combinations to prevent duplicate cities
  // format: "City Name|ST"
  const seenCityState = new Set();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0) continue;
    
    // Very basic CSV parser that handles potential quotes (though this gist is simple)
    const columns = [];
    let insideQuote = false;
    let currentColumn = '';
    
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        columns.push(currentColumn);
        currentColumn = '';
      } else {
        currentColumn += char;
      }
    }
    columns.push(currentColumn);
    
    if (columns.length < 4) continue;
    
    const zip = columns[0].trim().padStart(5, '0');
    const city = columns[1].trim();
    const state = columns[2].trim();
    const stateAbbr = columns[3].trim();
    
    if (targetZips.has(zip)) {
      const key = `${city.toLowerCase()}|${stateAbbr.toLowerCase()}`;
      if (!seenCityState.has(key)) {
        seenCityState.add(key);
        
        // Clean slug generation
        const cleanCitySlug = city.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // remove special chars
          .replace(/\s+/g, '-')         // replace spaces with hyphens
          .replace(/-+/g, '-');         // remove duplicate hyphens
          
        const slug = `${cleanCitySlug}-${stateAbbr.toLowerCase()}`;
        
        matched.push({
          name: city,
          state: state,
          stateAbbr: stateAbbr,
          slug: slug,
          zip: zip
        });
      }
    }
  }
  
  // Sort alphabetically by stateAbbr, then by city name
  matched.sort((a, b) => {
    if (a.stateAbbr !== b.stateAbbr) {
      return a.stateAbbr.localeCompare(b.stateAbbr);
    }
    return a.name.localeCompare(b.name);
  });
  
  console.log(`Successfully mapped ${matched.length} unique cities from target ZIP codes.`);
  
  // Write to cities.json
  fs.writeFileSync(outputFile, JSON.stringify(matched, null, 2), 'utf8');
  console.log(`Saved output to ${outputFile}`);
}
