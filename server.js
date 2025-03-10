import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

var app = express();

console.log("url: ",process.env.REACT_APP_BASE_URL)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname + '/'));
app.listen(process.env.PORT || 8000);

//production mode
if (process.env.NODE_ENV === "production") {
  console.log('production')
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join((__dirname + "/build/index.html")));
  });
}

//build mode
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "public/index.html"));
});    
