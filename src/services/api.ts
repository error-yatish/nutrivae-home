

// Environment variables can be configured in settings or .env file
const STRAPI_URL = (typeof process !== 'undefined' && process.env && process.env.STRAPI_URL) || import.meta.env.STRAPI_URL || 'http://127.0.0.1:1337';
const STRAPI_TOKEN = (typeof process !== 'undefined' && process.env && process.env.STRAPI_TOKEN) || import.meta.env.STRAPI_TOKEN || '';

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
                    documentId: p.documentId || p.id,
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
    // Temporarily disabled Strapi fetch to show 15 fallback records for pagination testing
    /*
    try {
        const res = await fetch(\`\${STRAPI_URL}/api/journeys?populate=*\`, {
            method: 'GET',
            headers: {
                'Authorization': \`Bearer \${STRAPI_TOKEN}\`,
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
    */
    
    // Fallback data with 15 records
        return [
        {
            id: 'j1',
            data: {
                name: 'Organic Toor Daal',
                category: 'harvesting',
                image: '/assets/toor_daal.png',
                farmer: 'Ramesh Singh',
                location: 'Pune, Maharashtra',
                status: 'Harvesting',
                nextHarvest: '15th Oct, 2026',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'May 2026|Jun 2026|Oct 2026|Pending|Pending',
                    images: '/assets/packaging.png|/assets/farm_field.png|/assets/irrigation.png||'
                }
            }
        },
        {
            id: 'j2',
            data: {
                name: 'Desi Chana Daal',
                category: 'ready',
                image: '/assets/chana-dal.png',
                farmer: 'Suresh Patel',
                location: 'Surat, Gujarat',
                status: 'Ready for Sale',
                nextHarvest: 'Available Now',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Jan 2026|Feb 2026|Jun 2026|Jul 2026|Aug 2026',
                    images: '/assets/farm_field.png||||'
                }
            }
        },
        {
            id: 'j3',
            data: {
                name: 'Whole Green Moong',
                category: 'planting',
                image: '/assets/whole_mung.png',
                farmer: 'Anita Devi',
                location: 'Jaipur, Rajasthan',
                status: 'Planting Phase',
                nextHarvest: '20th Nov, 2026',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Jun 2026|Jul 2026|Pending|Pending|Pending',
                    images: '/assets/irrigation.png||||'
                }
            }
        },
        {
            id: 'j4',
            data: {
                name: 'Premium Basmati Rice',
                category: 'soil',
                image: '/assets/basmati_rice.png',
                farmer: 'Gurpreet Singh',
                location: 'Ludhiana, Punjab',
                status: 'Soil Preparation',
                nextHarvest: 'Jan 2027',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Jul 2026|Pending|Pending|Pending|Pending',
                    images: '/assets/soil_prep.png||||'
                }
            }
        },
        {
            id: 'j5',
            data: {
                name: 'Sona Masoori Rice',
                category: 'harvesting',
                image: '/assets/black-chana.png',
                farmer: 'Raju G',
                location: 'Nellore, Andhra Pradesh',
                status: 'Harvesting',
                nextHarvest: '5th Oct, 2026',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Apr 2026|May 2026|Oct 2026|Pending|Pending',
                    images: '/assets/sowing.png||||'
                }
            }
        },
        {
            id: 'j6',
            data: {
                name: 'Red Masoor Daal',
                category: 'ready',
                image: '/assets/brown-chana.png',
                farmer: 'Lalitha K',
                location: 'Indore, MP',
                status: 'Ready for Sale',
                nextHarvest: 'Available Now',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Dec 2025|Jan 2026|May 2026|Jun 2026|Jul 2026',
                    images: '/assets/harvesting.png||||'
                }
            }
        },
        {
            id: 'j7',
            data: {
                name: 'Organic Urad Daal',
                category: 'planting',
                image: '/assets/whole_wheat.jpg',
                farmer: 'Mohan Lal',
                location: 'Bhopal, MP',
                status: 'Planting Phase',
                nextHarvest: '10th Dec, 2026',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Jul 2026|Aug 2026|Pending|Pending|Pending',
                    images: '/assets/packaging.png||||'
                }
            }
        },
        {
            id: 'j8',
            data: {
                name: 'Kala Chana',
                category: 'soil',
                image: '/assets/bajra.png',
                farmer: 'Vikram Rajput',
                location: 'Udaipur, Rajasthan',
                status: 'Soil Preparation',
                nextHarvest: 'Feb 2027',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Aug 2026|Pending|Pending|Pending|Pending',
                    images: '/assets/farm_field.png||||'
                }
            }
        },
        {
            id: 'j9',
            data: {
                name: 'Kabuli Chana',
                category: 'ready',
                image: '/assets/mungfali.png',
                farmer: 'Singh Farms',
                location: 'Amritsar, Punjab',
                status: 'Ready for Sale',
                nextHarvest: 'Available Now',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Nov 2025|Dec 2025|Apr 2026|May 2026|Jun 2026',
                    images: '/assets/irrigation.png||||'
                }
            }
        },
        {
            id: 'j10',
            data: {
                name: 'Organic Rajma',
                category: 'harvesting',
                image: '/assets/toor_daal.png',
                farmer: 'Pawan Kumar',
                location: 'Jammu, J&K',
                status: 'Harvesting',
                nextHarvest: '1st Nov, 2026',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'May 2026|Jun 2026|Oct 2026|Pending|Pending',
                    images: '/assets/soil_prep.png||||'
                }
            }
        },
        {
            id: 'j11',
            data: {
                name: 'Brown Rice',
                category: 'ready',
                image: '/assets/chana-dal.png',
                farmer: 'Srikanth',
                location: 'Tanjore, Tamil Nadu',
                status: 'Ready for Sale',
                nextHarvest: 'Available Now',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Jan 2026|Feb 2026|Jul 2026|Aug 2026|Sep 2026',
                    images: '/assets/sowing.png||||'
                }
            }
        },
        {
            id: 'j12',
            data: {
                name: 'Black Wheat',
                category: 'planting',
                image: '/assets/whole_mung.png',
                farmer: 'Hardeep',
                location: 'Karnal, Haryana',
                status: 'Planting Phase',
                nextHarvest: 'Mar 2027',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Sep 2026|Oct 2026|Pending|Pending|Pending',
                    images: '/assets/harvesting.png||||'
                }
            }
        },
        {
            id: 'j13',
            data: {
                name: 'Foxtail Millet',
                category: 'harvesting',
                image: '/assets/basmati_rice.png',
                farmer: 'Narayan',
                location: 'Mysuru, Karnataka',
                status: 'Harvesting',
                nextHarvest: '20th Oct, 2026',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Jul 2026|Aug 2026|Oct 2026|Pending|Pending',
                    images: '/assets/packaging.png||||'
                }
            }
        },
        {
            id: 'j14',
            data: {
                name: 'Pearl Millet (Bajra)',
                category: 'soil',
                image: '/assets/black-chana.png',
                farmer: 'Babu Ram',
                location: 'Jodhpur, Rajasthan',
                status: 'Soil Preparation',
                nextHarvest: 'Feb 2027',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'Oct 2026|Pending|Pending|Pending|Pending',
                    images: '/assets/farm_field.png||||'
                }
            }
        },
        {
            id: 'j15',
            data: {
                name: 'Finger Millet (Ragi)',
                category: 'ready',
                image: '/assets/brown-chana.png',
                farmer: 'Gowda Farms',
                location: 'Hassan, Karnataka',
                status: 'Ready for Sale',
                nextHarvest: 'Available Now',
                whatsappLink: 'https://wa.me/919999999999',
                journey: {
                    times: 'May 2026|Jun 2026|Sep 2026|Oct 2026|Oct 2026',
                    images: '/assets/irrigation.png||||'
                }
            }
        }
    ];
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

export async function createProduct(jwt, payload) {
    const res = await fetch(`${STRAPI_URL}/api/products`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: payload })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function updateProduct(jwt, documentId, payload) {
    const res = await fetch(`${STRAPI_URL}/api/products/${documentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: payload })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function deleteProduct(jwt, documentId) {
    const res = await fetch(`${STRAPI_URL}/api/products/${documentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
