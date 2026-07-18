import fs from 'fs';

let content = fs.readFileSync('src/pages/index.astro', 'utf-8');

// Global link fixes
content = content.replace(/href="products\.html"/g, 'href="/products"');

// Specific product links
content = content.replace(/<a href="\/products" class="product-cta" id="toor-cta">View Details →<\/a>/, '<a href="/product/toor-daal" class="product-cta" id="toor-cta">View Details →</a>');
content = content.replace(/<a href="\/products" class="product-cta" id="moong-cta">View Details →<\/a>/, '<a href="/product/moong-daal" class="product-cta" id="moong-cta">View Details →</a>');
content = content.replace(/<a href="\/products" class="product-cta" id="mungfali-cta">View Details →<\/a>/, '<a href="/product/mungfali" class="product-cta" id="mungfali-cta">View Details →</a>');
// And the others that don't have an ID
content = content.replace(/<div class="product-card" data-animate="fade-up" data-delay="300" id="product-black-till">[\s\S]*?<a href="\/products" class="product-cta">View Details →<\/a>/g, 
  (match) => match.replace('href="/products"', 'href="/product/black-till"'));
content = content.replace(/<div class="product-card" data-animate="fade-up" data-delay="400" id="product-whole-mung">[\s\S]*?<a href="\/products" class="product-cta">View Details →<\/a>/g, 
  (match) => match.replace('href="/products"', 'href="/product/whole-mung"'));
content = content.replace(/<div class="product-card" data-animate="fade-up" data-delay="500" id="product-basmati">[\s\S]*?<a href="\/products" class="product-cta">View Details →<\/a>/g, 
  (match) => match.replace('href="/products"', 'href="/product/basmati-rice"'));

fs.writeFileSync('src/pages/index.astro', content);
console.log('Updated index.astro product links.');
