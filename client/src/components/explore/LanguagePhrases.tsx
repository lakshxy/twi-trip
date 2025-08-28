
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

const LanguagePhrases: React.FC = () => {
  return (
    <div className="mb-8">
      <Card className="border-travel-sky/30 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Globe className="h-6 w-6 text-travel-sky" />
            <CardTitle className="text-travel-navy text-base md:text-lg">🗣️ Local Language Phrases</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm md:text-base text-travel-navy/80">
            <li>Hello: <span className="font-semibold">Olá</span></li>
            <li>Thank you: <span className="font-semibold">Obrigado / Obrigada</span></li>
            <li>Goodbye: <span className="font-semibold">Adeus</span></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguagePhrases;
