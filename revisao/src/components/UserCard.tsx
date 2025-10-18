'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  company: {
    name: string;
    title: string;
    department: string;
  };
  image: string;
}

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <Card className="max-w-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src={user.image} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl">
          {user.firstName} {user.lastName}
        </CardTitle>
        <CardDescription className="flex items-center justify-center gap-2">
          <Badge variant={user.gender === 'female' ? 'default' : 'secondary'}>
            {user.gender}
          </Badge>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{user.age} anos</span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-blue-500" />
            <span className="truncate">{user.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-green-500" />
            <span>{user.phone}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
            <div>
              <div>{user.address.address}</div>
              <div className="text-gray-600">
                {user.address.city}, {user.address.state}
              </div>
              <div className="text-gray-600">{user.address.country}</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm mb-2">Trabalho</h4>
          <div className="space-y-1 text-sm">
            <div className="font-medium">{user.company.title}</div>
            <div className="text-gray-600">{user.company.department}</div>
            <div className="text-gray-600">{user.company.name}</div>
          </div>
        </div>

        <Button className="w-full" variant="outline">
          Ver Perfil
        </Button>
      </CardContent>
    </Card>
  );
}