import React, { useState } from "react";

export default function HuffmanEncoder() {
  const [input, setInput] = useState("");
  const [encoded, setEncoded] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [encodedSize, setEncodedSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEncode = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setEncoded("");
    setOriginalSize(0);
    setEncodedSize(0);

    try {
      const response = await fetch("http://localhost:5000/encode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      setEncoded(data.encoded ?? "No data received");
      setOriginalSize(data.originalSize ?? 0);
      setEncodedSize(data.encodedSize ?? 0);
    } catch (err) {
      console.error(err);
      setError("Error encoding string.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        placeholder="Enter text to encode..."
        className="w-full p-4 rounded-xl bg-gray-800/70 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
      />

      <div className="flex gap-3">
        <button
          onClick={handleEncode}
          disabled={loading}
          className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-600 transition-colors disabled:opacity-60"
        >
          {loading ? "Encoding..." : "Encode"}
        </button>
        <button
          onClick={() => { setInput(""); setEncoded(""); setOriginalSize(0); setEncodedSize(0); setError(""); }}
          className="px-4 py-2 border border-gray-700 rounded-xl text-white hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {encoded && (
        <div className="card-glass mt-4 p-4">
          <h5 className="text-white font-semibold mb-2">Encoded String:</h5>
          <pre className="whitespace-pre-wrap break-words text-gray-200">{encoded}</pre>

          <div className="mt-3 text-gray-300">
            <p>Original Size: <span className="text-white">{originalSize} bits</span></p>
            <p>Encoded Size: <span className="text-white">{encodedSize} bits</span></p>
            <p>Compression Ratio: <span className="text-white">{((encodedSize/originalSize)*100).toFixed(2)}%</span></p>
          </div>
        </div>
      )}
    </div>
  );
}