"use client";

import React from 'react';
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "What information do we collect?",
      shortDescription: "We collect personal information that you provide to us such as account details, contact information, and conversation data.",
      content: `We collect information you provide directly to us when you:

• Create or modify your account
• Request customer support or contact us
• Participate in surveys or promotions
• Use our AI conversation services

The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use. The personal information we collect can include the following:

• Personal Information You Disclose to Us. We collect names; email addresses; phone numbers; and other similar contact data.
• Credentials. We collect passwords, password hints, and similar security information used for authentication and account access.
• Conversation Data. We collect and process your conversations with our AI agents to provide personalized mental health support.

All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.`
    },
    {
      title: "How do we use your information?",
      shortDescription: "We process your information for purposes based on legitimate business interests, fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.",
      content: `We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.

We use the information we collect or receive:

• To facilitate account creation and logon process
• To provide, maintain, and improve our AI mental health services
• To send administrative information to you regarding our services
• To fulfill and manage your orders, payments, and transactions
• To respond to your inquiries and offer customer support
• To train and improve our AI models for better mental health support
• To enforce our terms, conditions and policies for business purposes
• To comply with legal obligations

We do not sell, trade, or rent your personal information to third parties.`
    },
    {
      title: "Will your information be shared with anyone?",
      shortDescription: "We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.",
      content: `We may process or share your data that we hold based on the following legal basis:

• Consent: We may process your data if you have given us specific consent to use your personal information for a specific purpose.
• Legitimate Interests: We may process your data when it is reasonably necessary to achieve our legitimate business interests.
• Performance of a Contract: Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.
• Legal Obligations: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.
• Vital Interests: We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities.

More specifically, we may need to process your data or share your personal information in the following situations:

• Vendors, Consultants and Other Third-Party Service Providers. We may share your data with third party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work.
• Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.`
    },
    {
      title: "How do we keep your information safe?",
      shortDescription: "We aim to protect your personal information through a system of organizational and technical security measures.",
      content: `We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.

Our security measures include:

• Encryption of data in transit and at rest
• Regular security assessments and monitoring
• Access controls and multi-factor authentication
• Employee training on data protection and security protocols
• Secure data centers with physical access controls

Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.`
    },
    {
      title: "Do we use cookies and other tracking technologies?",
      shortDescription: "We may use cookies and similar tracking technologies to collect and store your information.",
      content: `We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.

The cookies we use help us to:

• Keep you signed in to your account
• Remember your preferences and settings
• Understand how you use our services
• Improve our platform performance
• Provide personalized AI responses

You can control cookies through your browser settings and choose to disable them, though this may affect the functionality of our Services.`
    },
    {
      title: "How long do we keep your information?",
      shortDescription: "We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy unless otherwise required by law.",
      content: `We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law.

Specifically:

• Account information: Until you delete your account or request deletion
• Conversation data: As long as you maintain your account, unless you delete specific conversations
• Analytics data: Up to 2 years in anonymized form
• Support communications: Up to 3 years for quality assurance

When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.`
    },
    {
      title: "What are your privacy rights?",
      shortDescription: "You may review, change, or terminate your account at any time.",
      content: `In some regions (like the European Economic Area), you have certain rights under applicable data protection laws. These may include the right to:

• Request access and obtain a copy of your personal information
• Request rectification or erasure of your personal information
• Restrict the processing of your personal information
• If applicable, data portability
• Object to the processing of your personal information

If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority.

To exercise these rights, please contact us at privacy@noyco.com. We will consider and act upon any request in accordance with applicable data protection laws.`
    },
    {
      title: "Do we collect information from minors?",
      shortDescription: "We do not knowingly collect data from or market to children under 18 years of age.",
      content: `We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services.

If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records.

If you become aware of any data we may have collected from children under age 18, please contact us at privacy@noyco.com.`
    },
    {
      title: "Do we make updates to this policy?",
      shortDescription: "Yes, we will update this policy as necessary to stay compliant with relevant laws.",
      content: `We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.

If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.

We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.`
    },
    {
      title: "How can you contact us about this policy?",
      shortDescription: "If you have questions or comments about this policy, you may contact us by email.",
      content: `If you have questions or comments about this policy, or if you would like to review, update, or delete the data we collect from you, please contact us at:

Email: <a href="mailto:privacy@noyco.com">privacy@noyco.com</a>

We will respond to your inquiries within 30 days and work with you to address any concerns you may have about our privacy practices.`
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
            Privacy Policy
          </h1>
          <div className="text-sm text-gray-500 mb-4">
            Current as of December 2024
          </div>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your privacy is important to us at Noyco. We respect your privacy regarding any information we may collect from you across our platform and strive to be as transparent as possible.
          </p>
        </div>

        {/* Privacy Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-gray-700 leading-relaxed mb-8">
              Thank you for visiting Noyco ("<strong>Company</strong>", "<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>").
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              We are committed to safeguarding the privacy of Noyco users including users of the website, mobile applications and any other digital products that we develop; this policy sets out how we will treat your personal information.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              The personal information we collect might include your name, email address, IP address, and information regarding what pages are accessed and when.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Our website and app uses cookies. By using our website and agreeing to this policy, you consent to our use of cookies in accordance with the terms of this policy.
            </p>
            <p className="text-gray-700 leading-relaxed mb-12">
              When you visit our website, you trust us with your personal information. We take your privacy very seriously. In this privacy policy, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy policy that you do not agree with, please discontinue use of our Sites and our services.
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
            Questions about your privacy?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            We're here to help. Contact our privacy team for any questions or concerns.
          </p>
          <a
            href="mailto:privacy@noyco.com"
            className="inline-flex items-center px-6 py-3 bg-[#5d83b8] text-white rounded-xl hover:bg-[#4a6b99] transition-colors duration-200 underline hover:no-underline"
          >
            Contact Privacy Team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
