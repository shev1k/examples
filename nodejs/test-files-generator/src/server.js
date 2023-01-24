const express = require("express");

const { generatorController } = require("./controllers/generatorController");

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static("public"));

app.post("/api/generate", generatorController.generateData);
app.post("/api/metadata/download", generatorController.sendMetadata);
app.post("/api/royalty/download", generatorController.sendRoyalty);

app.listen(port);
console.log("Server started at http://localhost:" + port);
