import React from "react";

const PrivacyPage: React.FC = () => (
  <main className="container py-12">
    <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">1. Information Collection</h2>
      <p className="text-gray-600">We collect personal information such as your name, email address, and usage data when you register or use LearnUp. This information is used to provide and improve our services.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">2. Use of Information</h2>
      <p className="text-gray-600">Your information is used to personalize your experience, process transactions, and send periodic emails. We do not sell or share your personal information with third parties except as required by law.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">3. Data Security</h2>
      <p className="text-gray-600">We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
      <p className="text-gray-600">LearnUp uses cookies to enhance your experience. You can choose to disable cookies through your browser settings, but some features may not function properly.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">5. Changes to This Policy</h2>
      <p className="text-gray-600">We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.</p>
    </section>
  </main>
);

export default PrivacyPage; 