const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

app.use(cors());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.use(
  "/abdm_acces_token_proxy",
  createProxyMiddleware({
    target: "https://dev.abdm.gov.in/api",
    // Target will be same for both production and stage
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      "^/gen_acces_token": "",
    },
    onProxyRes: (proxyRes) => {
      proxyRes.headers["Access-Control-Allow-Origin"] = "http://localhost:3000/";
    },
  })
);

app.use(
  "/abdm_abha_gen_proxy",
  createProxyMiddleware({
    // Target are different for stage and production
    target: "https://abhasbx.abdm.gov.in/abha",  //STAGE
    // target: "https://abha.abdm.gov.in/api/abha",  //STAGE
    changeOrigin: true,
    pathRewrite: {
      "^/gen_abha_id": "",
    },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers["Access-Control-Allow-Origin"] = "http://localhost:3000/";
      proxyRes.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
      proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, TIMESTAMP, REQUEST-ID"; 
    },
  })
);
  

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on port ${PORT}`);
});
