import ImageDecompressor from "../components/ImageDecompressor";

export default function ImageDecompression() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Image Decompression 
      </h2>
      <ImageDecompressor />
    </div>
  );
}