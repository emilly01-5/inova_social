import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import DenunciaCard from '@/components/denuncias/DenunciaCard';
import DenunciaMap from '@/components/denuncias/DenunciaMap';
import { Search, Loader2, Filter, ShieldAlert, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

export default function Home() {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  useEffect(() => {
    base44.entities.Denuncia.list('-created_date', 100).
    then(setDenuncias).
    catch(() => {}).
    finally(() => setLoading(false));

    const unsub = base44.entities.Denuncia.subscribe((event) => {
      setDenuncias((prev) => {
        if (event.type === 'create') return [event.data, ...prev];
        if (event.type === 'update') return prev.map((d) => d.id === event.data.id ? event.data : d);
        if (event.type === 'delete') return prev.filter((d) => d.id !== event.data.id);
        return prev;
      });
    });
    return unsub;
  }, []);

  const filtradas = denuncias.filter((d) => {
    const matchBusca = !busca || (d.titulo + d.descricao + d.endereco).toLowerCase().includes(busca.toLowerCase());
    const matchCat = filtroCategoria === 'Todas' || d.categoria === filtroCategoria;
    const matchStatus = filtroStatus === 'Todos' || d.status === filtroStatus;
    return matchBusca && matchCat && matchStatus;
  });

  const categorias = ['Todas', 'Buraco na via', 'Iluminação pública', 'Lixo e limpeza', 'Saneamento', 'Veículo abandonado', 'Árvore / Vegetação', 'Sinalização', 'Outro'];
  const statuses = ['Todos', 'Aberta', 'Em análise', 'Resolvida'];

  const stats = {
    total: denuncias.length,
    abertas: denuncias.filter((d) => d.status === 'Aberta').length,
    resolvidas: denuncias.filter((d) => d.status === 'Resolvida').length
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white" style={{ background: 'linear-gradient(135deg, #205ac6 0%, #143675 50%, #143675 100%)' }}>
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl" style={{ background: 'rgba(32,90,198,0.45)' }} />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-3xl" style={{ background: 'rgba(32,90,198,0.25)' }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-4 h-4 text-blue-300" />
              <span className="text-blue-200 text-xs font-medium">Bairro Mangabeira Cidade Verde</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sua cidade melhor</h1>
            <p className="text-white/80 text-sm mt-1">Registre e acompanhe problemas urbanos do seu bairro.</p>
          </div>
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold leading-none" style={{ color: '#5998FF' }}>{stats.total}</p>
              <p className="text-xs text-white mt-1">Total</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#205ac6' }}>
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{stats.abertas}</p>
                <p className="text-xs text-white mt-1">pendentes</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#205ac6' }}>
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{stats.resolvidas}</p>
                <p className="text-xs text-white mt-1">Resolvidas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa geral */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-[#205ac6]" />
          <h2 className="font-semibold text-slate-900">Mapa do bairro</h2>
          <span className="text-xs text-slate-400">({denuncias.filter((d) => d.latitude != null).length} localizadas)</span>
        </div>
        <DenunciaMap denuncias={filtradas} />
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título ou endereço..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#205ac6]/30 focus:border-[#205ac6]" />
          
        </div>
        <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
          <SelectTrigger className="w-full sm:w-48"><Filter className="w-4 h-4 mr-1.5 text-slate-400" /><SelectValue /></SelectTrigger>
          <SelectContent>{categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* Lista */}
      {loading ?
      <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-slate-300" /></div> :
      filtradas.length === 0 ?
      <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium mb-1">Nenhuma denúncia encontrada</p>
          <p className="text-sm text-slate-400 mb-4">Seja o primeiro a registrar um problema no bairro.</p>
          <Link to="/nova" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#143675] text-white text-sm font-medium hover:bg-[#205ac6] transition-colors">
            Nova Denúncia
          </Link>
        </div> :

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtradas.map((d) =>
        <Link key={d.id} to={`/denuncia/${d.id}`}>
              <DenunciaCard denuncia={d} />
            </Link>
        )}
        </div>
      }
    </div>);

}
