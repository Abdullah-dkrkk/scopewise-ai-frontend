import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ArrowUpRight, History as HistoryIcon, Search } from 'lucide-react';
import { analysisApi, riskClassName, toMessage } from '../api';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import ClassificationBadge from '../components/features/analysis/ClassificationBadge';
import { formatDate } from '../utils/format';

function HistoryRow({ item }) {
  return (
    <Link
      to={`/app/analysis/${item.id}`}
      className="group grid grid-cols-2 items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40 md:grid-cols-6"
    >
      <div className="col-span-2 flex min-w-0 items-center gap-2">
        <ClassificationBadge type={item.classification} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">Confidence</p>
        <p className="truncate text-sm font-semibold text-primary">
          {item.confidence > 0 ? `${item.confidence}%` : '—'}
        </p>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">Complexity</p>
        <p className="truncate text-sm font-semibold">{item.complexity}</p>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">Risk</p>
        <p className={`truncate text-sm font-semibold ${riskClassName(item.riskLevel)}`}>
          {item.risk}
        </p>
      </div>
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">
            {formatDate(item.createdAt)}
          </p>
          <p className="truncate text-xs font-medium">
            {item.projectName || 'No project'}
          </p>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
    </Link>
  );
}

HistoryRow.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    classification: PropTypes.string,
    confidence: PropTypes.number,
    complexity: PropTypes.number,
    risk: PropTypes.number,
    riskLevel: PropTypes.string,
    projectName: PropTypes.string,
    createdAt: PropTypes.number.isRequired,
  }).isRequired,
};

function HistoryList({ items, search, loading }) {
  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>;
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <HistoryIcon className="mx-auto mb-3 size-8 text-muted-foreground" />
          <p className="text-sm font-medium">No analyses found</p>
          <p className="mx-auto mt-1 max-w-sm break-words text-sm text-muted-foreground">
            {search
              ? 'Try a different search.'
              : 'Run your first analysis and it will appear here.'}
          </p>
          {!search && (
            <Link
              to="/app/analyze"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              Analyze a requirement
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => <HistoryRow key={item.id} item={item} />)}
    </div>
  );
}

HistoryList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  search: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    setLoading(true);
    analysisApi
      .getHistory({ page, perPage: 20 })
      .then((result) => {
        if (!active) return;
        setItems(result.items);
        setMeta(result.meta);
        setError('');
      })
      .catch((err) => {
        if (active) setError(toMessage(err, 'Could not load your analysis history.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, reloadKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => (item.projectName || '').toLowerCase().includes(q)
      || (item.classification || '').toLowerCase().includes(q));
  }, [items, search]);

  const totalPages = meta?.lastPage || 1;
  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every requirement you&apos;ve analyzed, with its scores and estimates.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by project or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search history"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Alert variant="error" title="Load failed">{error}</Alert>
          <Button variant="outline" size="sm" className="mt-3" onClick={retry}>Try again</Button>
        </div>
      )}

      <HistoryList items={filtered} search={search} loading={loading} />

      {!loading && totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Page
            {meta?.currentPage || page}
            {' of '}
            {totalPages}
            {' · '}
            {meta?.total || 0}
            {' analyses'}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
