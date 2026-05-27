import React, { useState } from "react";

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function CompressionTab() {
  const [imageFile, setImageFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [compressedUrl, setCompressedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressionPercent, setCompressionPercent] = useState(0);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];

    setError("");
    setCompressedUrl("");
    setCompressedSize(0);
    setCompressionPercent(0);

    if (!selectedFile) {
      setImageFile(null);
      setPreviewSrc("");
      setOriginalSize(0);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    setImageFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setPreviewSrc(URL.createObjectURL(selectedFile));
  };

  const handleCompress = async () => {
    if (!imageFile) {
      setError("Please select image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        "http://localhost:5000/compress",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Compression failed.");
      }

        const originalSize =
        response.headers.get(
            "X-Original-Size"
        );

        const compressedSize =
        response.headers.get(
            "X-Compressed-Size"
        );

        const compressionPercent =
        response.headers.get(
            "X-Compression-Percent"
        );

        setOriginalSize(
        Number(originalSize)
        );

        setCompressedSize(
        Number(compressedSize)
        );

        setCompressionPercent(
        Number(compressionPercent)
        );

        setCompressedUrl("done");

      const blob = await response.blob();

        const url =
        window.URL.createObjectURL(blob);

        const a =
        document.createElement("a");

        a.href = url;

        a.download =
        `${imageFile.name}.huff`;

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      setError("Failed to compress image.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setPreviewSrc("");
    setCompressedUrl("");
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressionPercent(0);
    setLoading(false);
    setError("");
  };

  return (
    <div className="flex flex-col gap-6">

      {/* TITLE */}

      <div>
        <h2 className="text-2xl font-bold text-white">
          Image Compression
        </h2>

        <p className="text-gray-400 mt-1">
          Compress image using RLE + Huffman Encoding
        </p>
      </div>

      {/* FILE INPUT */}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="
            block w-full text-sm text-gray-100
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-gray-700 file:text-white
            hover:file:bg-gray-600
          "
        />
      </div>

      {/* PREVIEW */}

      {previewSrc && (
        <div className="
          rounded-2xl overflow-hidden
          border border-gray-700
          bg-gray-900/70 p-4
        ">
          <h3 className="text-white font-semibold mb-3">
            Original Image
          </h3>

          <img
            src={previewSrc}
            alt="Preview"
            className="
              max-h-[350px]
              mx-auto
              object-contain
              rounded-xl
            "
          />
        </div>
      )}

      {/* ACTION BUTTONS */}

      <div className="flex gap-4 flex-wrap">

        <button
          onClick={handleCompress}
          disabled={loading || !imageFile}
          className="
            px-6 py-3
            bg-gray-700
            text-white
            font-semibold
            rounded-xl
            hover:bg-gray-600
            transition-colors
            disabled:opacity-60
          "
        >
          {loading ? "Compressing..." : "Compress"}
        </button>

        <button
          onClick={handleReset}
          className="
            px-6 py-3
            border border-gray-700
            rounded-xl
            text-white
            hover:bg-gray-700
            transition-colors
          "
        >
          Reset
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* RESULTS */}

      {compressedUrl && (
        <div className="
          rounded-2xl
          border border-gray-700
          bg-gray-900/70
          p-5
        ">
          <h3 className="
            text-white
            text-xl
            font-semibold
            mb-5
          ">
            Compression Results
          </h3>

          {/* STATS */}

          <div className="grid md:grid-cols-3 gap-4">

            <div className="rounded-xl bg-gray-800 p-4">
              <p className="text-gray-400 text-sm mb-1">
                Original Size
              </p>

              <p className="text-white text-lg font-bold">
                {formatBytes(originalSize)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-800 p-4">
              <p className="text-gray-400 text-sm mb-1">
                Compressed Size
              </p>

              <p className="text-white text-lg font-bold">
                {formatBytes(compressedSize)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-800 p-4">
              <p className="text-gray-400 text-sm mb-1">
                Compression
              </p>

              <p className="text-green-400 text-lg font-bold">
                {compressionPercent}%
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}