export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Contact Us</h1>
      <p className="max-w-xl text-center mb-4">
        We’d love to hear from you. For support, partnerships, or media inquiries, please reach out:
      </p>
      <a
        href="mailto:support@rewmo.ai"
        className="text-orange-400 underline hover:text-orange-600 text-lg"
      >
        support@rewmo.ai
      </a>
      <p className="mt-8 text-gray-400 text-center text-sm">
        Our team typically replies within 24 hours.
      </p>
    </main>
  );
}
