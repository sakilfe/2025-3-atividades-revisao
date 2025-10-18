'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ProductList from '@/components/ProductList';
import UserList from '@/components/UserList';

export default function Home() {
  const [activeView, setActiveView] = useState<'products' | 'users'>('products');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Atividade de Revisão - React
          </h1>
          <div className="flex justify-center gap-4">
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
        </div>
      </header>

      <main className="container mx-auto">
        {activeView === 'products' ? <ProductList /> : <UserList />}
      </main>
    </div>
  );
}