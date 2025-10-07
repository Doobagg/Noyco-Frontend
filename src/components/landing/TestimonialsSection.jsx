'use client'



'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      text: "Having an AI companion that truly understands my anxiety has been transformative. The conversations feel so natural and supportive.",
      author: "Sarah Chen",
      role: "Marketing Manager",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      text: "I was skeptical at first, but the accountability agent has helped me stick to my mental health goals like nothing else.",
      author: "Marcus Johnson", 
      role: "Software Developer",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      id: 3,
      text: "The therapy check-ins are incredible. It's like having a caring therapist available 24/7 who remembers every detail.",
      author: "Dr. Emily Rodriguez",
      role: "Clinical Psychologist", 
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 4,
      text: "Voice calls with my AI companion feel so real and comforting. It's helped me through some really tough nights.",
      author: "Alex Thompson",
      role: "Creative Director",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    {
      id: 5,
      text: "As someone with depression, having consistent, judgment-free support has made such a difference in my daily life.",
      author: "Maria Santos",
      role: "Nurse",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: 6,
      text: "The loneliness support agent helped me feel connected again during my most isolated moments. Truly life-changing.",
      author: "Jordan Lee",
      role: "Student", 
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    },
  ];

  return (
    <section className="py-12 bg-beige relative" style={{ fontFamily: '"Mier A", sans-serif' }}>
      {/* Removed blurred animated background elements */}
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          
          <h2 className="text-3xl md:text-5xl text-gray-900 mb-4">
            Transforming lives through <span className="text-[#5d83b8] bg-clip-text">AI-powered support</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover how our AI companions are helping people overcome mental health challenges and build healthier, happier lives.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-beige p-5 border-accent border-accent-top border-accent-left border-accent-right hover:border-gray-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Star Rating */}
              <div className="flex items-center mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gray-600" />
                ))}
              </div>
              
              <blockquote className="text-gray-700 mb-4 leading-relaxed text-sm">
                "{t.text}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <div className="ml-3">
                  <div className="text-gray-900 text-sm">{t.author}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
              
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="relative bg-beige p-8 mt-20 text-center text-black border-accent border-accent-top border-accent-left border-accent-right">
          <div className="relative">
            <h3 className="text-lg  mb-3">
              Ready to start your healing journey?
            </h3>
            <p className="mb-6 text-base text-gray-700">
              Join thousands who have found peace, support, and growth through AI-powered mental health care.
            </p>
            <Link href="/marketing-funnel" className="inline-block">
              <span className="bg-beige text-gray-800 px-6 py-3 border-accent border-accent-top border-accent-left border-accent-right hover:scale-105 transition-all duration-300 text-sm inline-block">
                Get Started Today
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

