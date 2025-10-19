import { useState } from "react";
import PromotionalBanner from "@/components/PromotionalBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { submitContactForm } from "@/services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
    setSubmitError("");
    
    try {
      const result = await submitContactForm(formData);
      
      // Redirect to WhatsApp with the message
      if (result.whatsappLink) {
        window.location.href = result.whatsappLink;
      }
      
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError("Failed to submit form. Please try again.");
      console.error("Contact form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PromotionalBanner />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our watches or need assistance? We're here to help! 
            Reach out to us through any of the following channels.
          </p>
        </div>
        
        {/* Contact Information & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-primary">Contact Information</h2>
            
            <div className="space-y-6">
              <Card className="border border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
                      <p className="text-muted-foreground mb-1">+91 73577 62652</p>
                      <p className="text-sm text-muted-foreground">Mon-Sat, 9:00 AM - 7:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                      <p className="text-muted-foreground mb-1">support@vmprime.com</p>
                      <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Office Address</h3>
                      <p className="text-muted-foreground mb-1">
                        123 Watch Street, Premium Plaza<br />
                        Mumbai, Maharashtra 400001<br />
                        India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Saturday: 9:00 AM - 7:00 PM<br />
                        Sunday: 10:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* WhatsApp Support */}
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-green-600">📱</span>
                Quick WhatsApp Support
              </h3>
              <p className="text-muted-foreground mb-4">
                Get instant support on WhatsApp for quick queries and order assistance.
              </p>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.open('https://wa.me/73577 62652', '_blank')}
              >
                Chat on WhatsApp
              </Button>
            </div>
          </div>
          
          {/* Contact Form */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Your message has been sent. We'll redirect you to WhatsApp shortly.
                  </p>
                  <Button 
                    className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      setSubmitSuccess(false);
                      setFormData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: ""
                      });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">First Name *</label>
                      <Input 
                        name="firstName"
                        placeholder="Enter your first name" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Last Name *</label>
                      <Input 
                        name="lastName"
                        placeholder="Enter your last name" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address *</label>
                    <Input 
                      type="email" 
                      name="email"
                      placeholder="Enter your email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone Number *</label>
                    <Input 
                      type="tel" 
                      name="phone"
                      placeholder="Enter your phone number" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Subject *</label>
                    <Input 
                      name="subject"
                      placeholder="What is your message about?" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Message *</label>
                    <Textarea 
                      name="message"
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  {submitError && (
                    <div className="text-red-500 text-sm">{submitError}</div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-success hover:bg-success/90 text-success-foreground py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">How can I track my order?</h3>
                <p className="text-muted-foreground">
                  Once your order is shipped, we'll send you a phone number via email and SMS. 
                  You can also contact our support team for real-time updates.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Do you offer warranty on watches?</h3>
                <p className="text-muted-foreground">
                  Yes, all our watches come with a 1-year manufacturer warranty covering 
                  movement defects and manufacturing issues.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Is Cash on Delivery available?</h3>
                <p className="text-muted-foreground">
                  Yes, COD is available across India. You can pay ₹200 in advance and 
                  the remaining amount when your order arrives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Contact CTA */}
        <div className="text-center bg-gradient-hero text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our customer support team is always ready to assist you with any queries or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
              Call Now: +91 73577 62652
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              onClick={() => window.open('https://wa.me/73577 62652', '_blank')}
            >
              WhatsApp Support
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;