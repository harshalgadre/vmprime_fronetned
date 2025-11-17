import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product._id}`);
  };

  if (variant === 'compact') {
    return (
      <div
        className="min-w-[280px] max-w-[280px] flex-shrink-0 cursor-pointer group bg-white rounded-lg overflow-hidden"
        onClick={handleClick}
      >
        <div className="relative">
          <div className="aspect-square bg-[#F7F7F7] rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          {product.badge && (
            <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium text-white bg-[#12B76A] rounded-sm">
              {product.badge}
            </span>
          )}
        </div>
        <div className="p-4">
          {product.type && (
            <p className="text-xs font-medium text-[#12B76A] uppercase mb-1">{product.type}</p>
          )}
          <h3 className="font-medium text-base mb-1 truncate">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            {product.rating && (
              <>
                <div className="flex items-center">
                  <span className="text-[#FDB022]">★</span>
                  <span className="text-sm ml-1 font-medium">{product.rating}</span>
                </div>
                {product.reviews && (
                  <span className="text-sm text-[#667085]">({product.reviews})</span>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold">₹{product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <>
                <p className="text-sm text-[#667085] line-through">₹{product.originalPrice.toLocaleString()}</p>
                <span className="text-xs font-medium text-[#12B76A]">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <Button
            variant="default"
            className="w-full mt-4 bg-[#101828] hover:bg-[#1D2839] text-white"
          >
            View Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="relative bg-gray-100 rounded-lg aspect-square mb-3 overflow-hidden cursor-pointer group"
        onClick={handleClick}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium mb-1">{product.name}</h3>
        <p className="text-gray-600 mb-3">₹{product.price.toLocaleString()}</p>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleClick}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
