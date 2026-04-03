"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Have questions or need support? Our team is here to help you.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

        {/* CONTACT INFO */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>

          <div className="space-y-6 text-gray-700">

            <div className="flex items-center gap-4">
              <Mail className="text-blue-600" />
              <span>support@studyweb.com</span>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-blue-600" />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-blue-600" />
              <span>India</span>
            </div>

          </div>

          <p className="mt-8 text-gray-600">
            We usually respond within 24 hours. Feel free to reach out anytime.
          </p>
        </div>

        {/* CONTACT FORM */}
        <form className="bg-white shadow-lg rounded-xl p-8">

          <h3 className="text-2xl font-bold mb-6">Send a Message</h3>

          <input
            type="text"
            placeholder="Your Name"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Your Message"
            rows={5}
            className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>

        </form>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-6">
          Start Your Preparation Today
        </h2>

        <p className="mb-8 text-lg">
          Join thousands of students already preparing smarter.
        </p>

        <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition">
          Join StudyWeb
        </button>
      </section>

    </div>
  );
}