const isProd = import.meta.env.PROD;


const Logger = {
  error: (message, error) => {
    if (isProd) return; 
    console.error("🟥 ERROR:", message, error ?? "");
  },

  api: (message, data) => {
    if (isProd) return; 
    console.log("🔵 API:", message, data ?? "");
  },

  info: (message) => {
    if (isProd) return; 
    console.info("ℹ️ INFO:", message);
  },

  warn: (message) => {
    if (isProd) return; 
    console.warn("⚠️ WARN:", message);
  },
};

export default Logger;
