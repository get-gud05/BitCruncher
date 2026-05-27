import ImageCompressor from "../components/ImageCompressor";

export default function ImageCompression() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Image Compression
      </h2>
      <ImageCompressor />
    </div>
  );
}