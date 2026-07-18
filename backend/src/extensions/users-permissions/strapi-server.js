module.exports = (plugin) => {
  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    
    // Fetch user with role populated
    const user = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      ctx.state.user.id,
      { populate: ['role'] }
    );
    
    // Remove sensitive fields manually
    if (user) {
        delete user.password;
        delete user.resetPasswordToken;
        delete user.confirmationToken;
    }
    
    ctx.body = user;
  };

  return plugin;
};
