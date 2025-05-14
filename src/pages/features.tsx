import { useState } from 'react';
import FeatureModal from '@/components/FeatureModal';
import Footer from '@/components/Footer';

export default function FeaturesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalImage, setModalImage] = useState('');

  const openModal = (title: string, description: string, image: string) => {
    setModalTitle(title);
    setModalDescription(description);
    setModalImage(image);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">✨ RewMo Features</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Rent Rewards */}
        <button
          onClick={() => openModal(
            "Rent Rewards",
            "Earn rewards every time you pay your rent or mortgage through RewMo. Turn your biggest monthly expenses into rewards!",
            "/features/rent-reward.png"
          )}
          className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-6 shadow hover:shadow-lg transition"
        >
          <img src="/features/rent-reward.png" alt="Rent Rewards" className="h-16 mb-4" />
          <span className="font-semibold text-lg">🏠 Rent Rewards</span>
        </button>

        {/* Shopping Rewards */}
        <button
          onClick={() => openModal(
            "Shopping Rewards",
            "Earn cashback and reward points when you shop online at Amazon, Walmart, Target, and more through RewMo.",
            "/features/shopping-reward.png"
          )}
          className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-6 shadow hover:shadow-lg transition"
        >
          <img src="/features/shopping-reward.png" alt="Shopping Rewards" className="h-16 mb-4" />
          <span className="font-semibold text-lg">🛒 Shopping Rewards</span>
        </button>

        {/* Referral Rewards */}
        <button
          onClick={() => openModal(
            "Referral Rewards",
            "Invite friends and family to join RewMo. Earn bonus points for every person you bring in — no limits!",
            "/features/referral-reward.png"
          )}
          className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-6 shadow hover:shadow-lg transition"
        >
          <img src="/features/referral-reward.png" alt="Referral Rewards" className="h-16 mb-4" />
          <span className="font-semibold text-lg">👥 Referral Rewards</span>
        </button>

      </div>

      {/* Footer and Modal */}
      <FeatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        description={modalDescription}
        imageSrc={modalImage}
      />

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}
