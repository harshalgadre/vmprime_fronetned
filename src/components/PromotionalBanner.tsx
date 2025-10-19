import { Truck, Gift, CreditCard } from "lucide-react";

const PromotionalBanner = () => {
  const offers = [
    { icon: <Truck className="w-4 h-4" />, text: "Free Shipping Today" },
    { icon: <CreditCard className="w-4 h-4" />, text: "COD Available" },
    { icon: <Gift className="w-4 h-4" />, text: "Order Above Rs.1999 & Get Free Cleaning Pen!" }
  ];

  return (
    <div className="bg-success text-success-foreground py-2 overflow-hidden">
      <div className="animate-scroll whitespace-nowrap">
        <div className="inline-flex items-center space-x-8 px-4">
          {offers.concat(offers).map((offer, index) => (
            <div key={index} className="inline-flex items-center space-x-2 text-sm font-medium">
              {offer.icon}
              <span>{offer.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;