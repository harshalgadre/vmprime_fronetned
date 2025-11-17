import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PromotionalBanner from "@/components/PromotionalBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext"; // Import cart context
import { getProductById } from "@/services/api";
import { QRCodeSVG } from "qrcode.react";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1); // Add quantity state
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const { addToCart } = useCart(); // Use cart context
  
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
      setLoading(false);
    } catch (error: any) {
      console.error("Failed to fetch product:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Get current images based on selected color
  const getCurrentImages = () => {
    if (!product) return ["/placeholder.svg"];
    
    const images: string[] = [];
    
    // Always include the main product image first
    if (product.image) {
      images.push(product.image);
    }
    
    // If a color is selected and has specific images, add those as well
    if (product.colors && 
        product.colors[selectedColor] && 
        product.colors[selectedColor].images && 
        product.colors[selectedColor].images.length > 0) {
      // Add color-specific images
      images.push(...product.colors[selectedColor].images);
    }
    
    // If no images were added, use placeholder
    if (images.length === 0) {
      images.push("/placeholder.svg");
    }
    
    return images;
  };

  const currentImages = getCurrentImages();

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(
        product,
        {
          name: product.colors?.[selectedColor]?.name || "Default",
          color: product.colors?.[selectedColor]?.color || "#000000"
        },
        quantity
      );
    }
  };

  // Handle buy it now
  const handleBuyNow = () => {
    if (product) {
      addToCart(
        product,
        {
          name: product.colors?.[selectedColor]?.name || "Default",
          color: product.colors?.[selectedColor]?.color || "#000000"
        },
        quantity
      );
      // Navigate to cart page
      navigate('/cart');
    }
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!product) return 0;
    if (product.originalPrice && product.price && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  // Handle WhatsApp inquiry
  const handleWhatsAppInquiry = () => {
    if (product) {
      const selectedColorName = product.colors?.[selectedColor]?.name || "Default";
      const selectedColorValue = product.colors?.[selectedColor]?.color || "#000000";
      
      // Generate UPI payment URL
      const upiId = "7357762652@ybl"; // Your UPI ID
      const amount = product.price;
      const upiUrl = `upi://pay?pa=${upiId}&pn=Store Name&am=${amount}&cu=INR&tn=Product Purchase`;
      
      const message = `Hi, I'm interested in purchasing the *${product.name}*\n\n` +
        `*Product Details:*\n` +
        `• Price: ₹${product.price?.toLocaleString('en-IN')}\n` +
        `• Color: ${selectedColorName} (${selectedColorValue})\n\n` +
        
        `I would like to get more details and know the buying options.\n\n` +
        `Please let me know the available payment methods and delivery options.`;
      
      // Replace with your actual WhatsApp business number
      const whatsappNumber = "917357762652"; // Include country code without +
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
    }
  };
  
  // Generate and download QR code
  const handleGenerateQRCode = () => {
    if (product) {
      // Create a temporary link to download the QR code
      const upiId = "7357762652@ybl"; // Your UPI ID
      const amount = product.price;
      const upiUrl = `upi://pay?pa=${upiId}&pn=Store Name&am=${amount}&cu=INR&tn=Product Purchase`;
      
      // Create a temporary canvas element to generate the QR code
      const canvas = document.createElement('canvas');
      
      // Since we can't directly send the QR code via WhatsApp URL,
      // we'll show a modal with the QR code and instructions
      alert(`To complete your purchase:

1. Scan the QR code that will appear on the screen
2. Complete the payment of ₹${amount.toLocaleString('en-IN')}
3. After payment, please notify us with your transaction ID

Click OK to see the QR code.`);
      
      // In a real implementation, you would show a modal with the QR code
      // For now, we'll just show an alert with instructions
    }
  };
  
  // Show QR code modal
  const showQRCodeModal = () => {
    if (product) {
      const upiId = "7357762652@ybl"; // Your UPI ID
      const amount = product.price;
      const upiUrl = `upi://pay?pa=${upiId}&pn=Store Name&am=${amount}&cu=INR&tn=Product Purchase`;
      
      // Create modal content
      const modalContent = `
        <div style="text-align: center; padding: 20px;">
          <h3>Scan QR Code to Pay</h3>
          <p>Amount: ₹${amount.toLocaleString('en-IN')}</p>
          <div id="qr-code-container" style="margin: 20px auto; width: 200px; height: 200px;"></div>
          <p>Scan this QR code with any UPI app to complete your payment</p>
          <button onclick="document.getElementById('qr-modal').style.display='none'" style="margin-top: 10px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
      `;
      
      // Create modal element
      const modal = document.createElement('div');
      modal.id = 'qr-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      `;
      
      const modalInner = document.createElement('div');
      modalInner.style.cssText = `
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      `;
      
      modalInner.innerHTML = modalContent;
      modal.appendChild(modalInner);
      document.body.appendChild(modal);
      
      // Note: In a real implementation, you would render the QRCodeSVG component
      // inside the modal, but this requires more complex DOM manipulation
    }
  };
  
  // Handle sharing QR code via WhatsApp
  // const handleShareQRCode = () => {
  //   if (product) {
  //     const upiId = "7357762652@ybl"; // Your UPI ID
  //     const amount = product.price;
      
  //     const message = `Hi, I'm interested in purchasing the *${product.name}*\n\n` +
  //       `*Product Details:*\n` +
  //       `• Price: ₹${product.price?.toLocaleString('en-IN')}\n` +
  //       `• Color: ${product.colors?.[selectedColor]?.name || "Default"}\n\n` +
  //       `*Payment Instructions:*\n` +
  //       `Please scan the attached QR code to complete your payment of ₹${amount.toLocaleString('en-IN')} via UPI.\n\n` +
  //       `After payment, please share your transaction ID for order confirmation.`;
      
  //     // Replace with your actual WhatsApp business number
  //     const whatsappNumber = "917357762652"; // Include country code without +
  //     const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
      
  //     // Note: We can't directly attach the QR code image via URL scheme
  //     // In a real implementation, you would need to:
  //     // 1. Generate and save the QR code as an image
  //     // 2. Upload it to a server
  //     // 3. Include the image URL in the WhatsApp message
      
  //     window.open(whatsappUrl, '_blank');
      
  //     // Show instructions to the user
  //     alert("The QR code is displayed on the page. Please take a screenshot and send it along with the message.");
  //   }
  // };

  const discountPercentage = product ? calculateDiscount() : 0;

  if (loading) {
    return (
      <div className="min-h-screen">
        <PromotionalBanner />
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Loading Product...</h1>
            <p className="text-muted-foreground">Please wait while we fetch the product details</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <PromotionalBanner />
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">Sorry, we couldn't find the product you're looking for.</p>
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PromotionalBanner />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl border border-border shadow-lg">
              <img
                src={currentImages[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            {/* Thumbnail Images */}
            {currentImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {currentImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedImage === index ? "border-success ring-2 ring-success/30" : "border-border hover:border-success/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-success text-xl">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </span>
                    <span className="text-sm text-muted-foreground">({product.reviews || 0} reviews)</span>
                  </div>
                )}
              </div>
              
              {/* Category and Badge */}
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{product.category}</Badge>
                {product.badge && (
                  <Badge className="bg-success text-success-foreground">{product.badge}</Badge>
                )}
              </div>
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
              <span className="text-4xl font-bold text-success">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.originalPrice && product.price && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                  <Badge className="bg-success text-success-foreground text-lg">
                    Save {discountPercentage}%
                  </Badge>
                </>
              )}
            </div>
            
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3 p-4 bg-secondary rounded-lg">
                <h3 className="font-semibold text-foreground text-lg">
                  SELECT COLOUR: {product.colors[selectedColor]?.name}
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedColor(index);
                        setSelectedImage(0); // Reset to first image when color changes
                      }}
                      className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedColor === index 
                          ? "border-success ring-4 ring-success/30 scale-110" 
                          : "border-border hover:border-success/50 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.color }}
                      title={color.name}
                    >
                      {selectedColor === index && (
                        <span className="text-white text-sm font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                {product.colors[selectedColor]?.images && product.colors[selectedColor]?.images.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {product.colors[selectedColor]?.images.length} color-specific images available
                  </p>
                )}
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="space-y-3 p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold text-foreground text-lg">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10"
                >
                  -
                </Button>
                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10"
                >
                  +
                </Button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-success hover:bg-success/90 text-success-foreground py-6 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
              >
                ADD TO CART
              </Button>
              <Button 
                onClick={handleBuyNow}
                variant="outline" 
                className="w-full py-6 text-lg font-semibold transition-all duration-300 hover:shadow-md"
              >
                BUY IT NOW
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleWhatsAppInquiry}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold transition-all duration-300 hover:shadow-lg gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WHATSAPP
                </Button>
              </div>
            </div>
            
            {/* COD Info */}
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                    <span className="text-success-foreground text-lg">💰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-success">Want Cash on Delivery?</h4>
                    <p className="text-sm text-muted-foreground">
                      Pay only ₹200 now — pay the rest when your parcel arrives.
                    </p>
                    <p className="text-xs text-muted-foreground">₹200 is part of your order total (not extra).</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border">
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-success text-lg">🚚</span>
                </div>
                <p className="text-sm font-medium">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-success text-lg">💰</span>
                </div>
                <p className="text-sm font-medium">COD Available</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-success text-lg">🔄</span>
                </div>
                <p className="text-sm font-medium">3 Days Return & Exchange</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Description & Features */}
        <div className="mt-16">
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="text-xl font-semibold">Description</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <div className="space-y-4">
                  <p>{product?.description || "No description available for this product."}</p>
                  {product?.features && product.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {product?.features?.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-success">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-xl font-semibold">Shipping</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Free Shipping</h4>
                    <p>Free delivery on orders above ₹1,999. Standard delivery takes 3-7 business days.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Cash on Delivery</h4>
                    <p>COD available across India. Pay ₹200 advance, rest on delivery.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="warranty">
              <AccordionTrigger className="text-xl font-semibold">Warranty Information</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">1 Year Warranty</h4>
                    <p>All watches come with a 1-year manufacturer warranty covering movement defects.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">What's Covered</h4>
                    <ul className="space-y-1">
                      <li>• Movement malfunction</li>
                      <li>• Manufacturing defects</li>
                      <li>• Water resistance issues</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;