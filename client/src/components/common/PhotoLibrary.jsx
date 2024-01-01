import React from "react";
import { FaBeer } from "react-icons/fa";
import Image from "next/image";

const PhotoLibrary = ({ setImage, hidePhotoLibrary }) => {
  const images = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-full flex justify-center items-center">
      <div className="max-h-[100vh] max-w-[100vw] h-max w-max bg-gray-900 gap-6 rounded-lg p-4">
        <div
          className="pt-2 pe-2 cursor-pointer flex items-end justify-end"
          onClick={() => {
            hidePhotoLibrary(false);
          }}
        >
          <FaBeer className="h-10 w-10 cursor-pointer text-white" />
        </div>

        <div className="grid grid-cols-3 justify-center items-center gap-1">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => {
                setImage(images[index]);
                hidePhotoLibrary(false);
              }}
              className="cursor-pointer"
            >
              <div className="h-28 w-28 relative">
                {/* Adjusted dimensions for better visibility */}
                <Image src={image} alt="avatar" layout="fill" objectFit="cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoLibrary;

