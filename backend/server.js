const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors({
  exposedHeaders: [
    "Content-Disposition",
    "X-Original-Size",
    "X-Compressed-Size",
    "X-Compression-Percent",
    "X-Restored-Size"
  ]
}));
app.use(express.json());

app.use(
  "/downloads",
  express.static(
    path.join(__dirname, "downloads")
  )
);

// UPLOAD CONFIG

const upload = multer({
  dest: path.join(__dirname, "uploads"),
});

// TEXT ENCODER

const textExecutable = path.join(
  __dirname,
  "../cpp-code/huffman_encoder"
);

app.post("/encode", (req, res) => {

  const input = req.body.input;

  if (!input) {
    return res.status(400).json({
      error: "No input provided",
    });
  }

  execFile(
    textExecutable,
    [input],
    (error, stdout, stderr) => {

      if (error) {

        console.error(error);

        return res.status(500).json({
          error: "Execution failed",
        });
      }

      const [encoded, stats] =
        stdout.split("__STATS__");

      let originalSize = 0;
      let encodedSize = 0;

      if (stats) {

        const origMatch =
          stats.match(/Original:(\d+)/);

        const encMatch =
          stats.match(/Encoded:(\d+)/);

        if (origMatch) {
          originalSize =
            parseInt(origMatch[1]);
        }

        if (encMatch) {
          encodedSize =
            parseInt(encMatch[1]);
        }
      }

      res.json({
        encoded: encoded.trim(),
        originalSize,
        encodedSize,
      });
    }
  );
});

// IMAGE COMPRESSOR

const compressorExecutable = path.join(
  __dirname,
  "../cpp-code/compressor.exe"
);

app.post(
  "/compress",
  upload.single("image"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        error: "No image uploaded",
      });
    }

    const inputPath = req.file.path;

    execFile(
      compressorExecutable,
      [inputPath],
      (error, stdout, stderr) => {

        if (error) {

          console.error(error);
          console.error(stderr);

          return res.status(500).json({
            error: "Compression failed",
          });
        }

        console.log(stdout);

        const lines =
          stdout.split("\n");

        const outputFile =
          lines[0].trim();

        const stats =
          stdout.split("__STATS__")[1];

        let originalBits = 0;
        let compressedBits = 0;
        let compressionPercent = 0;

        if (stats) {

          const origMatch =
            stats.match(/Original:(\d+)/);

          const compMatch =
            stats.match(/Compressed:(\d+)/);

          const percentMatch =
            stats.match(
              /CompressionPercent:([-\d.]+)/
            );

          if (origMatch) {
            originalBits =
              parseInt(origMatch[1]);
          }

          if (compMatch) {
            compressedBits =
              parseInt(compMatch[1]);
          }

          if (percentMatch) {
            compressionPercent =
              parseFloat(percentMatch[1]);
          }
        }
        
        res.setHeader(
          "X-Original-Size",
          originalBits / 8
        );

        res.setHeader(
          "X-Compressed-Size",
          compressedBits / 8
        );

        res.setHeader(
          "X-Compression-Percent",
          compressionPercent
        );

        res.download(
          outputFile,
          path.basename(outputFile),
          (err) => {

            // DELETE TEMP FILES

            fs.unlinkSync(inputPath);

            if (
              fs.existsSync(outputFile)
            ) {
              fs.unlinkSync(outputFile);
            }

            if (err) {
              console.error(err);
            }
          }
        );
      }
    );
  }
);

// IMAGE DECOMPRESSOR

const decompressorExecutable = path.join(
  __dirname,
  "../cpp-code/decompressor.exe"
);

app.post(
  "/decompress",
  upload.single("compressed"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const inputPath = req.file.path;

    execFile(
      decompressorExecutable,
      [inputPath],
      (error, stdout, stderr) => {

        if (error) {

          console.error(error);
          console.error(stderr);

          return res.status(500).json({
            error: "Decompression failed",
          });
        }

        const lines =
          stdout.split("\n");

        const restoredFile =
          lines[0].trim();

        res.download(
          restoredFile,
          path.basename(restoredFile),
          (err) => {

            if (
              fs.existsSync(inputPath)
            ) {
              fs.unlinkSync(inputPath);
            }

            if (
              fs.existsSync(restoredFile)
            ) {
              fs.unlinkSync(restoredFile);
            }

            if (err) {
              console.error(err);
            }
          }
        );
      }
    );
  }
);

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});