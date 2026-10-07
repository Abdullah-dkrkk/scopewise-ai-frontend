import PropTypes from 'prop-types';
import {
  Boxes, Settings2, ShieldCheck, KeyRound, Plug, Database, Lock,
  Gauge, LayoutDashboard, Megaphone, ShoppingCart, FileText, Shapes,
} from 'lucide-react';
import Badge from '../../ui/Badge';
import { classificationClassName, getClassification } from '../../../api';

/**
 * Every classification the backend or ML service can emit, with a fallback so an
 * unknown value renders as a neutral badge instead of a wrong label.
 */
const ICONS = {
  functional: Settings2,
  authentication: KeyRound,
  api: Boxes,
  integration: Plug,
  data_model: Database,
  security: Lock,
  technical: Boxes,
  performance: Gauge,
  non_functional: ShieldCheck,
  ui_design: Shapes,
  reporting: LayoutDashboard,
  dashboard: LayoutDashboard,
  marketing: Megaphone,
  e_commerce: ShoppingCart,
  content_management: FileText,
  general: Settings2,
};

export default function ClassificationBadge({ type = 'general' }) {
  const { key, label } = getClassification(type);
  const Icon = ICONS[key] || Settings2;

  return (
    <Badge className={classificationClassName(type)}>
      <Icon className="size-3 shrink-0" />
      <span className="truncate">{label}</span>
    </Badge>
  );
}

ClassificationBadge.propTypes = {
  type: PropTypes.string,
};
