module.exports = {
  apps : [{
    name: 'API',
    script: 'server/server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '8890',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
