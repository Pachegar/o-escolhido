
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Lightbulb } from 'lucide-react';

const insights = [
  "Clientes que acessam o rastreio têm 2× menos chance de pedir reembolso.",
  "Rastreios com 4+ eventos aumentam a confiança do cliente em 65%.",
  "Páginas de rastreio personalizadas reduzem ansiedade do comprador.",
  "Atualizações frequentes diminuem contatos no suporte em 40%.",
  "Rastreios com tom profissional aumentam percepção de qualidade.",
  "Clientes preferem receber notificações por WhatsApp sobre entregas."
];

export const SmartInsights = () => {
  const [currentInsight, setCurrentInsight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass-card border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="animate-pulse">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-h-[24px]">
            <p className="text-sm font-medium animate-fade-in">
              💡 <span className="text-primary">Insight:</span> {insights[currentInsight]}
            </p>
          </div>
          <div className="flex gap-1">
            {insights.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentInsight ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
