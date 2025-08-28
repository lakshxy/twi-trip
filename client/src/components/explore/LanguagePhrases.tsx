
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguagePhrases: React.FC = () => {
  const phrases = [
    {
      title: "Hello",
      translations: [
        { lang: "Hindi", text: "नमस्ते (Namaste)" },
        { lang: "Spanish", text: "Hola" },
        { lang: "French", text: "Bonjour" },
      ]
    },
    {
      title: "Thank you",
      translations: [
        { lang: "Hindi", text: "धन्यवाद (Dhanyavaad)" },
        { lang: "Spanish", text: "Gracias" },
        { lang: "French", text: "Merci" },
      ]
    },
    {
      title: "How much is this?",
      translations: [
        { lang: "Hindi", text: "यह कितने का है? (Yeh kitne ka hai?)" },
        { lang: "Spanish", text: "¿Cuánto cuesta?" },
        { lang: "French", text: "Combien ça coûte?" },
      ]
    },
  ];

  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-r from-travel-navy/5 via-white to-travel-mint/5 border-travel-navy/20">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 md:h-6 md:w-6 text-travel-navy" />
            <CardTitle className="text-travel-navy text-base md:text-lg">🌐 Useful Local Language Phrases</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phrases.map(phrase => (
              <div key={phrase.title} className="p-4 rounded-lg bg-white border border-travel-soft-lavender/20 hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-2">
                  <span className="font-semibold text-travel-navy mb-1 text-sm md:text-base">{phrase.title}</span>
                  {phrase.translations.map(t => (
                    <span key={t.lang} className="text-xs md:text-sm text-travel-navy/70">{t.lang}: <span className="font-medium">{t.text}</span></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline" className="border-travel-mint text-travel-navy hover:bg-travel-mint/10 text-xs md:text-sm">
              <Globe className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              View More Phrases
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguagePhrases;
