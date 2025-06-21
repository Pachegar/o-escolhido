
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const EditarRastreamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [eventos, setEventos] = useState([
    {
      id: '1',
      data: '2024-01-15 09:00',
      mensagem: 'Objeto postado nos Correios',
      local: 'Cotia - SP'
    },
    {
      id: '2',
      data: '2024-01-15 14:30',
      mensagem: 'Objeto em trânsito para unidade de distribuição',
      local: 'São Paulo - SP'
    },
    {
      id: '3',
      data: '2024-01-16 08:15',
      mensagem: 'Objeto saiu para entrega',
      local: 'São Paulo - SP'
    }
  ]);

  const handleEventoChange = (index: number, field: string, value: string) => {
    setEventos(prev => prev.map((evento, i) => 
      i === index ? { ...evento, [field]: value } : evento
    ));
  };

  const adicionarEvento = () => {
    const novoEvento = {
      id: Date.now().toString(),
      data: '',
      mensagem: '',
      local: ''
    };
    setEventos(prev => [...prev, novoEvento]);
  };

  const removerEvento = (index: number) => {
    setEventos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would save to Supabase
      console.log('Updating tracking events:', eventos);
      
      toast({
        title: "Rastreamento atualizado!",
        description: "As informações foram salvas com sucesso",
      });
      
      navigate(`/rastreamentos/${id}`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o rastreamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Editar Rastreamento</h1>
          <p className="text-muted-foreground">Personalize as mensagens e eventos do rastreamento</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Eventos do Rastreamento</CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={adicionarEvento}
                className="hover-button"
              >
                ➕ Adicionar evento
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventos.map((evento, index) => (
                <div key={evento.id} className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Evento {index + 1}</h3>
                    {eventos.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removerEvento(index)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`data-${index}`}>Data e Hora</Label>
                      <Input
                        id={`data-${index}`}
                        type="datetime-local"
                        value={evento.data}
                        onChange={(e) => handleEventoChange(index, 'data', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`local-${index}`}>Local</Label>
                      <Input
                        id={`local-${index}`}
                        value={evento.local}
                        onChange={(e) => handleEventoChange(index, 'local', e.target.value)}
                        placeholder="Ex: São Paulo - SP"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`mensagem-${index}`}>Mensagem</Label>
                    <Textarea
                      id={`mensagem-${index}`}
                      value={evento.mensagem}
                      onChange={(e) => handleEventoChange(index, 'mensagem', e.target.value)}
                      placeholder="Descreva o que aconteceu neste evento..."
                      required
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/rastreamentos/${id}`)}
              className="flex-1 hover-button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 hover-button"
            >
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        </form>

        {/* Tips Card */}
        <Card className="glass-card mt-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold mb-1">Dicas para mensagens eficazes</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use linguagem clara e profissional</li>
                  <li>• Inclua informações de localização realistas</li>
                  <li>• Mantenha a sequência cronológica dos eventos</li>
                  <li>• Evite informações muito específicas que possam gerar suspeitas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditarRastreamento;
