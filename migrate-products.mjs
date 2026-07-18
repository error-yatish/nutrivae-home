import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsDir = path.join(__dirname, 'src', 'content', 'products');
const strapiUrl = 'http://localhost:1337/api/products';

async function migrateProducts() {
    const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'));
    
    let successCount = 0;
    
    for (const file of files) {
        const filePath = path.join(productsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // Strapi v5 payload structure
        const payload = {
            data: {
                name: data.name,
                slug: data.id, // we renamed IDs to slugs previously
                subtitle: data.subtitle,
                category: data.category,
                isNew: data.isNew || false,
                price: parseFloat(data.price) || 100, // Mock price if not exists
                whatsappLink: data.whatsappLink,
                nutrition: data.nutrition,
                specs: data.specs,
                image: data.image,
                publishedAt: new Date().toISOString() // Force publish so it's not a draft
            }
        };

        try {
            const res = await fetch(strapiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                console.log(`✅ Uploaded: ${data.name}`);
                successCount++;
            } else {
                const errorData = await res.json();
                console.error(`❌ Failed to upload ${data.name}:`, errorData);
            }
        } catch (err) {
            console.error(`❌ Connection error for ${data.name}. Is Strapi running?`, err.message);
            process.exit(1);
        }
    }
    
    console.log(`\nMigration complete. Successfully uploaded ${successCount}/${files.length} products to Strapi.`);
}

migrateProducts();
