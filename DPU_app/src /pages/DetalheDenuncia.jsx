import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, MapPin, Calendar, Pencil, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { denunciaIcon } from '@/components/denuncias/MapPicker';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import moment from 'moment';

const statusConfig = {
  'Aberta': 'bg-amber-100 text-amber-700 border-amber-200',
  'Em análise': 'bg-blue-100 text-blue-700 border-blue-200',
  'Resolvida': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const prioConfig = {
  'Baixa': 'bg-slate-100 text-slate-600',
  'Média': 'bg-orange-100 text-orange-700',
  'Alta': 'bg-rose-100 text-rose-700',
};

export default function DetalheDenuncia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [denuncia, setDenuncia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Denuncia.get(id)
      .then(setDenuncia)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-slate-300" /></div>;
  }

  if (!denuncia) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Denúncia não encontrada.</p>
        <Link to="/" className="text-[#205ac6] font-medium hover:underline">Voltar à lista</Link>
      </div>
    );
  }

  const updateStatus = async (status) => {
    try {
      const updated = await base44.entities.Denuncia.update(denuncia.id, { status });
      setDenuncia(updated);
      toast.success('Status atualizado');
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleDelete = async () => {
    try {
      await base44.entities.Denuncia.delete(denuncia.id);
      toast.success('Denúncia removida');
      navigate('/');
    } catch {
      toast.error('Erro ao remover denúncia');
    }
  };

  const hasCoords = denuncia.latitude != null && denuncia.longitude != null;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        {denuncia.foto_url && (
          <div className="aspect-[16/9] bg-slate-100">
            <img src={denuncia.foto_url} alt={denuncia.titulo} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#205ac6] bg-blue-50 px-2.5 py-1 rounded-md">
              {denuncia.categoria}
            </span>
            <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-md', prioConfig[denuncia.prioridade])}>
              {denuncia.prioridade}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">{denuncia.titulo}</h1>

          {denuncia.descricao && (
            <p className="text-slate-600 leading-relaxed mb-5">{denuncia.descricao}</p>
          )}

          <div className="space-y-2 mb-5 pb-5 border-b border-slate-100">
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
              <span>{denuncia.endereco || 'Mangabeira Cidade Verde'}{hasCoords ? ` — ${denuncia.latitude.toFixed(5)}, ${denuncia.longitude.toFixed(5)}` : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Reportada em {moment(denuncia.created_date).format('DD/MM/YYYY [às] HH:mm')}</span>
            </div>
          </div>

          {/* Mapa com a localização */}
          {hasCoords && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#205ac6]" /> Localização
              </h3>
              <div style={{ height: 280, width: '100%' }} className="rounded-xl overflow-hidden border border-slate-200">
                <MapContainer center={[denuncia.latitude, denuncia.longitude]} zoom={16} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                  <Marker position={[denuncia.latitude, denuncia.longitude]} icon={denunciaIcon}>
                    <Popup>Local do problema</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}

          {/* Atualizar status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Status atual:</span>
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', statusConfig[denuncia.status])}>
                {denuncia.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={denuncia.status} onValueChange={updateStatus}>
                <SelectTrigger className="w-36"><Pencil className="w-3.5 h-3.5 mr-1 text-slate-400" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aberta">Aberta</SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                  <SelectItem value="Resolvida">Resolvida</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={handleDelete} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
