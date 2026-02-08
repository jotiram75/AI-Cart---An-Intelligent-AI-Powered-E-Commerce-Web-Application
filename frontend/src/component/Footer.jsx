import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Careers', path: '#' },
      { label: 'Blog', path: '#' }
    ],
    shop: [
      { label: 'New Arrivals', path: '/collection' },
      { label: 'Best Sellers', path: '/collection' },
      { label: 'Sale', path: '/collection' },
      { label: 'Gift Cards', path: '#' }
    ],
    help: [
      { label: 'FAQs', path: '#' },
      { label: 'Shipping', path: '#' },
      { label: 'Returns', path: '#' },
      { label: 'Size Guide', path: '#' }
    ]
  };

  const socialLinks = [
    { icon: FaFacebookF, url: '#', label: 'Facebook' },
    { icon: FaTwitter, url: '#', label: 'Twitter' },
    { icon: FaInstagram, url: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, url: '#', label: 'LinkedIn' },
    { icon: FaYoutube, url: '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="AICart Logo" className="w-10 h-10" />
              <h2 className="text-2xl font-bold text-white font-heading">AICART</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Your one-stop destination for premium fashion and lifestyle products. Quality you can trust, style you'll love.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <a href="mailto:support@aicart.com" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <IoMailOutline className="w-4 h-4 flex-shrink-0" />
                <span>support@aicart.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <IoCallOutline className="w-4 h-4 flex-shrink-0" />
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-start gap-2 text-sm">
                <IoLocationOutline className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>123 Fashion Street, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm hover:text-primary transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm hover:text-primary transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 uppercase tracking-wider">Help</h3>
            <ul className="space-y-2.5">
              {footerLinks.help.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="text-sm hover:text-primary transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} AICart. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>We accept:</span>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-gray-800 rounded text-white">VISA</div>
                <div className="px-2 py-1 bg-gray-800 rounded text-white">MC</div>
                <div className="px-2 py-1 bg-gray-800 rounded text-white">AMEX</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
