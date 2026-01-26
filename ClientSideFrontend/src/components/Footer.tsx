import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-stone-800 text-stone-50 lg:px-20 px-5">
      {/* Newsletter Section */}
      <div className="border-b border-stone-50/10">
        <div className="container py-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
              Join Our Newsletter
            </h3>
            <p className="text-stone-50/70 mb-6">
              Subscribe for exclusive offers, new arrivals, and home styling tips.
            </p>
            <div className="flex gap-3 flex-wrap">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-stone-50/10 border border-stone-50/20 text-stone-50 placeholder:text-stone-50/50 focus:outline-none focus:border-stone-50/40 transition-colors"
              />
              <Button variant="hero" size="lg" className="bg-stone-50 text-stone-800 hover:bg-stone-50/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif text-2xl font-semibold">Nestora</span>
            <p className="mt-4 text-stone-50/70 text-sm leading-relaxed">
              Premium home textiles crafted for comfort and everyday luxury.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-stone-50/70 hover:text-stone-50 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-stone-50/70 hover:text-stone-50 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-stone-50/70 hover:text-stone-50 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-stone-50/70 hover:text-stone-50 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-stone-50/70">
              <li><a href="#" className="hover:text-stone-50 transition-colors">Bedsheets</a></li>
              <li><a href="#" className="hover:text-stone-50 transition-colors">Pillow Covers</a></li>
              <li><a href="#" className="hover:text-stone-50 transition-colors">Sofa Covers</a></li>
              <li><a href="#" className="hover:text-stone-50 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-stone-50 transition-colors">Sale</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-3 text-sm text-stone-50/70">
              <li><a href="#" className="hover:text-stone-50 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-stone-50 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-stone-50 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-stone-50 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-stone-50 transition-colors">Size Guide</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-stone-50/70">
              <li><a href="#" className="hover:text-stone-50 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-stone-50 transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-stone-50 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-stone-50 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-50/10 mt-12 pt-8 text-center text-sm text-stone-50/50">
          <p>© 2024 Nestora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
