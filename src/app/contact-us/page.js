'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Link from 'next/link';
import { Mail, MapPin, Clock, LifeBuoy, Check, X, Loader2 } from 'lucide-react';

// Note: For client components, metadata is set in the layout or via next/head
const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // EmailJS configuration - you'll need to replace these with your actual values
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'your_template_id';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key';

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'Noyco Team',
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige" style={{ fontFamily: '"Mier A", sans-serif' }}>
      

      {/* Hero Section */}
      <section className="pt-16 pb-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-8 left-8 w-40 h-40 bg-gradient-to-r from-[#E6D3E7] to-[#F6D9D5] blur-3xl mix-blend-multiply"></div>
          <div className="absolute -bottom-8 right-8 w-48 h-48 bg-gradient-to-r from-[#F6D9D5] to-[#D6E3EC] blur-3xl mix-blend-multiply"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            
            <h1 className="text-3xl md:text-5xl  text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about Noyco? Want to learn more about our AI companions? 
              We'd love to hear from you and help you get started on your journey.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-gray-800" />
                  </div>
                  <div>
                    <h3 className="text-lg  text-gray-900">Email Us</h3>
                    <p className="text-sm text-gray-600">hello@noyco.com</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-gray-800" />
                  </div>
                  <div>
                    <h3 className="text-lg  text-gray-900">Visit Us</h3>
                    <p className="text-sm text-gray-600">Chandigarh, India</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-gray-800" />
                  </div>
                  <div>
                    <h3 className="text-lg  text-gray-900">Response Time</h3>
                    <p className="text-sm text-gray-600">Within 24 hours</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <LifeBuoy className="w-6 h-6 text-gray-800" />
                  </div>
                  <div>
                    <h3 className="text-lg  text-gray-900">Support</h3>
                    <p className="text-sm text-gray-600">24/7 customer support</p>
                  </div>
                </motion.div>
              </div>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-12 bg-beige border-accent border-accent-top border-accent-left border-accent-right p-6"
              >
                <h3 className="text-xl   text-gray-900 mb-4">
                  Quick Questions?
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-base  text-gray-800">How do I get started?</h4>
                    <p className="text-sm text-gray-600">Simply sign up for a free account and begin your journey with our AI companions.</p>
                  </div>
                  <div>
                    <h4 className="text-base  text-gray-800">Is my data secure?</h4>
                    <p className="text-sm text-gray-600">Yes, we use industry-standard encryption to protect your personal information.</p>
                  </div>
                  <div>
                    <h4 className="text-base  text-gray-800">Can I cancel anytime?</h4>
                    <p className="text-sm text-gray-600">Absolutely! You can cancel your subscription at any time with no hidden fees.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-beige border-accent border-accent-top border-accent-left border-accent-right p-8 lg:p-10"
            >
              <h2 className="text-2xl  text-gray-900 mb-6">
                Send us a message
              </h2>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200"
                >
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">
                      Thank you! Your message has been sent successfully.
                    </p>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200"
                >
                  <div className="flex items-center">
                    <X className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-800">
                      Sorry, there was an error sending your message. Please try again.
                    </p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm  text-gray-900 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full text-body font-mier px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-body-large  text-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full text-body font-mier px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm  text-gray-900 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full text-sm px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#1F4D8F] focus:border-transparent transition-all"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm  text-gray-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full text-sm px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#1F4D8F] focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your question or how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-sm font-normal bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-900 px-8 py-4 border-accent border-accent-top border-accent-left border-accent-right hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;














