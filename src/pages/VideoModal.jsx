import React, { useState } from "react";
import { X } from "lucide-react";

const chapters = [
  { label: "View 1", src: "/video1.mp4" },
  { label: "View 2", src: "/video2.mp4" },
  { label: "View 3", src: "/video3.mp4" },
  { label: "View 4", src: "/video4.mp4" },
];

export default function VideoModal({ isOpen, onClose }) {
  const [activeVideo, setActiveVideo] = useState(chapters[0].src);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl"
      >
        <X size={32} />
      </button>

      {/* Video player */}
      <div className="w-full max-w-5xl h-[70vh] flex justify-center items-center">
        <video
          key={activeVideo}
          src={activeVideo}
          controls
          autoPlay
          loop
          muted
          className="w-full h-full object-contain"
        />
      </div>

      {/* Chapters */}
      <div className="mt-6 flex space-x-8 text-white text-lg">
        {chapters.map((ch) => (
          <button
            key={ch.label}
            onClick={() => setActiveVideo(ch.src)}
            className={`pb-1 border-b-2 ${
              activeVideo === ch.src ? "border-white" : "border-transparent"
            } hover:border-white transition`}
          >
            {ch.label}
          </button>
        ))}
      </div>
    </div>
  );
}
