import React, { useState } from 'react';
import '../../css/main.css';
import '../../css/util.css';

import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Menu, 
  X, 
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  Star,
  Plus,
  Minus,
  Eye,
  Filter,
  ChevronUp
} from 'lucide-react';

const Layout = ({ children, currentPage = 'home' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', active: currentPage === 'home'},
    { name: 'Shop', href: '/shop', active: currentPage === 'shop' },
    { name: 'Features', href: '/features', active: currentPage === 'cart', label: 'hot' },
    { name: 'Blog', href: '/blog', active: currentPage === 'blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const cartItems = [
    { id: 1, name: 'White Shirt Pleat', price: 19.00, quantity: 1, image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 2, name: 'Converse All Star', price: 39.00, quantity: 1, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 3, name: 'Nixon Porter Leather', price: 17.00, quantity: 1, image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=100' }
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative">
        {/* Top Bar */}
        <div className="bg-gray-100 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-10 text-sm">
              <div className="text-gray-600">
                Free shipping for standard order over $100
              </div>
              <div className="hidden md:flex space-x-6 text-gray-600">
                <a href="#" className="hover:text-gray-900 transition-colors">Help & FAQs</a>
                <a href="#" className="hover:text-gray-900 transition-colors">My Account</a>
                <a href="#" className="hover:text-gray-900 transition-colors">EN</a>
                <a href="#" className="hover:text-gray-900 transition-colors">USD</a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="#" className="text-2xl font-bold text-gray-900">
                  COZA STORE
                </a>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                        item.active 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      {item.name}
                      {item.label && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                          {item.label}
                        </span>
                      )}
                    </Link>
                    {item.submenu && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          {item.submenu.map((subitem) => (
                            <a
                              key={subitem}
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {subitem}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Header Icons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                </button>
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </button>
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-6 text-sm text-gray-600">
                Free shipping for standard order over $100
              </div>
              <nav className="space-y-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      className={`flex items-center justify-between py-2 text-base font-medium ${
                        item.active ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      <span className="flex items-center">
                        {item.name}
                        {item.label && (
                          <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                            {item.label}
                          </span>
                        )}
                      </span>
                      {item.submenu && <ChevronRight className="w-4 h-4" />}
                    </a>
                    {item.submenu && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.submenu.map((subitem) => (
                          <a
                            key={subitem}
                            href="#"
                            className="block py-1 text-sm text-gray-600 hover:text-gray-900"
                          >
                            {subitem}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSearchOpen(false)} />
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center border-b border-gray-200 pb-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t">
                <div className="text-lg font-semibold text-gray-900 mb-4">
                  Total: ${total.toFixed(2)}
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors">
                    View Cart
                  </button>
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Check Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Categories</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Women</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Men</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Shoes</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Watches</a></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Help</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Any questions? Let us know in store at 8th floor, 379 Hudson St, New York, NY 10018 or call us on (+1) 96 716 6879
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
              <form className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Payment Icons & Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-wrap justify-center items-center space-x-4 mb-6">
              <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">VISA</div>
              <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">MC</div>
              <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">AMEX</div>
              <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">PP</div>
            </div>
            <p className="text-center text-gray-400 text-sm">
              Copyright © {new Date().getFullYear()} All rights reserved | Made with ❤️ by Colorlib & distributed by ThemeWagon
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Layout;