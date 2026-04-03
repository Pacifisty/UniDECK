'use client';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { Sector } from '@/types';
import { Network, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';

interface SectorNode extends Sector {
  children: SectorNode[];
}

function buildTree(sectors: Sector[]): SectorNode[] {
  const map = new Map<string, SectorNode>();
  sectors.forEach(s => map.set(s.id, { ...s, children: [] }));

  const roots: SectorNode[] = [];
  map.forEach(node => {
    if (node.parent?.id && map.has(node.parent.id)) {
      map.get(node.parent.id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function SectorCard({ node, depth = 0 }: { node: SectorNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;

  return (
    <div className={depth > 0 ? 'ml-6 mt-2' : 'mt-2'}>
      <div
        className={`flex items-start gap-2 p-3 rounded-xl border transition-colors ${
          hasChildren
            ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer'
            : 'border-slate-200 bg-white'
        }`}
        onClick={() => hasChildren && setExpanded(e => !e)}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          )
        ) : (
          <span className="w-4 h-4 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{node.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{node.code}</p>
          {node.description && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{node.description}</p>
          )}
        </div>
        {hasChildren && (
          <span className="text-xs text-blue-500 shrink-0 font-medium">{node.children.length} sub</span>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="border-l-2 border-blue-200 ml-4">
          {node.children.map(child => (
            <SectorCard key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgChartPage() {
  const [roots, setRoots] = useState<SectorNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Sector[]>('/sectors')
      .then(res => setRoots(buildTree(res.data)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center gap-3">
          <Network className="w-5 h-5 text-blue-600" />
          <div>
            <h1 className="page-title">Organograma</h1>
            <p className="text-sm text-slate-500 mt-1">Estrutura hierárquica de órgãos e secretarias</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm text-slate-500">Carregando estrutura...</span>
          </div>
        ) : roots.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-slate-500">Nenhum setor cadastrado.</p>
          </div>
        ) : (
          <div className="card p-5">
            {roots.map(root => (
              <SectorCard key={root.id} node={root} depth={0} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
