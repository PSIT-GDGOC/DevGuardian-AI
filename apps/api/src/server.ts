import { app } from "./app.js";

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`🛡️ Dev AI Sentinel API Server running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/health`);
  console.log(`👉 API Docs: http://localhost:${PORT}/api/v1/repositories`);
});

export default server;
