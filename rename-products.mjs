import fs from 'fs';
import path from 'path';

const dir = 'src/content/products';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

const usedSlugs = new Set();

files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    let baseSlug = slugify(data.name);
    let slug = baseSlug;
    let counter = 1;
    
    while(usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    usedSlugs.add(slug);
    
    data.id = slug; // Update internal ID to match the slug
    
    const newPath = path.join(dir, `${slug}.json`);
    fs.writeFileSync(newPath, JSON.stringify(data, null, 2));
    
    // Delete old file if the name changed
    if (filePath !== newPath) {
        fs.unlinkSync(filePath);
    }
});

console.log(`Renamed ${files.length} product files to SEO-friendly slugs.`);
