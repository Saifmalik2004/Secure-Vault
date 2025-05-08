
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Github, ArrowRight, Linkedin, Instagram } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-sidebar py-12 px-4 border-t">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-vault-purple" />
              <span className="text-xl font-semibold">SecureVault</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Your all-in-one secure platform for productivity and organization
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link to="https://github.com/Saifmalik2004/Secure-Vault" target="_blank">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link to="https://www.linkedin.com/in/saif-malik7827/" target="_blank">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link to="https://www.instagram.com/the_lucifer_morningstarr" target="_blank">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link to="#security" className="text-muted-foreground hover:text-foreground">Security</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-foreground">Changelog</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-foreground">Guides</Link></li>
              <li><Link to="#faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-foreground">Support</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="font-medium mb-4">Subscribe</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated with the latest features and releases
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button size="sm" className="h-9">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-muted-foreground/20 text-center sm:flex sm:justify-between sm:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SecureVault. All rights reserved. mabe by Saif
          </p>
          <div className="mt-4 sm:mt-0 flex flex-wrap justify-center sm:justify-end gap-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/" className="hover:text-foreground">Terms of Service</Link>
            <Link to="/" className="hover:text-foreground">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
