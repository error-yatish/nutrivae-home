import fs from 'fs';
import path from 'path';

const basePath = path.join(process.cwd(), 'backend', 'src', 'api');

function createContentType(name, pluralName, attributes) {
    const apiPath = path.join(basePath, name.toLowerCase());
    const contentTypesPath = path.join(apiPath, 'content-types', name.toLowerCase());
    const controllersPath = path.join(apiPath, 'controllers');
    const routesPath = path.join(apiPath, 'routes');
    const servicesPath = path.join(apiPath, 'services');

    fs.mkdirSync(contentTypesPath, { recursive: true });
    fs.mkdirSync(controllersPath, { recursive: true });
    fs.mkdirSync(routesPath, { recursive: true });
    fs.mkdirSync(servicesPath, { recursive: true });

    // schema.json
    const schema = {
        kind: "collectionType",
        collectionName: pluralName.toLowerCase(),
        info: {
            singularName: name.toLowerCase(),
            pluralName: pluralName.toLowerCase(),
            displayName: name,
        },
        options: {
            draftAndPublish: true,
        },
        pluginOptions: {},
        attributes: attributes
    };
    fs.writeFileSync(path.join(contentTypesPath, 'schema.json'), JSON.stringify(schema, null, 2));

    // controller
    const controller = `
import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::${name.toLowerCase()}.${name.toLowerCase()}');
`;
    fs.writeFileSync(path.join(controllersPath, `${name.toLowerCase()}.ts`), controller.trim());

    // route
    const route = `
import { factories } from '@strapi/strapi';
export default factories.createCoreRouter('api::${name.toLowerCase()}.${name.toLowerCase()}');
`;
    fs.writeFileSync(path.join(routesPath, `${name.toLowerCase()}.ts`), route.trim());

    // service
    const service = `
import { factories } from '@strapi/strapi';
export default factories.createCoreService('api::${name.toLowerCase()}.${name.toLowerCase()}');
`;
    fs.writeFileSync(path.join(servicesPath, `${name.toLowerCase()}.ts`), service.trim());
}

// 1. Product
createContentType('Product', 'Products', {
    name: { type: "string", required: true },
    slug: { type: "uid", targetField: "name", required: true },
    subtitle: { type: "string" },
    category: { type: "string" },
    description: { type: "text" },
    isNew: { type: "boolean", default: false },
    price: { type: "decimal" },
    whatsappLink: { type: "string" },
    nutrition: { type: "string" },
    specs: { type: "json" },
    image: { type: "string" }, // Keeping string for now for easy migration
    journeys: { type: "relation", relation: "manyToMany", target: "api::journey.journey" }
});

// 2. Journey
createContentType('Journey', 'Journeys', {
    farmer: { type: "string", required: true },
    location: { type: "string" },
    times: { type: "text" },
    images: { type: "text" }
});

// 3. Blog
createContentType('Blog', 'Blogs', {
    title: { type: "string", required: true },
    slug: { type: "uid", targetField: "title", required: true },
    date: { type: "date" },
    image: { type: "string" },
    summary: { type: "text" },
    content: { type: "richtext" }
});

// 4. Order
createContentType('Order', 'Orders', {
    user: { type: "relation", relation: "manyToOne", target: "plugin::users-permissions.user" },
    products: { type: "json" }, // Simple JSON cart storage
    totalAmount: { type: "decimal" },
    status: { type: "enumeration", enum: ["pending", "paid", "shipped", "delivered"], default: "pending" },
    stripeSessionId: { type: "string" }
});

console.log("Strapi Content Types successfully created!");
