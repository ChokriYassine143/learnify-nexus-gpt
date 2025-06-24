import React from "react";

const CookiesPage: React.FC = () => (
  <main className="container py-12">
    <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">1. What Are Cookies?</h2>
      <p className="text-gray-600">Cookies are small text files stored on your device by your web browser. They are used to remember your preferences and enhance your experience on LearnUp.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">2. How We Use Cookies</h2>
      <p className="text-gray-600">We use cookies to keep you logged in, remember your settings, and analyze site usage to improve our services. Some cookies are essential for the operation of the site.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">3. Managing Cookies</h2>
      <p className="text-gray-600">You can control and delete cookies through your browser settings. However, disabling cookies may affect the functionality of LearnUp.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">4. Changes to This Policy</h2>
      <p className="text-gray-600">We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated effective date.</p>
    </section>
  </main>
);

export default CookiesPage; 