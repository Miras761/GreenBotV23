
import React from 'react';
import { CloseIcon } from './icons';

interface ImagePreviewProps {
  src: string;
  onRemove: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, onRemove }) => {
  return (
    <div className="relative inline-block mb-2">
      <img src={src} alt="Preview" className="h-20 w-20 object-cover rounded-md border-2 border-green-300" />
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        aria-label="Remove image"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
