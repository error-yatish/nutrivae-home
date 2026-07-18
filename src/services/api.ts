

// Environment variables can be configured in Vercel settings or .env file
const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://127.0.0.1:1337';
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN || '';

/**
 * Service to interact with the Strapi REST API.
 * Currently falls back to local content collections until Strapi is fully populated.
 */

export async function getProducts() {
    try {
        const res = await fetch(`${STRAPI_URL}/api/products?populate=*`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${STRAPI_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        if(res.ok) {
            const json = await res.json();
            // Map Strapi's response format to match the frontend expectations
            // Strapi returns an array in json.data. Each item has .documentId, .name, etc.
            // But our Astro expects { data: { id, name, ... } } for each product.
            return json.data.map((p) => ({
                data: {
                    id: p.slug,
                    name: p.name,
                    subtitle: p.subtitle,
                    category: p.category,
                    isNew: p.isNew,
                    price: p.price,
                    whatsappLink: p.whatsappLink,
                    nutrition: p.nutrition,
                    description: p.description,
                    specs: p.specs,
                    image: p.image
                }
            }));
        }
    } catch (err) {
        console.error('Failed to fetch live products from Strapi:', err);
    }
    
    // Fallback: load from local JSON until Strapi is active
    return await getCollection('products');
}

export async function getJourneys() {
    try {
        const res = await fetch(`${STRAPI_URL}/api/journeys?populate=*`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${STRAPI_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        if(res.ok) {
            const json = await res.json();
            // Map to Astro collection format { id, data: { ... } }
            return json.data.map((j) => ({
                id: j.documentId,
                data: {
                    name: j.name,
                    category: j.category,
                    image: j.image ? (j.image.startsWith('/') ? j.image : '/' + j.image) : '',
                    farmer: j.farmer,
                    location: j.location,
                    status: j.productStatus,
                    nextHarvest: j.nextHarvest,
                    whatsappLink: j.whatsappLink,
                    journey: {
                        times: j.times,
                        images: j.images
                    }
                }
            }));
        }
    } catch (err) {
        console.error('Failed to fetch live journeys from Strapi:', err);
    }
    
    // Fallback if Strapi is completely down
    return [];
}

export async function getBlogs() {
    try {
        const res = await fetch(`${STRAPI_URL}/api/blogs?populate=*`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${STRAPI_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        if(res.ok) {
            const json = await res.json();
            // Map to Astro collection format { slug, data: { title, ... }, body: content }
            return json.data.map((b) => ({
                slug: b.slug,
                data: {
                    title: b.title,
                    date: b.date,
                    image: b.image ? (b.image.startsWith('/') ? b.image : '/' + b.image) : '',
                    summary: b.summary
                },
                body: b.content
            }));
        }
    } catch (err) {
        console.error('Failed to fetch live blogs from Strapi:', err);
    }
    
    // Fallback if Strapi is completely down
    return [];
}
