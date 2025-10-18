'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCart, useFavorites } from "../contexts/AppContext";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  thumbnail: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const isProductFavorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
  };

  return (
    <Card className="max-w-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover rounded-t-lg"
          />
          {product.discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              -{product.discountPercentage.toFixed(0)}%
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 left-2 rounded-full bg-white/80 hover:bg-white ${
              isProductFavorite ? 'text-red-500' : 'text-gray-600'
            }`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isProductFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </CardDescription>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{product.category}</Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-green-600">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Em estoque: {product.stock}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </CardContent>
    </Card>
  );
}