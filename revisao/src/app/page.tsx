'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductList from '@/components/ProductList';
import UserList from '@/components/UserList';
import CartSheet from '@/components/CartSheet';
import { useCart, useFavorites } from '../contexts/AppContext';
import { Heart } from 'lucide-react';

export default function Home() {
  const [activeView, setActiveView] = useState<'products' | 'users'>('products');
  const { getCartItemsCount } = useCart();
  const { favorites } = useFavorites();

  const cartItemsCount = getCartItemsCount();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Atividade de Revisão - React
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Navegação */}
            <div className="flex gap-4">
              <Button
                variant={activeView === 'products' ? 'default' : 'outline'}
                onClick={() => setActiveView('products')}
              >
                Produtos
              </Button>
              <Button
                variant={activeView === 'users' ? 'default' : 'outline'}
                onClick={() => setActiveView('users')}
              >
                Usuários
              </Button>
            </div>

            {/* Ações do usuário */}
            <div className="flex items-center gap-4">
              {/* Favoritos */}
              <Button variant="outline" className="relative">
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
                {favorites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {favorites.length}
                  </Badge>
                )}
              </Button>

              {/* Carrinho */}
              <CartSheet />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto">
        {activeView === 'products' ? <ProductList /> : <UserList />}
      </main>
    </div>
  );
}