import fs from 'fs';

let productsFile = fs.readFileSync('src/pages/products.astro', 'utf-8');

// Replace the View Journey button with a View Details link to the PDP
productsFile = productsFile.replace(
    /\{p\.data\.journey && \(\s*<button\s*class="btn-journey"[^>]*>View Journey<\/button>\s*\)\}/g,
    `<a href={\`/product/\${p.data.id}\`} class="btn-journey" style="text-decoration:none;">View Details</a>`
);

// Make the product image a link to the PDP
productsFile = productsFile.replace(
    /<img src=\{p\.data\.image\} alt=\{p\.data\.name\} \/>/g,
    `<a href={\`/product/\${p.data.id}\`}><img src={p.data.image} alt={p.data.name} style="transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/></a>`
);

// Make the product title a link
productsFile = productsFile.replace(
    /<h3>\{p\.data\.name\}<\/h3>/g,
    `<h3><a href={\`/product/\${p.data.id}\`} style="color: inherit; text-decoration: none;">{p.data.name}</a></h3>`
);

fs.writeFileSync('src/pages/products.astro', productsFile);
console.log('Updated products.astro links.');

// Also update index.astro
let indexFile = fs.readFileSync('src/pages/index.astro', 'utf-8');

// The index page might have a hardcoded products grid or something?
// Wait, index.astro has a hardcoded HTML products grid, I haven't made index.astro products dynamic yet! 
// The user approved "Products and journeys is not dynamic yet" and I made `products.astro` dynamic, but `index.astro` might still have hardcoded products?
// Let's check!
