"use client";
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ImageData {
  file: File;
  url: string;
}

export default function Home() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const pasteRef = useRef<HTMLDivElement | null>(null);

  // Detect mobile devices
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(userAgent)); // Detect mobile or tablet
  }, []);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.includes("image"));

    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        const url = URL.createObjectURL(file);
        // Prevent duplicates by checking if the image is already set
        if (!image || image.url !== url) {
          setImage({ file, url });
        }
      }
    }

    // Prevent default paste behavior to avoid image preview duplication
    e.preventDefault();
  };

  const triggerPaste = () => {
    if (pasteRef.current) {
      pasteRef.current.focus(); // Focus the contentEditable element
      document.execCommand("paste"); // Trigger the native paste command
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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800"
    >
      <div className="text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold">Paste an Image</h1>
          <p className="mt-2 text-gray-400">
            On desktop, use Ctrl+V or Cmd+V. On mobile, tap the button below and paste into the box.
          </p>
        </motion.div>

        {/* Mobile Paste Section */}
        {isMobile && (
          <div className="mt-6">
            <button
              onClick={triggerPaste}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Paste Image
            </button>
            <div
              ref={pasteRef}
              className="mt-4 p-4 border-2 border-dashed border-gray-500 rounded-lg w-full max-w-md bg-gray-800 text-gray-400"
              contentEditable={true}
              suppressContentEditableWarning={true} // Prevent React warning
              onPaste={handlePaste}
            >
              <p className="text-center pointer-events-none select-none">
                Tap the button above, then paste your image here.
              </p>
            </div>
          </div>
        )}

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
