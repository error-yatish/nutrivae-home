import fs from 'fs';

let journeysFile = fs.readFileSync('src/pages/journeys.astro', 'utf-8');

// Extract the script block from journeys.astro
const scriptMatch = journeysFile.match(/<script is:inline>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    console.error("Could not find script block in journeys.astro!");
    process.exit(1);
}

let scriptBlock = scriptMatch[1];

// Fix the GSAP bug by removing clearProps entirely
scriptBlock = scriptBlock.replace(/if\s*\(window\.gsap\)\s*\{\s*try\s*\{\s*gsap\.set\(p,\s*\{\s*clearProps:\s*"all"\s*\}\);\s*\}\s*catch\s*\(e\)\s*\{\}\s*\}/g, 
  "// Removed gsap clearProps to preserve inline display styles\n          p.classList.add('animated');");

// Set itemsPerPage for products to 1, and journeys can stay at 4 or we can set both to 1.
// Let's set the variable in a way that we can customize it per file.

// First, fix products.astro
let productsFile = fs.readFileSync('src/pages/products.astro', 'utf-8');
let newProductsScript = scriptBlock.replace('const itemsPerPage = 4;', 'const itemsPerPage = 1;');
// Also update the console log
newProductsScript = newProductsScript.replace(/console\.log\("Init filter & pagination for " \+ "[a-z]+"\);/g, 'console.log("Init filter & pagination for products");');

// We need to replace the entire <script is:inline>...</script> block in products.astro
productsFile = productsFile.replace(/<script is:inline>[\s\S]*?<\/script>/, `<script is:inline>${newProductsScript}</script>`);
fs.writeFileSync('src/pages/products.astro', productsFile);
console.log('Fixed products.astro');

// Now fix journeys.astro (maybe keep itemsPerPage at 4 or 1? The user specifically said "On product page". Let's leave journeys at 4, just fix the GSAP bug.)
let newJourneysScript = scriptBlock; 
journeysFile = journeysFile.replace(/<script is:inline>[\s\S]*?<\/script>/, `<script is:inline>${newJourneysScript}</script>`);
fs.writeFileSync('src/pages/journeys.astro', journeysFile);
console.log('Fixed journeys.astro');
