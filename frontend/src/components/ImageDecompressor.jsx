import React, { useState } from "react";

export default function ImageDecompressor() {

  const [compressedFile, setCompressedFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleCompressedFileChange = (
    event
  ) => {

    const selectedFile =
      event.target.files[0];

    setError("");

    if (!selectedFile) {
      setCompressedFile(null);
      return;
    }

    setCompressedFile(selectedFile);
  };

  const handleDecompress = async () => {

    if (!compressedFile) {

      setError(
        "Please select compressed file first."
      );

      return;
    }

    setLoading(true);

    setError("");

    try {

      const formData =
        new FormData();

      formData.append(
        "compressed",
        compressedFile
      );

      const response =
        await fetch(
          "http://localhost:5000/decompress",
          {
            method: "POST",
            body: formData,
          }
        );

      if (!response.ok) {

        throw new Error(
          "Decompression failed."
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      const disposition =
        response.headers.get(
            "Content-Disposition"
        );

        let filename = "restored_file";

        if (disposition) {

        const match =
            disposition.match(
            /filename="(.+)"/
            );

        if (match) {
            filename = match[1];
        }
        }

        a.download = filename;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {

      console.error(err);

      setError(
        "Failed to decompress file."
      );

    } finally {

      setLoading(false);
    }
  };

  const handleReset = () => {

    setCompressedFile(null);

    setLoading(false);

    setError("");
  };

  return (

    <div className="flex flex-col gap-6">

      {/* TITLE */}

      <div>

        <h2 className="
          text-2xl
          font-bold
          text-white
        ">
          Image Decompression
        </h2>

        <p className="
          text-gray-400
          mt-1
        ">
          Restore image from
          Huffman compressed file
        </p>

      </div>

      {/* FILE INPUT */}

      <div>

        <label className="
          block
          text-sm
          font-medium
          text-gray-300
          mb-2
        ">
          Select Compressed File
        </label>

        <input
          type="file"
          accept=".huff,.bin"
          onChange={
            handleCompressedFileChange
          }
          className="
            block
            w-full
            text-sm
            text-gray-100
            file:mr-4
            file:py-2
            file:px-4
            file:rounded-full
            file:border-0
            file:text-sm
            file:font-semibold
            file:bg-gray-700
            file:text-white
            hover:file:bg-gray-600
          "
        />

      </div>

      {/* ACTION BUTTONS */}

      <div className="
        flex
        gap-4
        flex-wrap
      ">

        <button
          onClick={handleDecompress}
          disabled={
            loading ||
            !compressedFile
          }
          className="
            px-6
            py-3
            bg-gray-700
            text-white
            font-semibold
            rounded-xl
            hover:bg-gray-600
            transition-colors
            disabled:opacity-60
          "
        >

          {
            loading
              ? "Decompressing..."
              : "Decompress"
          }

        </button>

        <button
          onClick={handleReset}
          className="
            px-6
            py-3
            border
            border-gray-700
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

        <div className="
          text-red-400
          text-sm
        ">
          {error}
        </div>

      )}

    </div>
  );
}