module.exports = {
  apps: [
    {
      name: "fertilizer-backend",
      script: "./backend/server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 4000,
      },
      error_file: "./backend/logs/pm2-error.log",
      out_file: "./backend/logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
