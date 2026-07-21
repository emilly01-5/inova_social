import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Loader2, Send, MapPin } from 'lucide-react';
import MapPicker from './MapPicker';
import { MANGABEIRA_CENTER } from './MapPicker';
import { toast } from 'sonner';

const categorias = ["Buraco na via", "Iluminação pública", "Lixo e limpeza", "Saneamento", "Veículo abandonado", "Árvore / Vegetação", "Sinalização", "Outro"];
const prioridades = ["Baixa", "Média", "Alta"];

export default function DenunciaForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    titulo: '', descricao: '', categoria: 'Outro', endereco: '',
    prioridade: 'Média', foto_url: '', latitude: null, longitude: null
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set('foto_url', file_url);
      toast.success('Foto enviada!');
    } catch {
      toast.error('Erro ao enviar foto');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.titulo) {
      toast.error('Informe o título do problema');
      return;
    }
    if (form.latitude == null || form.longitude == null) {
      toast.error('Marque no mapa o local do problema');
      return;
    }
    try {
      setLoading(true);
      const created = await base44.entities.Denuncia.create(form);
      toast.success('Denúncia registrada com sucesso!');
      navigate(`/denuncia/${created.id}`);
    } catch {
      toast.error('Erro ao registrar denúncia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <Label className="mb-1.5">Título *</Label>
        <Input value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Ex: Buraco grande na Rua das Flores" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5">Categoria *</Label>
          <Select value={form.categoria} onValueChange={(v) => set('categoria', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5">Prioridade</Label>
          <Select value={form.prioridade} onValueChange={(v) => set('prioridade', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {prioridades.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="mb-1.5">Descrição</Label>
        <Textarea value={form.descricao} onChange={(e) => set('descricao', e.target.value)} rows={4} placeholder="Descreva o problema em detalhes..." />
      </div>

      {/* Mapa para localização */}
      <div>
        <Label className="mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#205ac6]" /> Localização no mapa *
        </Label>
        <MapPicker
          latitude={form.latitude}
          longitude={form.longitude}
          onChange={({ lat, lng }) => {
            set('latitude', lat);
            set('longitude', lng);
          }}
        />
        <p className="text-xs text-slate-400 mt-1.5">
          {form.latitude != null
            ? `Local marcado: ${form.latitude.toFixed(5)}, ${form.longitude.toFixed(5)}`
            : 'Clique no mapa para marcar o local do problema.'}
        </p>
      </div>

      <div>
        <Label className="mb-1.5">Endereço de referência</Label>
        <Input value={form.endereco} onChange={(e) => set('endereco', e.target.value)} placeholder="Rua, número ou ponto de referência" />
      </div>

      <div>
        <Label className="mb-1.5">Foto comprobatória</Label>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl py-8 cursor-pointer hover:border-[#205ac6] hover:bg-blue-50/40 transition-colors">
          {form.foto_url ? (
            <img src={form.foto_url} alt="Prévia" className="max-h-48 rounded-lg" />
          ) : (
            <>
              <Camera className="w-7 h-7 text-slate-400" />
              <span className="text-sm text-slate-500">{uploading ? 'Enviando...' : 'Clique para adicionar uma foto do problema'}</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploading} />
        </label>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#205ac6] to-[#143675] hover:opacity-90 text-white shadow-md shadow-[#205ac6]/25">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Registrar Denúncia
      </Button>
    </form>
  );
}
