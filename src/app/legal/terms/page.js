"use client";

import React from 'react';
import { motion } from "framer-motion";

export default function TermsOfService() {
  const sections = [
    {
      title: "Acceptance of Terms",
      shortDescription: "By accessing and using Noyco's services, you accept and agree to be bound by these terms and conditions.",
      content: `Thank you for choosing Noyco ("Company", "we", "us", or "our"). We are committed to providing AI-powered mental health support services through our website and applications.

By accessing and using Noyco's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.

These Terms of Service ("Terms", "ToS") govern your use of our website located at noyco.com (together or individually "Service") operated by Noyco.

Our Privacy Policy also governs your use of the Service and explains how we collect, safeguard and disclose information that results from your use of our web pages.`
    },
    {
      title: "Use License and Restrictions",
      shortDescription: "Permission is granted for personal, non-commercial use of our services under specific conditions and restrictions.",
      content: `Permission is granted to temporarily access and use Noyco's services for personal, non-commercial mental health support purposes only. This is the grant of a license, not a transfer of title, and under this license you may not:

• Modify, copy, or reproduce the materials or software
• Use the materials for any commercial purpose or for any public display
• Attempt to reverse engineer any software contained on Noyco's platform
• Remove any copyright or other proprietary notations from the materials
• Transfer the materials to another person or "mirror" the materials on any other server
• Use our AI models or technology for competing services

This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.`
    },
    {
      title: "User Accounts and Responsibilities",
      shortDescription: "When you create an account, you must provide accurate information and maintain the security of your account.",
      content: `When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.

You are responsible for:

• Safeguarding the password that you use to access the Service
• Maintaining the confidentiality of your account and password
• All activities that occur under your account or password
• Notifying us immediately of any unauthorized access or use of your account

We cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.`
    },
    {
      title: "Prohibited Uses",
      shortDescription: "You may not use our service for unlawful purposes or in ways that could harm our platform or other users.",
      content: `You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:

• For any unlawful purpose or to solicit others to perform or participate in any unlawful acts
• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
• To infringe upon or violate our intellectual property rights or the intellectual property rights of others
• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability
• To submit false or misleading information
• To upload or transmit viruses or any other type of malicious code
• To collect or track the personal information of others
• To spam, phish, pharm, pretext, spider, crawl, or scrape
• For any obscene or immoral purpose
• To interfere with or circumvent the security features of the Service

We reserve the right to terminate your use of the Service for violating any of the prohibited uses.`
    },
    {
      title: "Service Availability and Modifications",
      shortDescription: "We strive to provide continuous service but reserve the right to modify or discontinue services as needed.",
      content: `We strive to provide continuous service availability, but we do not guarantee that our service will be uninterrupted, timely, secure, or error-free. We reserve the right to modify, suspend, or discontinue the service (or any part or content thereof) at any time with or without notice.

We may also impose limits on certain features and services or restrict your access to parts or all of the Service without notice or liability.

We reserve the right to refuse service to anyone for any reason at any time. We may also create limits on use and storage at our sole discretion at any time with or without notice.`
    },
    {
      title: "Medical Disclaimer",
      shortDescription: "Our AI services provide support and guidance but do not replace professional medical or psychiatric care.",
      content: `Noyco provides AI-powered mental health support services, but our services are not intended to be a substitute for professional medical advice, diagnosis, or treatment.

Important disclaimers:

• Our AI agents provide supportive conversations and coping strategies but are not licensed therapists or medical professionals
• Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition
• Never disregard professional medical advice or delay in seeking it because of something you have received through our Service
• If you are experiencing a mental health emergency, please contact emergency services immediately
• Our Service is not designed to handle crisis situations or suicidal ideation

By using our Service, you acknowledge and agree that Noyco is not responsible for any decisions you make based on information or support provided by our AI agents.`
    },
    {
      title: "Limitation of Liability",
      shortDescription: "Our liability for any damages arising from your use of the service is limited under applicable law.",
      content: `In no event shall Noyco, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:

• Your access to or use of or inability to access or use the Service
• Any conduct or content of any third party on the Service
• Any content obtained from the Service
• Unauthorized access, use or alteration of your transmissions or content

This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if Noyco has been advised of the possibility of such damage.

Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for consequential or incidental damages. Accordingly, some of the above limitations may not apply to you.`
    },
    {
      title: "Governing Law",
      shortDescription: "These terms are governed by applicable laws and any disputes will be resolved in our designated jurisdiction.",
      content: `These Terms shall be interpreted and governed by the laws of the State of [Your State], without regard to its conflict of law provisions.

Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.

If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.

You agree that any dispute arising from or relating to the subject matter of these Terms shall be governed by the exclusive jurisdiction and venue of the courts of [Your Jurisdiction].`
    },
    {
      title: "Changes to Terms",
      shortDescription: "We may update these terms from time to time and will notify you of material changes.",
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.

What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.

If you do not agree to the new terms, please stop using the Service. We recommend that you check this page periodically for any changes to stay informed about our terms.`
    },
    {
      title: "Contact Information",
      shortDescription: "If you have questions about these Terms of Service, please contact our legal team.",
      content: `If you have any questions about these Terms of Service, please contact us at:

Email: <a href="mailto:legal@noyco.com">legal@noyco.com</a>

We will do our best to respond to your inquiry within 48 hours and work with you to address any concerns you may have about these terms.`
    }
  ];

  return (
    <section className="relative py-20 bg-beige overflow-hidden" style={{ fontFamily: '"Mier A", sans-serif' }}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-48 h-48 bg-gradient-to-r from-[#E6D3E7] to-[#F6D9D5] mix-blend-multiply filter blur-2xl opacity-15 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-56 h-56 bg-gradient-to-r from-[#F6D9D5] to-[#D6E3EC] mix-blend-multiply filter blur-2xl opacity-15 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-52 h-52 bg-gradient-to-r from-[#D6E3EC] to-[#E6D3E7] mix-blend-multiply filter blur-2xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl text-gray-900 mb-6">
            Terms of Service
          </h1>
          <div className="text-sm text-gray-500 mb-4">
            Current as of December 2024
          </div>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your privacy is important to us at Noyco. We respect your privacy regarding any information we may collect from you across our platform and strive to be as transparent as possible.
          </p>
        </div>

        {/* Terms Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-gray-700 leading-relaxed mb-8">
              Thank you for choosing Noyco ("<strong>Company</strong>", "<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>"). We are committed to providing AI-powered mental health support services through our website and applications.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              By accessing and using Noyco's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              These Terms of Service ("<strong>Terms</strong>", "<strong>ToS</strong>") govern your use of our website and services operated by Noyco.
            </p>
            <p className="text-gray-700 leading-relaxed mb-12">
              Please read these Terms of Service carefully as they will help you make informed decisions about using our platform.
            </p>

            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="mb-10"
              >
                <h3 className="text-xl font-normal text-gray-900 mb-4">
                  {section.title}
                </h3>
                
                {section.shortDescription && (
                  <p className="text-gray-700 mb-4">
                    <strong>In Short:</strong> {section.shortDescription}
                  </p>
                )}
                
                <div className="text-gray-700 leading-relaxed whitespace-pre-line [&_a]:underline [&_a]:text-blue-600 [&_a:hover]:no-underline">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 p-8 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/30"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Questions about these terms?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Our legal team is here to help clarify any questions about our terms of service.
          </p>
          <a
            href="mailto:legal@noyco.com"
            className="inline-flex items-center px-6 py-3 bg-[#5d83b8] text-white rounded-xl hover:bg-[#4a6b99] transition-colors duration-200 underline hover:no-underline"
          >
            Contact Legal Team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
