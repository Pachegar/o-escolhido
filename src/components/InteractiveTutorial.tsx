
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface TutorialStep {
  title: string;
  message: string;
  selector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Dashboard",
    message: "Aqui você monitora tudo. KPIs, métricas e o pulso do seu negócio em tempo real. Sem firulas.",
    selector: '[href="/dashboard"]',
    position: 'right'
  },
  {
    title: "Rastreamentos", 
    message: "Seus códigos de rastreamento ficam aqui. Gerencie, monitore e domine cada entrega como um predador.",
    selector: '[href="/rastreamentos"]',
    position: 'right'
  },
  {
    title: "Criar Rastreamento",
    message: "O botão que move montanhas. Clique aqui e transforme vendas em entregas rastreadas. Simples assim.",
    selector: '[href="/rastreamentos/criar"]',
    position: 'right'
  },
  {
    title: "Modelos de Entrega",
    message: "Templates que convertem. Configure suas páginas de rastreamento para impressionar e reter clientes.",
    selector: '[href="/modelos"]',
    position: 'right'
  },
  {
    title: "Integrações",
    message: "Conecte tudo. Automatize fluxos e deixe a tecnologia trabalhar para você, não contra você.",
    selector: '[href="/integracoes"]',
    position: 'right'
  },
  {
    title: "Automação de Envios",
    message: "Configure e esqueça. Envios automáticos que funcionam 24/7 enquanto você foca no que importa: vender.",
    selector: '[href="/automacao-envios"]',
    position: 'right'
  },
  {
    title: "Indicações",
    message: "Ganhe por cada pessoa que trouxer. Transforme networking em receita extra. Dinheiro que cai na conta.",
    selector: '[href="/indicacoes"]',
    position: 'right'
  },
  {
    title: "Order Bump",
    message: "Adicione produtos na última etapa. Aumente ticket médio direto na página de rastreamento. Lucro puro.",
    selector: '[href="/orderbump"]',
    position: 'right'
  },
  {
    title: "Planos",
    message: "Escale sem limites. Upgrade quando precisar de mais poder. Sem burocracias, só resultados.",
    selector: '[href="/planos"]',
    position: 'right'
  },
  {
    title: "Configurações",
    message: "Personalize tudo ao seu gosto. Sua conta, suas regras. Configure e domine completamente a plataforma.",
    selector: '[href="/configuracoes"]',
    position: 'right'
  }
];

interface InteractiveTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updateHighlight = () => {
      if (currentStep < tutorialSteps.length) {
        const step = tutorialSteps[currentStep];
        const element = document.querySelector(step.selector) as HTMLElement;
        
        if (element) {
          setHighlightedElement(element);
          
          // Calculate tooltip position
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          
          let top = 0;
          let left = 0;
          
          switch (step.position) {
            case 'right':
              top = rect.top + scrollTop + rect.height / 2 - 100;
              left = rect.right + scrollLeft + 20;
              break;
            case 'left':
              top = rect.top + scrollTop + rect.height / 2 - 100;
              left = rect.left + scrollLeft - 320;
              break;
            case 'top':
              top = rect.top + scrollTop - 220;
              left = rect.left + scrollLeft + rect.width / 2 - 150;
              break;
            case 'bottom':
              top = rect.bottom + scrollTop + 20;
              left = rect.left + scrollLeft + rect.width / 2 - 150;
              break;
          }
          
          setTooltipPosition({ top, left });
        }
      }
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    
    return () => {
      window.removeEventListener('resize', updateHighlight);
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (currentStep >= tutorialSteps.length) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <Card className="glass-card max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-3">Pronto para dominar!</h2>
            <p className="text-muted-foreground mb-6">
              Agora você conhece todas as armas da Pachegar. Hora de transformar vendas em entregas que impressionam.
            </p>
            <Button 
              onClick={onComplete}
              className="w-full hover-button glow-button"
            >
              Começar a conquistar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepData = tutorialSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 z-40" />
      
      {/* Highlight */}
      {highlightedElement && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: highlightedElement.getBoundingClientRect().top + window.pageYOffset - 4,
            left: highlightedElement.getBoundingClientRect().left + window.pageXOffset - 4,
            width: highlightedElement.offsetWidth + 8,
            height: highlightedElement.offsetHeight + 8,
            border: '3px solid #3b82f6',
            borderRadius: '8px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            clipPath: 'polygon(0% 0%, 0% 100%, -4px 100%, -4px -4px, calc(100% + 4px) -4px, calc(100% + 4px) calc(100% + 4px), -4px calc(100% + 4px), -4px 100%, 100% 100%, 100% 0%)'
          }}
        />
      )}
      
      {/* Tooltip */}
      <div
        className="fixed z-50"
        style={{
          top: tooltipPosition.top,
          left: Math.max(20, Math.min(tooltipPosition.left, window.innerWidth - 320))
        }}
      >
        <Card className="glass-card w-80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white">{currentStepData.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="h-6 w-6 text-muted-foreground hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {currentStepData.message}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} de {tutorialSteps.length}
              </span>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkip}
                  className="hover-button"
                >
                  Pular
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="hover-button glow-button"
                >
                  {currentStep < tutorialSteps.length - 1 ? 'Próximo' : 'Finalizar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
