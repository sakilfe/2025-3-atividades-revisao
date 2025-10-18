'use client';

import { useEffect, useCallback } from 'react';
import UserCard from './UserCard';
import { Input } from '@/components/ui/input';
import { useUsers } from '../contexts/AppContext';
import { Loader2 } from 'lucide-react';

export default function UserList() {
  const { 
    users,
    loading,
    loadUsers,
    searchUsers,
  } = useUsers();

  // Debounce para pesquisa
  const debounceSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchTerm: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (searchTerm.trim()) {
            searchUsers(searchTerm);
          } else {
            loadUsers();
          }
        }, 500);
      };
    })(),
    [searchUsers, loadUsers]
  );

  useEffect(() => {
    // Carrega os usuários na primeira renderização
    loadUsers();
  }, []);

  const handleSearchChange = (value: string) => {
    debounceSearch(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Equipe</h1>
        
        {/* Barra de pesquisa */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Pesquisar usuários..."
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-md mx-auto"
          />
        </div>

        {/* Contador de usuários e loading */}
        <div className="text-center text-gray-600 mb-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando usuários...
            </div>
          ) : (
            `${users.length} usuário(s) encontrado(s)`
          )}
        </div>
      </div>

      {/* Grid de usuários */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Skeleton loading */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md animate-pulse p-6"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="mt-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {/* Mensagem quando não há usuários */}
      {!loading && users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum usuário encontrado.</p>
          <p className="text-gray-400 text-sm mt-2">
            Tente ajustar os termos de busca.
          </p>
        </div>
      )}
    </div>
  );
}