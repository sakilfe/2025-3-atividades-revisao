'use client';

import { useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProducts } from '../contexts/AppContext';
import { Loader2 } from 'lucide-react';

export default function ProductList() {
  const { 
    products,
    categories, 
    selectedCategory, 
    searchTerm, 
    loading,
    loadProducts,
    loadProductsByCategory,
    searchProducts,
    setCategory, 
    setSearchTerm 
  } = useProducts();

  // Debounce para pesquisa
  const debounceSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchTerm: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          searchProducts(searchTerm);
        }, 500);
      };
    })(),
    [searchProducts]
  );

  useEffect(() => {
    // Carrega os produtos na primeira renderização
    loadProducts();
  }, []);

  useEffect(() => {
    // Executa busca quando o termo de pesquisa muda
    if (searchTerm) {
      debounceSearch(searchTerm);
    } else if (selectedCategory !== 'all') {
      loadProductsByCategory(selectedCategory);
    } else {
      loadProducts();
    }
  }, [searchTerm, debounceSearch, selectedCategory, loadProducts, loadProductsByCategory]);

  const handleCategoryChange = (category: string) => {
    setCategory(category);
    setSearchTerm(''); // Limpa a pesquisa ao mudar categoria
    if (category === 'all') {
      loadProducts();
    } else {
      loadProductsByCategory(category);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCategory('all'); // Reseta categoria ao fazer pesquisa
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Catálogo de Produtos</h1>
        
        {/* Barra de pesquisa */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-md mx-auto"
          />
        </div>

        {/* Filtro por categoria */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => handleCategoryChange(category)}
              className="capitalize"
            >
              {category === 'all' ? 'Todas' : category}
            </Button>
          ))}
        </div>

        {/* Contador de produtos e loading */}
        <div className="text-center text-gray-600 mb-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando produtos...
            </div>
          ) : (
            `${products.length} produto(s) encontrado(s)`
          )}
        </div>
      </div>

      {/* Grid de produtos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Skeleton loading */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Mensagem quando não há produtos */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
          <p className="text-gray-400 text-sm mt-2">
            Tente ajustar os filtros ou termos de busca.
          </p>
        </div>
      )}
    </div>
  );
}