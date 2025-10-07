"use client";

import Link from "next/link";
import { Twitter, Instagram, Linkedin } from "lucide-react";

export default function LandingFooter() {
  // Consolidated footer links used across the site
  // const sections = [
  //   {
  //     title: "Product",
  //     links: [
  //       { name: "Features", href: "/#features" },
  //       { name: "Pricing", href: "/#pricing" },
       
  //     ],
  //   },
    
    
  //   {
  //     title: "Legal",
  //     links: [
  //       { name: "Privacy Policy", href: "/legal/privacy" },
  //       { name: "Terms", href: "/legal/terms" },
  //     ],
  //   },
  // ];

  return (
    <footer className="relative bg-beige border-accent border-accent-top overflow-hidden" style={{ fontFamily: '"Mier A", sans-serif', fontSize: '16px' }}>
      {/* Soft background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-8 left-10 w-48 h-48 bg-gradient-to-r from-[#E6D3E7] to-[#F6D9D5] mix-blend-multiply blur-2xl opacity-15"></div>
        <div className="absolute -bottom-12 right-10 w-56 h-56 bg-gradient-to-r from-[#F6D9D5] to-[#D6E3EC] mix-blend-multiply blur-2xl opacity-15"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="pt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand Section - Takes up more space on large screens */}
            <div className="lg:col-span-5">
              <div className="mb-6">
                <span className="text-2xl  text-gray-900" style={{ fontFamily: '"Mier A", sans-serif' }}>
                  Noyco
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-8 max-w-md" style={{ fontSize: '16px' }}>
                Empathetic AI conversations for mental wellness. Private, available 24/7, and designed to support your journey toward inner peace.
              </p>
              
              {/* Help Section */}
              <p className="text-gray-600 mb-6" style={{ fontSize: '16px' }}>
                Need help? Visit our{" "}
                <Link href="/contact-us" className="text-gray-800 hover:text-gray-900 font-medium underline underline-offset-2">
                  contact support
                </Link>
                .
              </p>

              {/* Social Media */}
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-10 h-10 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 flex items-center justify-center rounded-lg transition-all duration-200 hover:shadow-sm"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 flex items-center justify-center rounded-lg transition-all duration-200 hover:shadow-sm"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-10 h-10 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 flex items-center justify-center rounded-lg transition-all duration-200 hover:shadow-sm"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links Grid - Industry standard 4-column layout on large screens */}
            <div className="lg:col-span-7">
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {sections.map((section) => (
                  <div key={section.title}>
                    <h4 className="font-semibold text-gray-900 mb-4" style={{ fontSize: '16px' }}>
                      {section.title}
                    </h4>
                    <ul className="space-y-3">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            style={{ fontSize: '16px' }}
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-200"></div>

        {/* Footer Bottom */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <p className="text-gray-600" style={{ fontSize: '16px' }}>
              © {new Date().getFullYear()} Noyco Inc. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-8">
              <Link 
                href="/legal/privacy" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                style={{ fontSize: '16px' }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/legal/terms" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                style={{ fontSize: '16px' }}
              >
                Terms
              </Link>
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                style={{ fontSize: '16px' }}
              >
                Site Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}