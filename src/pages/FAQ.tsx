import PromotionalBanner from "@/components/PromotionalBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FAQ = () => {
  const faqs = [
    {
      category: "Orders & Payment",
      questions: [
        {
          question: "How can I place an order?",
          answer: "You can place an order by browsing our collection, selecting your desired watch, choosing your preferences, and clicking 'Add to Cart'. Follow the checkout process to complete your order. You can also order directly via WhatsApp for instant assistance."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI payments, net banking, and Cash on Delivery (COD). For COD orders, you need to pay ₹200 in advance, and the remaining amount when your order arrives."
        },
        {
          question: "Is it safe to pay online on your website?",
          answer: "Yes, absolutely! We use industry-standard SSL encryption and secure payment gateways to ensure your financial information is completely protected. All transactions are processed through trusted payment partners."
        },
        {
          question: "Can I modify or cancel my order after placing it?",
          answer: "You can modify or cancel your order within 2 hours of placing it. After that, our team starts processing your order for quick dispatch. Please contact our support team immediately if you need to make changes."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          question: "Do you offer free shipping?",
          answer: "Yes! We offer free shipping on all orders above ₹1,999. For orders below this amount, a nominal shipping charge of ₹99 applies. We deliver across India."
        },
        {
          question: "How long does delivery take?",
          answer: "Standard delivery takes 3-7 business days across India. Metro cities usually receive orders within 3-5 days, while other locations may take 5-7 days. We'll provide tracking information once your order is shipped."
        },
        {
          question: "How can I track my order?",
          answer: "Once your order is shipped, you'll receive a phone number via email and SMS. You can use this number to track your package on our website or the courier partner's website. You can also contact our support team for real-time updates."
        },
        {
          question: "What if I'm not available during delivery?",
          answer: "Our courier partners will attempt delivery 2-3 times. If you're not available, they'll leave a delivery slip with instructions. You can also reschedule delivery by contacting the courier partner directly using the tracking number."
        }
      ]
    },
    {
      category: "Products & Quality",
      questions: [
        {
          question: "Are your watches authentic?",
          answer: "All our watches are high-quality AAA replicas that closely match the design and feel of luxury brands. We clearly mention the quality grade for each product. While they are not original branded watches, they offer excellent craftsmanship at affordable prices."
        },
        {
          question: "Do you offer warranty on watches?",
          answer: "Yes, all our watches come with a 1-year manufacturer warranty that covers movement defects, manufacturing issues, and water resistance problems. The warranty does not cover damage due to misuse, accidents, or normal wear and tear."
        },
        {
          question: "Are the watches water-resistant?",
          answer: "Most of our watches offer basic water resistance suitable for daily activities like washing hands or light splashes. However, we don't recommend swimming or diving with them unless specifically mentioned as 'diving grade' in the product description."
        },
        {
          question: "What materials are used in your watches?",
          answer: "Our watches feature high-quality materials including stainless steel cases, sapphire crystal or mineral glass, genuine leather or premium rubber straps, and reliable automatic or quartz movements depending on the model."
        }
      ]
    },
    {
      category: "Customer Support",
      questions: [
        {
          question: "How can I contact customer support?",
          answer: "You can reach us via phone at +91 73577 62652 (Mon-Sat, 9 AM-7 PM), email at support@vmprime.com, or WhatsApp for instant support. We aim to respond to all queries within 24 hours."
        },
        {
          question: "Do you provide size guidance?",
          answer: "Yes! Each product page includes detailed size information and measurements. Our customer support team can also help you choose the right size based on your wrist measurements. You can also visit our size guide section."
        },
        {
          question: "Can I get product recommendations?",
          answer: "Absolutely! Our team loves helping customers find their perfect watch. Share your preferences, budget, and occasion with us via WhatsApp or phone, and we'll provide personalized recommendations."
        },
        {
          question: "Do you have a physical store?",
          answer: "We are primarily an online retailer, which helps us offer better prices. However, you can visit our office in Mumbai for product viewing by prior appointment. Contact us to schedule a visit."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <PromotionalBanner />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to the most common questions about our products, services, and policies. 
            Can't find what you're looking for? Our support team is here to help!
          </p>
        </div>
        
        {/* Quick Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center border border-border hover:shadow-premium transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-success text-2xl">📞</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
              <p className="text-muted-foreground mb-4">Get instant help over the phone</p>
              <Button variant="outline" size="sm">+91 73577 62652</Button>
            </CardContent>
          </Card>
          
          <Card className="text-center border border-border hover:shadow-premium transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-success text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">WhatsApp Chat</h3>
              <p className="text-muted-foreground mb-4">Quick responses on WhatsApp</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">Chat Now</Button>
            </CardContent>
          </Card>
          
          <Card className="text-center border border-border hover:shadow-premium transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-success text-2xl">✉️</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-4">Detailed help via email</p>
              <Button variant="outline" size="sm">support@vmprime.com</Button>
            </CardContent>
          </Card>
        </div>
        
        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-success text-success-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {categoryIndex + 1}
                </span>
                {category.category}
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem 
                    key={faqIndex} 
                    value={`${categoryIndex}-${faqIndex}`}
                    className="border border-border rounded-lg px-6 data-[state=open]:shadow-elegant"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-success transition-colors py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
        
        {/* Still Need Help Section */}
        <div className="mt-20 bg-gradient-hero text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our friendly customer support team is always ready to assist you with personalized help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 font-semibold">
              Contact Support
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold">
              WhatsApp Us
            </Button>
          </div>
        </div>
        
        {/* Popular Searches */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-primary text-center mb-8">Popular Help Topics</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Track My Order",
              "Payment Methods",
              "Warranty Info",
              "Size Guide",
              "Shipping Charges",
              "COD Policy",
              "Contact Support"
            ].map((topic, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="hover:bg-success hover:text-success-foreground transition-colors"
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;