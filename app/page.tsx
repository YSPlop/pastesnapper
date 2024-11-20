"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface ImageData {
  file: File;
  url: string;
}

export default function Home() {
  const [image, setImage] = useState<ImageData | null>(null);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.includes("image")) {
        const file = item.getAsFile();
        if (file) {
          const url = URL.createObjectURL(file);
          setImage({ file, url });
        }
        break;
      }
    }
  };

  const handleDownload = () => {
    if (image) {
      const link = document.createElement("a");
      link.href = image.url;
      link.download = "pasted-image.png";
      link.click();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800"
      onPaste={handlePaste}
    >
      <div className="text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold">Paste an Image (Ctrl+V or Cmd+V)</h1>
          <p className="mt-2 text-gray-400">You can preview the image below and download it using the button provided.</p>
        </motion.div>

        {image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-6"
          >
            <img
              src={image.url}
              alt="Pasted"
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
            <button
              onClick={handleDownload}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Download Image
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
