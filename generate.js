#!/usr/bin/env node
/**
 * Auto Insurance Local Service Site Generator - Production Build
 * Generates 40,000+ optimized static HTML pages for 9 service categories and 4,246 cities.
 * Includes split sitemaps (under 50,000 URLs limit), structured JSON-LD schemas,
 * exact color palette, design elements, and disclaimer matching pestcontrol.grace-prayers.com
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
  siteName: 'USA Auto Insurance',
  phone: '833-246-4560',
  phoneFormatted: '(833) 246-4560',
  phoneTel: 'tel:+18332464560',
  domain: 'https://autoinsurance.example.com', // Replace with active domain
  outputDir: path.join(__dirname, 'dist'),
  dataDir: path.join(__dirname, 'data'),
  assetsDir: path.join(__dirname, 'assets'),
};

// 9 Service Categories matching user keywords
const SERVICES = [
  {
    name: 'Cheapest Auto Insurance',
    slug: 'cheapest-auto-insurance',
    h1: 'Cheapest Auto Insurance Services near you',
    h2: 'Find the Lowest Car Insurance Rates in your local area',
    description: 'Looking for the cheapest auto insurance? Compare low-cost liability and collision auto coverage options in your area today.',
    image: 'https://images.unsplash.com/photo-1533558720443-d9b312d5d5fa?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    name: 'Affordable Auto Insurance',
    slug: 'affordable-auto-insurance',
    h1: 'Affordable Auto Insurance Options near you',
    h2: 'Get Budget-Friendly Vehicle Insurance with Top Coverage',
    description: 'Find affordable auto insurance policies that fit your monthly budget. Get free, quick auto insurance quotes now.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    name: 'Auto Insurance Services',
    slug: 'auto-insurance-services',
    h1: 'Professional Auto Insurance Services near you',
    h2: 'Comprehensive Liability, Collision, and Comprehensive Insurance Services',
    description: 'Need complete auto insurance services? Our local specialists provide liability, full coverage, SR-22, and commercial auto plans.',
    image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    name: 'Auto Insurance Companies',
    slug: 'auto-insurance-companies',
    h1: 'Top-Rated Auto Insurance Companies near you',
    h2: 'Compare Local & National Auto Insurers Side-by-Side',
    description: 'Find top auto insurance companies operating in your city. Compare premium rates, customer ratings, and coverages instantly.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    name: 'Direct Auto Insurance',
    slug: 'direct-auto-insurance',
    h1: 'Direct Auto Insurance Quotes near you',
    h2: 'Skip the Middleman and Purchase Direct Auto Insurance Instantly',
    description: 'Get direct auto insurance quotes over the phone or online. Quick coverage setup, flexible down payments, and instant cards.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    name: 'Cure Auto Insurance',
    slug: 'cure-auto-insurance',
    h1: 'Cure Auto Insurance Quotes & Coverage near you',
    h2: 'CURE Auto Insurance Rates for High-Risk and Standard Drivers',
    description: 'Compare CURE auto insurance coverage. CURE auto policies evaluate your real driving record, ignoring credit score factors.',
    image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    name: 'Progressive Auto Insurance',
    slug: 'progressive-auto-insurance',
    h1: 'Progressive Auto Insurance Quotes & Savings near you',
    h2: 'Progressive Car Insurance Discounts, Snapshot, and Bundling options',
    description: 'Looking for a Progressive auto insurance quote? Find local agent rates, compare Name Your Price options, and get covered.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    name: 'Liberty Mutual Auto Insurance',
    slug: 'liberty-mutual-auto-insurance',
    h1: 'Liberty Mutual Auto Insurance Solutions near you',
    h2: 'Liberty Mutual Car Insurance Custom Policies & Bundling Rates',
    description: 'Get custom Liberty Mutual auto insurance quotes. Customize your coverage options and pay only for what you need.',
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    name: 'State Farm Auto Insurance',
    slug: 'state-farm-auto-insurance',
    h1: 'State Farm Auto Insurance Quotes & Local Agents near you',
    h2: 'Get Quotes from State Farm Car Insurance - Largest Auto Insurer in USA',
    description: 'Compare State Farm auto insurance rates. Drive Safe & Save discounts, bundling deals, and local agent support in your town.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&h=400&q=80'
  }
];

// Minification helper functions for PageSpeed optimization
function minifyHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '') // remove HTML comments
    .replace(/\s+/g, ' ')            // compress multiple whitespaces to single space
    .replace(/> </g, '><')          // remove whitespace between tags
    .trim();
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove CSS comments
    .replace(/\s+/g, ' ')             // compress multiple spaces
    .replace(/ ?\{ ?/g, '{')          // strip spacing around curly braces
    .replace(/ ?\} ?/g, '}')
    .replace(/ ?; ?/g, ';')
    .replace(/ ?: ?/g, ':')
    .trim();
}

function minifyJs(js) {
  return js
    .replace(/\/\/.*$/gm, '')         // remove single line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove multi line comments
    .replace(/\s+/g, ' ')             // compress whitespaces
    .trim();
}

// ============================================================
// MAIN GENERATOR
// ============================================================
function run() {
  console.log('🚗 Starting Auto Insurance Service Site Generator...');

  // 1. Load cities
  const citiesPath = path.join(CONFIG.dataDir, 'cities.json');
  if (!fs.existsSync(citiesPath)) {
    console.error('ERROR: cities.json not found at', citiesPath);
    process.exit(1);
  }
  const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
  console.log(`📍 Loaded ${cities.length} unique cities from cities.json.`);

  // Clean/Recreate Output Dir
  if (fs.existsSync(CONFIG.outputDir)) {
    fs.rmSync(CONFIG.outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });

  // Create Subdirectories
  fs.mkdirSync(path.join(CONFIG.outputDir, 'assets', 'css'), { recursive: true });
  fs.mkdirSync(path.join(CONFIG.outputDir, 'assets', 'js'), { recursive: true });
  fs.mkdirSync(path.join(CONFIG.outputDir, 'assets', 'images'), { recursive: true });
  fs.mkdirSync(path.join(CONFIG.outputDir, 'about-us'), { recursive: true });
  fs.mkdirSync(path.join(CONFIG.outputDir, 'reviews'), { recursive: true });
  fs.mkdirSync(path.join(CONFIG.outputDir, 'privacy-policy'), { recursive: true });
  fs.mkdirSync(path.join(CONFIG.outputDir, 'service-areas'), { recursive: true });
  fs.mkdirSync(path.join(CONFIG.outputDir, 'service-area'), { recursive: true });
  fs.mkdirSync(path.join(CONFIG.outputDir, 'service-category'), { recursive: true });
  fs.mkdirSync(path.join(CONFIG.outputDir, 'services'), { recursive: true });

  // Copy CSS, JS, and Image assets
  fs.copyFileSync(
    path.join(CONFIG.assetsDir, 'css', 'style.css'),
    path.join(CONFIG.outputDir, 'assets', 'css', 'style.css')
  );
  fs.copyFileSync(
    path.join(CONFIG.assetsDir, 'js', 'script.js'),
    path.join(CONFIG.outputDir, 'assets', 'js', 'script.js')
  );
  fs.copyFileSync(
    path.join(CONFIG.assetsDir, 'images', 'banner.jpg'),
    path.join(CONFIG.outputDir, 'assets', 'images', 'banner.jpg')
  );

  console.log('⚡ Assets copied successfully.');

  // Read and minify CSS and JS for inlining (PageSpeed optimization)
  const rawCss = fs.readFileSync(path.join(CONFIG.assetsDir, 'css', 'style.css'), 'utf8');
  const rawJs = fs.readFileSync(path.join(CONFIG.assetsDir, 'js', 'script.js'), 'utf8');
  
  // Remove `@import` Google font reference from the CSS file so it can load via parallel HTML link
  const cleanCss = rawCss.replace(/@import url\('[^']+'\);/g, '');
  
  const minifiedCss = minifyCss(cleanCss);
  const minifiedJs = minifyJs(rawJs);

  function writeHtmlFile(filePath, htmlContent) {
    fs.writeFileSync(filePath, minifyHtml(htmlContent), 'utf8');
  }

  // Sitemap tracking
  const allUrls = [];

  // ============================================================
  // SHARED HTML GENERATION HELPERS
  // ============================================================
  function getHead(title, description, canonicalPath, schema = '') {
    const canonical = `${CONFIG.domain}${canonicalPath}`;
    return `<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="${CONFIG.siteName}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <style>${minifiedCss}</style>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    ${schema ? `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>` : ''}
</head>
<body>`;
  }

  function getHeader() {
    const dropdownItems = SERVICES.map(s => 
      `\t\t\t\t\t\t\t<li><a href="/service-category/${s.slug}/">${s.name}</a></li>`
    ).join('\n');

    return `
<!-- Header Section -->
<header class="w3-container pad0">
    <div id="header" class="w3-container pad0 headerStyle">
        <div class="headerLine1Style">
            <a href="/" class="LogoDesktop">
                <span class="header_line1_company LogoDesktop">USA Auto Insurance</span>
            </a>
            <div class="call99-flex-vert-center">
                <h4 class="showLargeScreenHeader header_line1_phone pad-sides-10">
                    <a class="phoneNumber primaryPhone" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>
                </h4>
            </div>
        </div>

        <div class="w3-container pad0 w3-row headerLine2Style">
            <span class="toggleMenu headerMenuStyle" id="menuIcn">
                <label style="float:left; margin-right:15px; margin-top:2px;"><i class="box-shadow-menu"></i></label>Menu
            </span>
            
            <span class="smallScreenHeader smallScreenMenuPhone headerMenuStyle">
                <p>Call Now</p>
                <a class="phoneNumber primaryPhone" href="tel:${CONFIG.phone}">
                    ${CONFIG.phoneFormatted}
                </a>
            </span>
            
            <div class="menu headerMenuStyle w3-clear w3-center" id="mainMenu">
                <nav>
                    <ul id="main-menu" class="sm sm-blue">
                        <li><a href="/">Home</a></li>
                        <li class="has-sub"><a href="#" aria-haspopup="true" aria-expanded="false">Services<span class="sub-arrow">+</span></a>
                            <ul>
${dropdownItems}
                            </ul>
                        </li>
                        <li><a href="/service-areas/">Service Areas</a></li>
                        <li><a href="/reviews/">Reviews</a></li>
                        <li><a href="/about-us/">About Us</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</header>

<div class="w3-container pad0 showLargeScreenHeader mainTopSpacer"></div>
<div class="w3-container pad0 smallScreenHeader">
    <div class="w3-container pad0 mainTopSpacer"></div>
</div>
`;
  }

  function getCTABox() {
    return `
    <div class="cta-box">
      <h3>Call for a FREE Auto Insurance Quote</h3>
      <a class="phone-link" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>
      <p>Speak to a Local Licensed Insurance Specialist Instantly</p>
    </div>`;
  }

  function getFooter() {
    return `
<!-- Footer Section -->
<footer class="w3-container pad0">
    <div class="w3-container pad0">
        <div class="w3-container pad0">
            <div class="useboxright">
                <p style="font-weight:bold; font-size:18px; color:#ffffff; margin-bottom:10px;">Auto insurance Services Contractor</p>
                <p style="font-weight:bold; color:#ffffff;">44 Charles Street, Acorn Street, MA 2114</p>
                <p>This site is a free service to assist homeowners in connecting with local service providers. All contractors/providers are independent and this site does not warrant or guarantee any work performed. It is the responsibility of the homeowner to verify that the hired contractor furnishes the necessary license and insurance required for the work being performed. All persons depicted in a photo or video are actors or models and not contractors listed on this site.</p>
                
                <div class="callNoDiv">
                    <ul class="phoneList">
                        <li class="primaryPhone">
                            <a class="phoneNumber primaryPhone" href="tel:${CONFIG.phone}">
                                ${CONFIG.phoneFormatted}
                            </a>
                        </li>
                        <li class="phoneSmall">${CONFIG.phoneFormatted}</li>
                    </ul>
                </div>

                <p><a class="privacyPolicy" href="/privacy-policy/">Privacy Policy</a></p>
            </div>
        </div>
    </div>
    <div class="w3-container pad0 footerDivMn">Copyright © ${new Date().getFullYear()} - USA Auto Insurance</div>
</footer>
<script>${minifiedJs}</script>
</body>
</html>
`;
  }

  function getBreadcrumbs(crumbs) {
    const links = crumbs.map((c, i) => {
      if (i === crumbs.length - 1) {
        return `<span>${c.name}</span>`;
      }
      return `<a href="${c.url}">${c.name}</a><span class="separator">›</span>`;
    }).join('');
    
    return `<div class="breadcrumbs">${links}</div>`;
  }

  // ============================================================
  // JSON-LD SCHEMAS
  // ============================================================
  function getLocalBusinessSchema(city = null) {
    const cityName = city ? `${city.name}, ${city.stateAbbr}` : 'USA';
    return {
      "@context": "http://schema.org/",
      "@type": "LocalBusiness",
      "name": `USA Auto Insurance Services ${cityName}`,
      "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      "telephone": CONFIG.phoneFormatted,
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "44 Charles Street, Acorn Street",
        "addressLocality": city ? city.name : "Boston",
        "addressRegion": city ? city.stateAbbr : "MA",
        "postalCode": city ? city.zip : "02114",
        "addressCountry": "US"
      }
    };
  }

  function getBreadcrumbSchema(crumbs) {
    return {
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": crumbs.map((c, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@id": `${CONFIG.domain}${c.url}`,
          "name": c.name
        }
      }))
    };
  }

  // ============================================================
  // 1. GENERATE HOMEPAGE
  // ============================================================
  function buildHomepage() {
    const title = `Auto Insurance Services - Cheapest Auto Insurance - Call ${CONFIG.phoneFormatted}`;
    const description = `Professional Auto Insurance Services - Fast, Safe & Affordable Coverage Near You. All USA states covered. To get your free quote call ${CONFIG.phoneFormatted}.`;
    
    const schema = {
      "@context": "http://schema.org/",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": `${CONFIG.domain}/`
    };

    // Display all cities on the homepage footer for complete internal linking
    const citiesLinksHtml = cities.map(c => 
      `<a href="/service-area/${c.slug}/">${c.name}, ${c.stateAbbr}</a>`
    ).join('\n');

    let html = getHead(title, description, '/', schema);
    html += getHeader();
    html += `
<div class="center-cropped" style="background-image: url('/assets/images/banner.jpg');">
    <img src="/assets/images/banner.jpg" alt="Auto Insurance Banner">
</div>

<div class="w3-container pad0 w3-clear">
    <div class="w3-container w3-content w3-center contentX headingTxt">
        <h1>Auto Insurance Services Contractor</h1>
    </div>
    
    <div class="w3-container w3-content contentX">
        <h2>Professional Auto Insurance Services – Fast, Safe & Affordable Car Coverage Near You</h2>
        
        <p>Are you looking for the <strong>cheapest auto insurance</strong> options in your state? Or need a quick quote from one of the major <strong>auto insurance companies</strong> like <strong>Progressive auto insurance</strong>, <strong>State Farm auto insurance</strong>, or <strong>Liberty Mutual auto insurance</strong>? At <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>, we are dedicated to connecting drivers with high-quality, budget-friendly auto coverage plans.</p>
        
        <p>Whether you require basic liability coverage to satisfy state laws, comprehensive insurance to cover storm damage, collision protection, or specialized auto filings like SR-22 insurance, we have local partners waiting to assist. Call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> today to secure your free car coverage quote.</p>
        
        <p style="text-align: center;"><strong>Call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> to compare low-cost insurance rates with national and local insurers.</strong></p>

        ${getCTABox()}

        <h2>Why Compare Auto Insurance Rates with Us?</h2>
        <p>With thousands of auto insurers in the United States, finding the exact policy that matches your driving history and budget is challenging. Calling our direct line <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> connects you directly with professional representatives who can analyze the market for you.</p>
        
        <ul>
            <li><strong>Cheapest Auto Insurance Rates:</strong> We match you with carrier programs providing premium discounts for clean driving, bundling, and multi-vehicle plans.</li>
            <li><strong>Affordable Auto Insurance Options:</strong> Policies custom-tailored with flexible deductibles to lower your monthly payments.</li>
            <li><strong>Compare Top Companies:</strong> Check options from <strong>Progressive</strong>, <strong>State Farm</strong>, <strong>Liberty Mutual</strong>, and <strong>Cure auto insurance</strong> instantly.</li>
            <li><strong>Rapid Direct Processing:</strong> Purchase your policy directly over the phone and get proof of coverage sent to your mobile phone in minutes.</li>
        </ul>

        ${getCTABox()}

        <h2>Our Primary Insurance Offerings</h2>
        
        <div class="w3-row-padding">
            <div class="w3-half">
                <div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
                    <h3><a href="/service-category/cheapest-auto-insurance/">Cheapest Auto Insurance</a></h3>
                    <p>Lower your auto insurance costs by shopping the best rates. Get minimal liability limit options and start saving on your monthly auto premiums today by calling <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>.</p>
                </div>
            </div>
            <div class="w3-half">
                <div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
                    <h3><a href="/service-category/affordable-auto-insurance/">Affordable Auto Insurance</a></h3>
                    <p>Auto coverage that fits your family budget. Compare flexible plans with customizable collision and comprehensive deductibles. Get your quote at <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>.</p>
                </div>
            </div>
        </div>

        <div class="w3-row-padding">
            <div class="w3-half">
                <div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
                    <h3><a href="/service-category/auto-insurance-services/">Auto Insurance Services</a></h3>
                    <p>From liability protection to vehicle comprehensive insurance, direct SR-22 filings, and commercial transport policies, we cover all auto coverage requests at <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>.</p>
                </div>
            </div>
            <div class="w3-half">
                <div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
                    <h3><a href="/service-category/auto-insurance-companies/">Auto Insurance Companies</a></h3>
                    <p>Compare top carriers like Progressive, Liberty Mutual, State Farm, and CURE. Find the company that offers the best customer support and claims service. Call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>.</p>
                </div>
            </div>
        </div>

        ${getCTABox()}

        <h2>Frequently Asked Questions</h2>
        <h3>How can I get the cheapest auto insurance?</h3>
        <p>The fastest way to lower your premiums is to call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> and speak with an agent who can check multi-car discounts, telematics programs, bundling options, and higher deductible structures.</p>
        
        <h3>What is direct auto insurance?</h3>
        <p>Direct auto insurance allows you to purchase coverages directly from the underwriting company, bypassing traditional insurance agency markup costs. Get direct quotes today by calling <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>.</p>
        
        <h3>Are local contractors licensed and insured?</h3>
        <p>Yes. All independent agents and carrier networks we connect you with are fully licensed and registered within their respective state jurisdictions. Please call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> to learn more.</p>

        ${getCTABox()}

        <h3 class="cities-grid-title">Cities Served</h3>
        <div class="cities-grid">
            ${citiesLinksHtml}
        </div>
    </div>
</div>
`;
    html += getFooter();
    writeHtmlFile(path.join(CONFIG.outputDir, 'index.html'), html);
    allUrls.push({ url: '/', priority: '1.0', changefreq: 'monthly' });
  }

  // ============================================================
  // 2. GENERATE SERVICE CATEGORY PAGES
  // ============================================================
  function buildCategoryPages() {
    console.log('Generating service category pages...');
    
    SERVICES.forEach(s => {
      const title = `${s.name} - Compare Quotes & Save - Call ${CONFIG.phoneFormatted}`;
      const description = `${s.description} Get optimized rates and compare top auto coverages in your city. Speak with an expert by calling ${CONFIG.phoneFormatted}.`;
      
      const crumbs = [
        { name: 'Home', url: '/' },
        { name: s.name, url: `/service-category/${s.slug}/` }
      ];
      
      const schema = [
        getLocalBusinessSchema(),
        getBreadcrumbSchema(crumbs)
      ];

      // Sample of cities for category bottom links
      const catCities = cities.slice(0, 120);
      const citiesHtml = catCities.map(c => 
        `<a href="/services/${s.slug}-${c.slug}/">${s.name} in ${c.name}, ${c.stateAbbr}</a>`
      ).join('\n');

      let html = getHead(title, description, `/service-category/${s.slug}/`, schema);
      html += getHeader();
      html += `
<div class="w3-container pad0 w3-clear">
    <div class="w3-container w3-content contentX">
        ${getBreadcrumbs(crumbs)}
        <h1 style="text-align:center">${s.h1}</h1>
        <p>&nbsp;</p>
        
        <p>Welcome to our premier guide for <strong>${s.name.toLowerCase()}</strong>. If you are shopping around to compare rates or establish immediate coverage, call us at <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>. We connect you with local agents and national companies offering quotes for <strong>${s.name.toLowerCase()}</strong>.</p>
        
        <p>Using our direct call-in line <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> ensures you speak with a licensed carrier representative who can compare coverages side-by-side. From budget liability insurance to full coverage collision policies, we are ready to assist you. Call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> now.</p>
        
        ${getCTABox()}

        <h2>Why Choose Our ${s.name} Specialists?</h2>
        <p>Shopping for coverage online can be confusing. By calling <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>, you bypass online forms and speak directly to a live human who can help you locate additional insurance discounts:</p>
        <ul>
            <li><strong>Good Driver Discount:</strong> Save up to 20% on <strong>${s.name.toLowerCase()}</strong> with a clean history.</li>
            <li><strong>Multi-Policy Discounts:</strong> Combine auto with home or renters insurance. Call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> for details.</li>
            <li><strong>Low Payment Options:</strong> Lower your starting down payment on <strong>direct auto insurance</strong> or standard policies.</li>
            <li><strong>Flexible Deductibles:</strong> Learn how collision and comprehensive options can adjust your monthly premium.</li>
        </ul>

        <p>Stop paying high premiums. Let our licensed representatives review your current policy and find a cheaper rate today. Speak to us at <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>.</p>

        ${getCTABox()}

        <h2>Understanding Coverage Limits</h2>
        <p>Every state has basic laws mandating minimum coverage levels for liability protection. However, minimums may not protect you completely in major accidents. When you contact <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>, our professionals will help you choose proper limits for comprehensive, collision, PIP, and uninsured motorist coverage. Speak with an advisor at <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> to start saving.</p>

        ${getCTABox()}

        <h3 class="cities-grid-title">Featured Service Areas for ${s.name}</h3>
        <div class="cities-grid">
            ${citiesHtml}
        </div>
    </div>
</div>
`;
      html += getFooter();
      
      const dir = path.join(CONFIG.outputDir, 'service-category', s.slug);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      writeHtmlFile(path.join(dir, 'index.html'), html);
      
      allUrls.push({ url: `/service-category/${s.slug}/`, priority: '0.8', changefreq: 'weekly' });
    });
  }

  // ============================================================
  // 3. GENERATE SERVICE AREA PAGES (CITY PAGES WITH CLICKABLE LINKS)
  // ============================================================
  function buildAreaPages() {
    console.log('Generating area/city pages...');
    
    cities.forEach((city, index) => {
      const title = `Serving in ${city.name}, ${city.stateAbbr}, ${city.zip} - Call ${CONFIG.phoneFormatted}`;
      const description = `Auto Insurance Services in ${city.name}, ${city.stateAbbr}. Compare cheapest, affordable & direct auto insurance quotes. Call ${CONFIG.phoneFormatted} to speak to local agents.`;
      
      const crumbs = [
        { name: 'Home', url: '/' },
        { name: 'Service Areas', url: '/service-areas/' },
        { name: `${city.name}, ${city.stateAbbr}`, url: `/service-area/${city.slug}/` }
      ];
      
      const schema = [
        getLocalBusinessSchema(city),
        getBreadcrumbSchema(crumbs)
      ];

      // Clickable service links with distinct combo slugs
      const serviceLinksHtml = SERVICES.map(s => `
        <p style="min-height:50px">
            <a href="/services/${s.slug}-${city.slug}/">
                <span class="service-dot" style="background:#0e78c0; width:10px; height:10px; border-radius:50%; margin-right:8px; display:inline-block; vertical-align:middle;"></span>
                <strong>${s.name} in ${city.name}, ${city.stateAbbr}</strong>
            </a>
        </p>
      `).join('');

      let html = getHead(title, description, `/service-area/${city.slug}/`, schema);
      html += getHeader();
      html += `
<div class="w3-container pad0 w3-clear serviceTownPage">
    <div class="w3-container w3-content contentX">
        ${getBreadcrumbs(crumbs)}
        <h1 style="text-align:center">Serving in ${city.name}, ${city.stateAbbr}, ${city.zip}</h1>
        <p>&nbsp;</p>
        
        <p>Looking for a licensed auto insurance provider in <strong>${city.name}, ${city.stateAbbr}</strong>? USA Auto Insurance connects you with local agents and national companies serving the <strong>${city.zip}</strong> ZIP code. Call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> now to verify licensing, compare monthly premiums, and get covered today.</p>

        <div class="townServiceList">
            ${serviceLinksHtml}
        </div>
        
        <p>&nbsp;</p>
        ${getCTABox()}
    </div>
</div>
`;
      html += getFooter();
      
      const dir = path.join(CONFIG.outputDir, 'service-area', city.slug);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      writeHtmlFile(path.join(dir, 'index.html'), html);
      
      allUrls.push({ url: `/service-area/${city.slug}/`, priority: '0.6', changefreq: 'weekly' });
      
      if ((index + 1) % 500 === 0) {
        console.log(`  Processed ${index + 1}/${cities.length} city pages...`);
      }
    });
  }

  // ============================================================
  // 4. GENERATE COMBINATION PAGES (SERVICE + CITY PAGES) - SEO TARGETS
  // ============================================================
  function buildComboPages() {
    console.log('Generating service-city combination pages (highly optimized content)...');
    
    let totalCount = 0;
    
    cities.forEach((city, cityIndex) => {
      // Find up to 15 nearby cities from the same state for bottom linking
      const sameStateCities = cities.filter(c => c.stateAbbr === city.stateAbbr && c.slug !== city.slug).slice(0, 15);
      
      SERVICES.forEach(s => {
        const title = `${s.name} in ${city.name}, ${city.stateAbbr} - Call ${CONFIG.phoneFormatted}`;
        const description = `Looking for ${s.name.toLowerCase()} in ${city.name}, ${city.stateAbbr} ${city.zip}? Compare top insurers and save. Call ${CONFIG.phoneFormatted} for free quotes.`;
        
        const crumbs = [
          { name: 'Home', url: '/' },
          { name: s.name, url: `/service-category/${s.slug}/` },
          { name: `${city.name}, ${city.stateAbbr}`, url: `/service-area/${city.slug}/` },
          { name: `${s.name} in ${city.name}`, url: `/services/${s.slug}-${city.slug}/` }
        ];

        const schema = [
          getLocalBusinessSchema(city),
          getBreadcrumbSchema(crumbs)
        ];

        // Bottom internal links: Same service available in other nearby cities
        const otherCitiesGridHtml = sameStateCities.map(c => 
          `<a href="/services/${s.slug}-${c.slug}/">${s.name} in ${c.name}, ${c.stateAbbr}</a>`
        ).join('\n');

        // Bottom internal links: Other services available in this city
        const otherServicesGridHtml = SERVICES.filter(otherService => otherService.slug !== s.slug).map(otherService => 
          `<a href="/services/${otherService.slug}-${city.slug}/">${otherService.name} in ${city.name}, ${city.stateAbbr}</a>`
        ).join('\n');

        let html = getHead(title, description, `/services/${s.slug}-${city.slug}/`, schema);
        html += getHeader();
        html += `
<div class="w3-container pad0 w3-clear">
    <div class="w3-container w3-content contentX">
        ${getBreadcrumbs(crumbs)}
        
        <div class="headingTxt">
            <h1>${s.name} in ${city.name}, ${city.stateAbbr}</h1>
        </div>

        <p>If you are looking to secure <strong>${s.name.toLowerCase()}</strong> in <strong>${city.name}, ${city.stateAbbr}</strong>, calling <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> is the fastest way to save. We work with leading carrier networks serving the <strong>${city.zip}</strong> area to help drivers find the lowest rates possible.</p>
        
        <p>Driving without auto insurance is illegal in <strong>${city.state}</strong> and can result in heavy fines, license suspension, or financial ruin in the event of an accident. Whether you are looking for a basic liability policy, comprehensive coverage, or quotes from top-tier carriers like <strong>Progressive auto insurance</strong>, <strong>State Farm</strong>, <strong>Liberty Mutual</strong>, or <strong>CURE auto insurance</strong>, call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> to compare rate plans today.</p>

        <p>Our call-in auto insurance matching service at <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> is free, fast, and does not require complex form inputs. Get matched with local independent agents or direct carrier representatives in under 5 minutes. Call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> now.</p>

        ${getCTABox()}

        <h2>Why Compare ${s.name} Options in ${city.name}?</h2>
        <p>Auto insurance premium rates in <strong>${city.name}</strong> are determined by local risk profiles, climate history, average daily commutes, and even credit history (depending on state regulations). Because pricing varies dramatically between companies, drivers who do not shop around usually end up overpaying for coverage.</p>
        
        <p>By dialing <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>, you get direct access to specialists who understand the <strong>${city.state}</strong> auto insurance landscape. They can search multiple companies side-by-side to construct a custom policy suited for your budget. Call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> to verify what discounts you qualify for today.</p>

        <ul>
            <li><strong>Bundling Policies:</strong> Bundle auto with homeowners or renters coverage in <strong>${city.name}</strong> and save up to 25%. Call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>.</li>
            <li><strong>Snapshot & Telematics:</strong> Let tracking apps measure your safe driving habits to lower premium rates.</li>
            <li><strong>Low Down Payments:</strong> Get insured today with a small initial down payment. Ask about flexible schedules at <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>.</li>
            <li><strong>Good Student Savings:</strong> Full-time student drivers with clean grades often qualify for major policy deductions.</li>
        </ul>

        ${getCTABox()}

        <h2>We Help You Secure All Types of Coverage</h2>
        <p>When searching for <strong>${s.name.toLowerCase()}</strong> in <strong>${city.name}, ${city.stateAbbr}</strong>, it is vital to secure a policy that satisfies both your lender requirements (if the vehicle is financed) and state liability laws. When you call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>, our partners will guide you through all auto choices:</p>
        
        <div class="w3-row-padding">
            <div class="w3-half">
                <div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
                    <h3>Liability Auto Insurance</h3>
                    <p>Covers bodily injury and property damage to others if you are at fault. Required by law in <strong>${city.state}</strong>. Learn more by calling <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>.</p>
                </div>
            </div>
            <div class="w3-half">
                <div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
                    <h3>Collision & Comprehensive</h3>
                    <p>Collision covers damage to your vehicle from an accident. Comprehensive protects against non-collision losses like theft, wind, hail, or fire in <strong>${city.name}</strong>. Call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>.</p>
                </div>
            </div>
        </div>

        <p>Don't wait until it is too late. Secure reliable protection for your family vehicle now. Call <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a> for a zero-obligation quotation.</p>

        ${getCTABox()}

        <h3 class="cities-grid-title">Other Auto Insurance Services in ${city.name}, ${city.stateAbbr}</h3>
        <div class="cities-grid">
            ${otherServicesGridHtml}
        </div>

        <h3 class="cities-grid-title">Nearby Areas Served for ${s.name}</h3>
        <div class="cities-grid">
            ${otherCitiesGridHtml}
        </div>
    </div>
</div>
`;
        html += getFooter();
        
        const dirName = `${s.slug}-${city.slug}`;
        const dir = path.join(CONFIG.outputDir, 'services', dirName);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        writeHtmlFile(path.join(dir, 'index.html'), html);
        
        allUrls.push({ url: `/services/${s.slug}-${city.slug}/`, priority: '0.5', changefreq: 'weekly' });
        totalCount++;
      });

      if ((cityIndex + 1) % 250 === 0) {
        console.log(`  Processed ${cityIndex + 1}/${cities.length} cities (${totalCount} combination pages generated)...`);
      }
    });
    
    console.log(`✅ Generated ${totalCount} service-city pages.`);
  }

  // ============================================================
  // 5. GENERATE SERVICE AREAS LISTING PAGE
  // ============================================================
  function buildServiceAreasListing() {
    console.log('Generating service areas index page...');
    const title = `Service Areas - Auto Insurance Services - Call ${CONFIG.phoneFormatted}`;
    const description = `Browse all cities and states where USA Auto Insurance provides auto coverage services. Find cheapest auto insurance near you. Call ${CONFIG.phoneFormatted}.`;
    
    const crumbs = [
      { name: 'Home', url: '/' },
      { name: 'Service Areas', url: '/service-areas/' }
    ];
    
    const schema = [
      getLocalBusinessSchema(),
      getBreadcrumbSchema(crumbs)
    ];

    // Group cities by state
    const byState = {};
    cities.forEach(c => {
      if (!byState[c.state]) byState[c.state] = [];
      byState[c.state].push(c);
    });

    let stateBlocks = '';
    Object.keys(byState).sort().forEach(state => {
      const stateCities = byState[state];
      stateBlocks += `\n<div class="state-group-header">${state}</div>\n<div class="cities-grid">`;
      stateCities.forEach(c => {
        stateBlocks += `\n    <a href="/service-area/${c.slug}/">${c.name}, ${c.stateAbbr}</a>`;
      });
      stateBlocks += `\n</div>`;
    });

    let html = getHead(title, description, '/service-areas/', schema);
    html += getHeader();
    html += `
<div class="w3-container pad0 w3-clear">
    <div class="w3-container w3-content contentX">
        ${getBreadcrumbs(crumbs)}
        <h1 style="text-align:center">Auto Insurance Service Areas</h1>
        <p style="text-align:center;">Compare policies across the United States. Click on your city below to find agents and competitive quotes locally.</p>
        <p>&nbsp;</p>
        ${getCTABox()}
        ${stateBlocks}
        <p>&nbsp;</p>
        ${getCTABox()}
    </div>
</div>
`;
    html += getFooter();
    writeHtmlFile(path.join(CONFIG.outputDir, 'service-areas', 'index.html'), html);
    allUrls.push({ url: '/service-areas/', priority: '0.8', changefreq: 'monthly' });
  }

  // ============================================================
  // 6. GENERATE ABOUT, REVIEWS, PRIVACY PAGES
  // ============================================================
  function buildStaticPages() {
    console.log('Generating static pages (About, Reviews, Privacy)...');

    // About Us
    const aboutTitle = `About Us - USA Auto Insurance Services - Call ${CONFIG.phoneFormatted}`;
    const aboutDesc = `Learn about USA Auto Insurance Services, helping drivers locate cheapest auto insurance rates. Call ${CONFIG.phoneFormatted}.`;
    const aboutCrumbs = [{ name: 'Home', url: '/' }, { name: 'About Us', url: '/about-us/' }];
    let aboutHtml = getHead(aboutTitle, aboutDesc, '/about-us/', getBreadcrumbSchema(aboutCrumbs));
    aboutHtml += getHeader();
    aboutHtml += `
<div class="w3-container pad0 w3-clear"><div class="w3-container w3-content contentX">
    ${getBreadcrumbs(aboutCrumbs)}
    <h1 style="text-align:center">About USA Auto Insurance Services</h1>
    <p>&nbsp;</p>
    <p>USA Auto Insurance Services connects motorists across the country with local and national auto insurance providers. We understand that finding the proper balance of price, service, and coverage limit options is vital. That's why we coordinate quotes from multiple insurance carriers to get you the lowest premium possible.</p>
    <h2>Our Mission</h2>
    <p>We aim to assist home and vehicle owners in finding cheap, compliant coverage packages. By calling <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>, you speak directly with local carrier specialists who can customize your liability, collision, and comprehensive plans.</p>
    <h2>Contact Us</h2>
    <p>For any inquiries, questions, or partnerships, please contact us via email at: <a href="mailto:plusplymarketing@gmail.com"><strong>plusplymarketing@gmail.com</strong></a>.</p>
    ${getCTABox()}
</div></div>`;
    aboutHtml += getFooter();
    writeHtmlFile(path.join(CONFIG.outputDir, 'about-us', 'index.html'), aboutHtml);
    allUrls.push({ url: '/about-us/', priority: '0.5', changefreq: 'monthly' });

    // Reviews
    const revTitle = `Customer Reviews - USA Auto Insurance Services - Call ${CONFIG.phoneFormatted}`;
    const revDesc = `Read customer testimonials and ratings for USA Auto Insurance auto coverage match services. Call ${CONFIG.phoneFormatted}.`;
    const revCrumbs = [{ name: 'Home', url: '/' }, { name: 'Reviews', url: '/reviews/' }];
    let revHtml = getHead(revTitle, revDesc, '/reviews/', getBreadcrumbSchema(revCrumbs));
    revHtml += getHeader();
    revHtml += `
<div class="w3-container pad0 w3-clear"><div class="w3-container w3-content contentX">
    ${getBreadcrumbs(revCrumbs)}
    <h1 style="text-align:center">Customer Reviews</h1>
    <p>&nbsp;</p>
    
    <div class="w3-row-padding">
        <div class="w3-half"><div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
            <h3>⭐⭐⭐⭐⭐ (Highly Recommended)</h3>
            <p>"I saved more than $400 a year on my car policy by calling USA Auto Insurance. They compared Progressive and State Farm options and found me the cheapest premium."</p>
            <p><strong>– David K., Boston MA</strong></p>
        </div></div>
        <div class="w3-half"><div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
            <h3>⭐⭐⭐⭐⭐ (Super Fast)</h3>
            <p>"Getting a direct quote over the phone was incredibly simple. Had my proof of coverage emailed to me in under 10 minutes. Will definitely refer friends."</p>
            <p><strong>– Brenda M., Syracuse NY</strong></p>
        </div></div>
    </div>

    <div class="w3-row-padding">
        <div class="w3-half"><div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
            <h3>⭐⭐⭐⭐⭐ (Outstanding Support)</h3>
            <p>"Outstanding customer support! I called to inquire about direct auto insurance rates and the agent walked me through all options. Saved $350 on my annual policy."</p>
            <p><strong>– James R., Newark NJ</strong></p>
        </div></div>
        <div class="w3-half"><div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
            <h3>⭐⭐⭐⭐⭐ (Great Value)</h3>
            <p>"Quick and straightforward. Being a senior driver, insurance premiums are usually high, but USA Auto Insurance helped me find discount packages for my clean history."</p>
            <p><strong>– Margaret T., Philadelphia PA</strong></p>
        </div></div>
    </div>

    <div class="w3-row-padding">
        <div class="w3-half"><div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
            <h3>⭐⭐⭐⭐⭐ (SR-22 Help)</h3>
            <p>"I had an SR-22 requirement and had trouble getting quotes. Made one call to USA Auto Insurance and they resolved it on same-day. Extremely helpful!"</p>
            <p><strong>– Robert L., Richmond VA</strong></p>
        </div></div>
        <div class="w3-half"><div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
            <h3>⭐⭐⭐⭐⭐ (Teen Driver Discount)</h3>
            <p>"Highly recommend using their service. They compared Progressive and Liberty Mutual quotes for my teen driver, helping us save nearly $500 a year."</p>
            <p><strong>– Susan P., Annapolis MD</strong></p>
        </div></div>
    </div>

    <div class="w3-row-padding">
        <div class="w3-half"><div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
            <h3>⭐⭐⭐⭐⭐ (Incredible Switched)</h3>
            <p>"Incredible value! Called to compare companies and switched my carrier in under 15 minutes. Best customer claims rating comparison."</p>
            <p><strong>– Anthony D., New Haven CT</strong></p>
        </div></div>
        <div class="w3-half"><div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
            <h3>⭐⭐⭐⭐⭐ (Very Professional)</h3>
            <p>"Very professional and friendly support team. Answered all my complex questions about comprehensive vs collision coverage limits. Great rates."</p>
            <p><strong>– Karen S., Rochester NY</strong></p>
        </div></div>
    </div>

    <div class="w3-row-padding">
        <div class="w3-half"><div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
            <h3>⭐⭐⭐⭐⭐ (Low Payments)</h3>
            <p>"USA Auto Insurance direct quote line is a lifesaver. Flexible low down payments allowed me to get my car insured instantly before leaving the dealership."</p>
            <p><strong>– Marcus G., Springfield MA</strong></p>
        </div></div>
        <div class="w3-half"><div class="w3-card w3-margin w3-padding-16 w3-padding specials-2card">
            <h3>⭐⭐⭐⭐⭐ (Affordable Rates)</h3>
            <p>"After checking multiple online calculators, calling their direct number was much faster. They matched me with CURE auto policies that met my budget."</p>
            <p><strong>– Linda W., Jersey City NJ</strong></p>
        </div></div>
    </div>

    ${getCTABox()}
</div></div>`;
    revHtml += getFooter();
    writeHtmlFile(path.join(CONFIG.outputDir, 'reviews', 'index.html'), revHtml);
    allUrls.push({ url: '/reviews/', priority: '0.5', changefreq: 'monthly' });

    // Privacy Policy
    const privTitle = `Privacy Policy - USA Auto Insurance Services`;
    const privDesc = `Privacy Policy and terms for USA Auto Insurance Services.`;
    const privCrumbs = [{ name: 'Home', url: '/' }, { name: 'Privacy Policy', url: '/privacy-policy/' }];
    let privHtml = getHead(privTitle, privDesc, '/privacy-policy/', getBreadcrumbSchema(privCrumbs));
    privHtml += getHeader();
    privHtml += `
<div class="w3-container pad0 w3-clear"><div class="w3-container w3-content contentX">
    ${getBreadcrumbs(privCrumbs)}
    <h1 style="text-align:center">Privacy Policy</h1>
    <p>&nbsp;</p>
    <p>This privacy policy describes how USA Auto Insurance Services compiles, manages, and safeguards personal information when you contact us at <a class="phoneNumber" href="tel:${CONFIG.phone}">${CONFIG.phoneFormatted}</a>.</p>
    <h2>Information Collection & Use</h2>
    <p>We do not store cookies or track user geolocations. Any data you communicate to us verbally or through our contact forms is used solely to match you with registered insurance providers and carriers.</p>
    <h2>Third-Party Connections</h2>
    <p>Our website assists drivers by connecting them with independent third-party carriers. We do not underwrite insurance policies directly.</p>
</div></div>`;
    privHtml += getFooter();
    writeHtmlFile(path.join(CONFIG.outputDir, 'privacy-policy', 'index.html'), privHtml);
    allUrls.push({ url: '/privacy-policy/', priority: '0.3', changefreq: 'yearly' });
  }

  // ============================================================
  // 7. GENERATE PARTITIONED SITEMAPS (GOOGLE SEO COMPLIANT)
  // ============================================================
  function buildSitemaps() {
    console.log('Generating split sitemap.xml files...');
    
    const LIMIT = 35000; // Keep safe below 50,000 URLs limit
    const sitemapsCount = Math.ceil(allUrls.length / LIMIT);
    const sitemapFiles = [];

    for (let i = 0; i < sitemapsCount; i++) {
      const chunk = allUrls.slice(i * LIMIT, (i + 1) * LIMIT);
      const filename = `sitemap-part-${i + 1}.xml`;
      sitemapFiles.push(filename);
      
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk.map(u => `\t<url>
\t\t<loc>${CONFIG.domain}${u.url}</loc>
\t\t<changefreq>${u.changefreq}</changefreq>
\t\t<priority>${u.priority}</priority>
\t</url>`).join('\n')}
</urlset>`;

      fs.writeFileSync(path.join(CONFIG.outputDir, filename), xml, 'utf8');
      console.log(`  Sitemap chunk written: ${filename} (${chunk.length} URLs)`);
    }

    // Write primary sitemap index sitemap.xml
    const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map(file => `\t<sitemap>
\t\t<loc>${CONFIG.domain}/${file}</loc>
\t\t<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
\t</sitemap>`).join('\n')}
</sitemapindex>`;

    fs.writeFileSync(path.join(CONFIG.outputDir, 'sitemap.xml'), indexXml, 'utf8');
    console.log(`✅ Main sitemap index sitemap.xml written referencing ${sitemapsCount} parts.`);
  }

  // Execute Build Pipeline
  buildHomepage();
  buildCategoryPages();
  buildServiceAreasListing();
  buildAreaPages();
  buildComboPages();
  buildStaticPages();
  buildSitemaps();

  const totalPages = allUrls.length;
  console.log('\n======================================================');
  console.log(`🎉 BUILD PIPELINE COMPLETED SUCCESSFULLY!`);
  console.log(`📁 Target Directory: ${CONFIG.outputDir}`);
  console.log(`📞 Target Phone Number: ${CONFIG.phoneFormatted}`);
  console.log(`📄 Total URLs registered in sitemaps: ${totalPages}`);
  console.log('======================================================');
}

run();
