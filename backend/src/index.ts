import fs from 'fs';
import path from 'path';

declare const __dirname: string;


export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: any) {

    
    // Path to the frontend Astro content folder
    // When compiled, this file is in backend/dist/src/index.js
    const contentDir = path.join(__dirname, '../../../src/content');
    
    // --- 1. Product Enrichment ---
    try {
      const products = await strapi.db.query('api::product.product').findMany({ limit: 100 });
      console.log(`[Bootstrap] Found ${products.length} products to check for enrichment.`);
      let enrichedCount = 0;
      for (const product of products) {
        if (!product.description || String(product.description).length < 20) {
          const isSpice = product.category === 'spices';
          const isLentil = product.category === 'lentils';
          let basePrice = isSpice ? 250 : isLentil ? 180 : 150;
          await strapi.db.query('api::product.product').update({
            where: { id: product.id },
            data: {
              price: basePrice + Math.floor(Math.random() * 50),
              description: `Discover the authentic taste of our premium ${product.name}. Sourced directly from local farmers using sustainable practices, this product ensures maximum nutritional benefits for you and your family. Free from artificial chemicals and rich in natural goodness.`
            }
          });
          enrichedCount++;
        }
      }
      console.log(`[Bootstrap] Enriched ${enrichedCount} products with prices and descriptions.`);
    } catch (e) {
      console.error('[Bootstrap] Error enriching products:', e);
    }
    
    if (fs.existsSync(contentDir)) {

      // --- 2. Journey Migration ---
      const journeysDir = path.join(contentDir, 'journeys');
      if (fs.existsSync(journeysDir)) {
        let journeys = await strapi.documents('api::journey.journey').findMany();
        if (journeys.length === 0 || journeys.some((j: any) => !j.name)) {
          if (journeys.length > 0) {
            console.log('[Bootstrap] Deleting incomplete journeys to re-migrate...');
            for (const j of journeys) {
              await strapi.documents('api::journey.journey').delete({ documentId: j.documentId });
            }
          }
          const files = fs.readdirSync(journeysDir).filter((f: any) => f.endsWith('.json'));
          console.log(`[Bootstrap] Migrating ${files.length} journeys...`);
          for (const file of files) {
            const data = JSON.parse(fs.readFileSync(path.join(journeysDir, file), 'utf-8'));
            await strapi.documents('api::journey.journey').create({
              data: {
                name: data.name,
                category: data.category,
                image: data.image,
                farmer: data.farmer,
                location: data.location,
                productStatus: data.status,
                nextHarvest: data.nextHarvest,
                whatsappLink: data.whatsappLink,
                times: data.journey ? data.journey.times : '',
                images: data.journey ? data.journey.images : ''
              },
              status: 'published'
            });
          }
        }
      }

      // --- 3. Blog Migration ---
      const blogsDir = path.join(contentDir, 'blog');
      if (fs.existsSync(blogsDir)) {
        let blogs = await strapi.documents('api::blog.blog').findMany();
        if (blogs.length === 0 || blogs.some((b: any) => !b.image)) {
          if (blogs.length > 0) {
            console.log('[Bootstrap] Deleting incomplete blogs to re-migrate...');
            for (const b of blogs) {
              await strapi.documents('api::blog.blog').delete({ documentId: b.documentId });
            }
          }
          const files = fs.readdirSync(blogsDir).filter((f: any) => f.endsWith('.md'));
          console.log(`[Bootstrap] Migrating ${files.length} blogs...`);
          for (const file of files) {
            const contentStr = fs.readFileSync(path.join(blogsDir, file), 'utf-8');
            const match = contentStr.match(/---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]+)/);
            if (match) {
              const frontmatterRaw = match[1];
              const content = match[2].trim();
              
              const titleMatch = frontmatterRaw.match(/title:\s*['"]?([^'"\r\n]+)['"]?/);
              const dateMatch = frontmatterRaw.match(/date:\s*([^'"\r\n]+)/);
              const imageMatch = frontmatterRaw.match(/image:\s*['"]?([^'"\r\n]+)['"]?/);
              const summaryMatch = frontmatterRaw.match(/summary:\s*['"]?([^'"\r\n]+)['"]?/);
              
              const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
              
              // Ensure date is yyyy-MM-dd format or valid Date for Strapi
              let formattedDate = new Date().toISOString().split('T')[0];
              if (dateMatch) {
                  const parsedDate = new Date(dateMatch[1]);
                  if (!isNaN(parsedDate.getTime())) {
                      formattedDate = parsedDate.toISOString().split('T')[0];
                  }
              }
              
              await strapi.documents('api::blog.blog').create({
                data: {
                  title: title,
                  slug: file.replace('.md', ''),
                  date: formattedDate,
                  image: imageMatch ? imageMatch[1] : '',
                  summary: summaryMatch ? summaryMatch[1] : '',
                  content: content
                },
                status: 'published'
              });
            }
          }
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
              console.log(`[Bootstrap] Granted order create permission to ${type} role.`);
            }
          }
        }
      } catch (e) {
        console.error('[Bootstrap] Error setting order permissions:', e);
      }
    }
  },
};
