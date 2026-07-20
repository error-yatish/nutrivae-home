module.exports = async ({ strapi }) => {
  console.log('[Seed] Starting database seed...');

  // --- 1. Seed Products ---
  const products = [
    { variants: [{ size: '500g', price: 180 }, { size: '1kg', price: 342 }], name: 'Toor Daal', slug: 'toor-daal', category: 'daal protein', price: 180, subtitle: 'Premium Toor Daal (Pigeon Peas)', image: 'assets/toor_daal.png', nutrition: 'High Protein' },
    { variants: [{ size: '500g', price: 160 }, { size: '1kg', price: 304 }], name: 'Moong Daal', slug: 'moong-daal', category: 'daal protein', price: 160, subtitle: 'Premium Moong Daal (Split Yellow Mung)', image: 'assets/moong_daal.png', nutrition: 'High Protein' },
    { variants: [{ size: '500g', price: 140 }, { size: '1kg', price: 266 }], name: 'Mungfali', slug: 'mungfali', category: 'nuts protein', price: 140, subtitle: 'Premium Peanuts', image: 'assets/mungfali.png', nutrition: 'Healthy Fats' },
    { variants: [{ size: '500g', price: 220 }, { size: '1kg', price: 418 }], name: 'Black Till', slug: 'black-till', category: 'seeds protein', price: 220, subtitle: 'Premium Black Sesame Seeds', image: 'assets/black_till.png', nutrition: 'Rich in Calcium' },
    { variants: [{ size: '500g', price: 150 }, { size: '1kg', price: 285 }], name: 'Whole Mung', slug: 'whole-mung', category: 'daal protein', price: 150, subtitle: 'Premium Whole Green Mung', image: 'assets/whole_mung.png', nutrition: 'High Fiber' },
    { variants: [{ size: '500g', price: 190 }, { size: '1kg', price: 361 }], name: 'Basmati Rice', slug: 'basmati-rice', category: 'grains', price: 190, subtitle: 'Premium Basmati Rice', image: 'assets/basmati_rice.png', nutrition: 'Aromatic' },
    { variants: [{ size: '500g', price: 210 }, { size: '1kg', price: 399 }], name: 'White Till', slug: 'white-till', category: 'seeds protein', price: 210, subtitle: 'Premium White Sesame Seeds', image: 'assets/white_till.png', nutrition: 'Rich in Minerals' },
    { variants: [{ size: '500g', price: 90 }, { size: '1kg', price: 171 }], name: 'Whole Bajra', slug: 'whole-bajra', category: 'grains', price: 90, subtitle: 'Premium Pearl Millet', image: 'assets/bajra.png', nutrition: 'Iron Rich' },
    { variants: [{ size: '500g', price: 110 }, { size: '1kg', price: 209 }], name: 'Bajra Flour', slug: 'bajra-flour', category: 'flour', price: 110, subtitle: 'Premium Bajra Flour', image: 'assets/bajra-flour.png', nutrition: 'Gluten Free' },
    { variants: [{ size: '500g', price: 120 }, { size: '1kg', price: 228 }], name: 'Black Chana', slug: 'black-chana', category: 'pulses', price: 120, subtitle: 'Premium Black Chickpeas', image: 'assets/black-chana.png', nutrition: 'High Iron' },
    { variants: [{ size: '500g', price: 115 }, { size: '1kg', price: 218 }], name: 'Brown Chana', slug: 'brown-chana', category: 'pulses', price: 115, subtitle: 'Premium Brown Chickpeas', image: 'assets/brown-chana.png', nutrition: 'High Protein' },
    { variants: [{ size: '500g', price: 80 }, { size: '1kg', price: 152 }], name: 'Carom Seeds', slug: 'carom-seeds', category: 'spices', price: 80, subtitle: 'Premium Ajwain Seeds', image: 'assets/carom.png', nutrition: 'Digestive Aid' },
    { variants: [{ size: '500g', price: 130 }, { size: '1kg', price: 247 }], name: 'Chana Dal', slug: 'chana-dal', category: 'pulses', price: 130, subtitle: 'Premium Split Bengal Gram', image: 'assets/chana-dal.png', nutrition: 'Low GI' },
    { variants: [{ size: '500g', price: 70 }, { size: '1kg', price: 133 }], name: 'Coriander Powder', slug: 'coriander-powder', category: 'spices', price: 70, subtitle: 'Premium Coriander Powder', image: 'assets/coriander-powder.png', nutrition: '100% Pure' },
    { variants: [{ size: '500g', price: 85 }, { size: '1kg', price: 161 }], name: 'Cumin Coriander Powder', slug: 'cumin-coriander-powder', category: 'spices', price: 85, subtitle: 'Premium Cumin Coriander Powder', image: 'assets/cumin-coriander-powder.png', nutrition: 'Perfect Blend' },
    { variants: [{ size: '500g', price: 95 }, { size: '1kg', price: 180 }], name: 'Cumin Seeds', slug: 'cumin-seeds', category: 'spices', price: 95, subtitle: 'Premium Jeera Seeds', image: 'assets/cumin.png', nutrition: 'Digestive' },
    { variants: [{ size: '500g', price: 75 }, { size: '1kg', price: 142 }], name: 'Fennel Seeds', slug: 'fennel-seeds', category: 'spices', price: 75, subtitle: 'Premium Saunf Seeds', image: 'assets/fennel.png', nutrition: 'Aromatic' },
    { variants: [{ size: '500g', price: 140 }, { size: '1kg', price: 266 }], name: 'Moong Flour', slug: 'moong-flour', category: 'flour', price: 140, subtitle: 'Premium Moong Flour', image: 'assets/moong-flour.png', nutrition: 'High Protein' },
    { variants: [{ size: '500g', price: 100 }, { size: '1kg', price: 190 }], name: 'Red Chilli Powder', slug: 'red-chilli-powder', category: 'spices', price: 100, subtitle: 'Premium Red Chilli Powder', image: 'assets/red-chilli-powder.png', nutrition: 'Spicy & Pure' },
    { variants: [{ size: '500g', price: 105 }, { size: '1kg', price: 199 }], name: 'Soyabean', slug: 'soyabean', category: 'pulses', price: 105, subtitle: 'Premium Soybeans', image: 'assets/soyabean.png', nutrition: 'Complete Protein' },
    { variants: [{ size: '500g', price: 65 }, { size: '1kg', price: 123 }], name: 'Whole Coriander', slug: 'whole-coriander', category: 'spices', price: 65, subtitle: 'Premium Whole Coriander', image: 'assets/whole-coriander.png', nutrition: '100% Natural' },
    { variants: [{ size: '500g', price: 80 }, { size: '1kg', price: 152 }], name: 'Whole Wheat', slug: 'whole-wheat', category: 'grains', price: 80, subtitle: 'Premium Whole Wheat', image: 'assets/whole_wheat.jpg', nutrition: 'High Fiber' }
  ];

  for (const p of products) {
    const existing = await strapi.db.query('api::product.product').findOne({ where: { slug: p.slug } });
    if (!existing) {
      await strapi.documents('api::product.product').create({
        data: {
          ...p,
          description: `Discover the authentic taste of our premium ${p.name}. Sourced directly from local farmers using sustainable practices, this product ensures maximum nutritional benefits for you and your family. Free from artificial chemicals and rich in natural goodness.`,
          specs: {
            "Plant-Based": "🌱 Yes",
            "Nutritious": "💪 High",
            "Clean Label": "✦ 100% Pure"
          },
          whatsappLink: `https://wa.me/919824664973?text=Hi%2C%20I%20would%20like%20to%20order%3A%0A%0AProduct%3A%20${encodeURIComponent(p.name)}%0APack%20Size%3A%201kg%0AQuantity%3A%201%0A%0APlease%20let%20me%20know%20the%20total%20amount%20and%20payment%20details.`
        },
        status: 'published'
      });
      console.log(`[Seed] Created product: ${p.name}`);
    }
  }

  // --- 2. Seed Journeys ---
  const journeys = [
    { name: 'Toor Daal', category: 'pulses', farmer: 'Ramesh Patel', location: 'Gujarat Farm', productStatus: 'Harvested', nextHarvest: 'Oct 2026', whatsappLink: 'https://wa.me/919824664973?text=Hello%20Nutrivae%2C%0AI%27d%20like%20to%20order%3A%0AToor%20Daal%20500g%0AQuantity%3A%202%0APlease%20help%20me%20place%20the%20order.', image: 'assets/toor_daal.png' },
    { name: 'Moong Daal', category: 'pulses', farmer: 'Anil Singh', location: 'Rajasthan Farm', productStatus: 'Sowing', nextHarvest: 'Nov 2026', whatsappLink: 'https://wa.me/919824664973?text=Hello%20Nutrivae%2C%0AI%27d%20like%20to%20order%3A%0AMoong%20Daal%20500g%0AQuantity%3A%202%0APlease%20help%20me%20place%20the%20order.', image: 'assets/moong_daal.png' },
    { name: 'Toor Daal', category: 'pulses', farmer: 'Vikram Rao', location: 'Maharashtra Farm', productStatus: 'Irrigating', nextHarvest: 'Dec 2026', whatsappLink: 'https://wa.me/919824664973?text=Hello%20Nutrivae%2C%0AI%27d%20like%20to%20order%3A%0AToor%20Daal%20500g%0AQuantity%3A%202%0APlease%20help%20me%20place%20the%20order.', image: 'assets/toor_daal.png' },
    { name: 'Mungfali (Peanuts)', category: 'nuts', farmer: 'Karsan Bhai', location: 'Saurashtra Farm', productStatus: 'Harvested', nextHarvest: 'Sep 2026', whatsappLink: 'https://wa.me/919824664973?text=Hello%20Nutrivae%2C%0AI%27d%20like%20to%20order%3A%0AMungfali%20%28Peanuts%29%20500g%0AQuantity%3A%202%0APlease%20help%20me%20place%20the%20order.', image: 'assets/mungfali.png' }
  ];

  for (const j of journeys) {
    const existing = await strapi.db.query('api::journey.journey').findOne({ where: { name: j.name, farmer: j.farmer } });
    if (!existing) {
      await strapi.documents('api::journey.journey').create({
        data: {
          ...j,
          times: 'Soil Prep: 15 days, Sowing: 10 days, Growing: 90 days, Harvest: 5 days',
          images: 'assets/soil_prep.png,assets/sowing.png,assets/irrigation.png,assets/harvesting.png'
        },
        status: 'published'
      });
      console.log(`[Seed] Created journey: ${j.name} (${j.farmer})`);
    }
  }

  // --- 3. Seed Blogs ---
  const blogs = [
    { title: 'Plant-based nutrition myths', slug: 'plant-based-nutrition-myths', summary: 'Debunking common misconceptions about plant foods.', image: 'assets/hero_lifestyle.png', content: 'Plant-based nutrition is often misunderstood. A common myth is that you cannot get enough protein from a vegetarian or plant-based diet. In reality, lentils, chickpeas, chia seeds, and whole grains provide substantial amounts of complete protein when consumed in varied combinations. Sustainable health starts with clean, whole foods sourced responsibly.' },
    { title: 'Sustainable sourcing explained', slug: 'sustainable-sourcing-explained', summary: 'How we ensure responsible farming practices.', image: 'assets/farm_field.png', content: 'Sustainable sourcing means working hand-in-hand with local farmers to ensure that agriculture respects the local ecosystem. We minimize artificial inputs, prioritize soil health, and ensure fair pay for farmers. By doing so, we deliver nutrient-rich whole foods while protecting the soil for generations to come.' },
    { title: 'Cooking with Nutrivae', slug: 'cooking-with-nutrivae', summary: 'Simple recipes to incorporate our products.', image: 'assets/ingredients_flat.png', content: 'Cooking healthy whole foods is simple and delicious. Try our whole mung daal or basmati rice prepared with traditional spices. Soaking lentils beforehand increases their digestibility and nutritional absorption. Nutrivae brings the pure goodness of farm-fresh ingredients straight to your kitchen.' }
  ];

  for (const b of blogs) {
    const existing = await strapi.db.query('api::blog.blog').findOne({ where: { slug: b.slug } });
    if (!existing) {
      await strapi.documents('api::blog.blog').create({
        data: {
          ...b,
          date: new Date().toISOString().split('T')[0]
        },
        status: 'published'
      });
      console.log(`[Seed] Created blog: ${b.title}`);
    }
  }

  // --- 4. Auto-grant Order Create Permission ---
  try {
    for (const type of ['public', 'authenticated']) {
      const role = await strapi.query('plugin::users-permissions.role').findOne({ where: { type } });
      if (role) {
        const permExists = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { action: 'api::order.order.create', role: role.id }
        });
        if (!permExists) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: { action: 'api::order.order.create', role: role.id }
          });
          console.log(`[Seed] Granted order create permission to ${type} role.`);
        }
        
        // Also grant find and findOne permissions for products, blogs, journeys so frontend can read them!
        const actionsToGrant = [
          'api::product.product.find',
          'api::product.product.findOne',
          'api::blog.blog.find',
          'api::blog.blog.findOne',
          'api::journey.journey.find',
          'api::journey.journey.findOne'
        ];
        
        for (const action of actionsToGrant) {
          const actExists = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { action, role: role.id }
          });
          if (!actExists) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: { action, role: role.id }
            });
            console.log(`[Seed] Granted ${action} permission to ${type} role.`);
          }
        }
      }
    }
  } catch (e) {
    console.error('[Seed] Error setting users permissions:', e);
  }

  console.log('[Seed] Database seed completed successfully!');
};
