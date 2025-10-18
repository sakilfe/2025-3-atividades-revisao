'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/AppContext';
import Image from 'next/image';

export default function CartSheet() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemsCount } = useCart();

  const total = getCartTotal();
  const itemsCount = getCartItemsCount();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Carrinho
          {itemsCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {itemsCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Carrinho de Compras</SheetTitle>
          <SheetDescription>
            {itemsCount > 0 ? `${itemsCount} item(s) no carrinho` : 'Seu carrinho está vazio'}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
              <p className="text-sm text-gray-400">Adicione alguns produtos para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const discountedPrice = item.price * (1 - item.discountPercentage / 100);
                const itemTotal = discountedPrice * item.quantity;
                
                return (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-medium line-clamp-2">{item.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-green-600">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        {item.discountPercentage > 0 && (
                          <span className="text-xs text-gray-500 line-through">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-sm font-semibold">
                      ${itemTotal.toFixed(2)}
                    </div>
                  </div>
                );
              })}
              
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">${total.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    Finalizar Compra
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}