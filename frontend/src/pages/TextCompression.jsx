import HuffmanEncoder from "../components/HuffmanEncoder";

export default function TextCompression() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Text Compression
      </h2>
      <HuffmanEncoder />
    </div>
  );
}