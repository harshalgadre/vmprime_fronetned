import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-4 space-y-4">
            <h3 className="text-2xl font-bold">
              VM<span className="text-success bg-success px-2 py-1 text-success-foreground rounded">PRIME</span>
            </h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Your trusted destination for premium watches. We curate the finest timepieces from around the world.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-success hover:text-success-foreground">
                <Facebook className="w-5 h-5" />
              </Button>
              <a href="https://www.instagram.com/v_m_gadget?igsh=MWprY2hmemN2OGoxNw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="hover:bg-success hover:text-success-foreground">
                  <Instagram className="w-5 h-5" />
                </Button>
              </a>
              <Button variant="ghost" size="icon" className="hover:bg-success hover:text-success-foreground">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-success hover:text-success-foreground">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "Shop", "About Us", "Contact", "FAQs"].map((link) => (
                  <li key={link}>
                    <Link 
                      to={`/${link.toLowerCase().replace(/\s+/g, '')}`} 
                      className="text-primary-foreground/80 hover:text-success transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Get in Touch */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Get in Touch</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 hover:text-success transition-colors group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/10 flex items-center justify-center group-hover:bg-success/20">
                    <Phone className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-primary-foreground/80">+91 73577 62652</span>
                </div>
                <div className="flex items-center gap-3 hover:text-success transition-colors group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/10 flex items-center justify-center group-hover:bg-success/20">
                    <Mail className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-primary-foreground/80">Kprajd1@gmail.com</span>
                </div>
                <div className="flex items-start gap-3 hover:text-success transition-colors group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/10 flex items-center justify-center group-hover:bg-success/20">
                    <MapPin className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-primary-foreground/80 leading-tight">
                    Musafirkhana Road, Mumbai 400001
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2025 VMPRIME. All rights reserved. | Privacy Policy | Terms of Service | {" "}
            <a 
              href="/admin" 
              className="hover:text-success transition-colors duration-200 opacity-50 hover:opacity-100"
              title="Admin Access"
            >
              Admin
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
