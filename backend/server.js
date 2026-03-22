const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const executable = path.join(__dirname, "../cpp-code/huffman_encoder");

app.post("/encode", (req, res) => {
  const input = req.body.input;

  if (!input) {
    return res.status(400).json({ error: "No input provided" });
  }

  execFile(executable, [input], (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Execution failed" });
    }

    const [encoded, stats] = stdout.split("__STATS__");

    let originalSize = 0;
    let encodedSize = 0;

    if (stats) {
      const origMatch = stats.match(/Original:(\d+)/);
      const encMatch = stats.match(/Encoded:(\d+)/);

      if (origMatch) originalSize = parseInt(origMatch[1]);
      if (encMatch) encodedSize = parseInt(encMatch[1]);
    }

    res.json({
      encoded: encoded.trim(),
      originalSize,
      encodedSize
    });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});