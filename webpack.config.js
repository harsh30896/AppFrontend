const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Configure allowedHosts for Replit proxy
  if (config.devServer) {
    config.devServer.allowedHosts = 'all';
    config.devServer.host = '0.0.0.0';
    config.devServer.port = 5000;
    config.devServer.client = {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    };
  }
  
  return config;
};