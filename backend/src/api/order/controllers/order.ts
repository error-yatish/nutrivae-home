/**
 * order controller
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }: { strapi: any }) => ({
  async find(ctx: any) {
    const user = ctx.state.user;
    
    // Only allow fetching if authenticated
    if (!user) {
      return ctx.unauthorized('Not authenticated');
    }
    
    // Force the query to filter by the user's email
    ctx.query = {
      ...ctx.query,
      filters: {
        ...(ctx.query.filters as any || {}),
        customerEmail: user.email,
      },
    };
    
    // Call the default core action
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  }
}));