import Image from 'next/image';

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  imageSrc?: string;
}

export default function FeatureModal({ isOpen, onClose, title, description, imageSrc }: FeatureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
          ✕
        </button>

        {/* Image */}
        {imageSrc && (
          <div className="flex justify-center mb-4">
            <img src={imageSrc} alt={title} className="h-20" />
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-center mb-6">{description}</p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Try This Now
          </button>
        </div>

      </div>
    </div>
  );
}
