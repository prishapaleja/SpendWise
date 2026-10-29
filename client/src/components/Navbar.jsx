import { LayoutDashboard, ArrowLeftRight, Wallet, Leaf } from 'lucide-react';

const links = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'budgets', label: 'Budgets', icon: Wallet },
];

export default function Navbar({ active, onNavigate }) {
  return <aside className="sidebar">
    <div className="brand"><span className="brand-icon"><Leaf size={21}/></span><span>spend<span className="brand-light">wise</span><small>PERSONAL FINANCE</small></span></div>
    <p className="nav-label">WORKSPACE</p>
    <nav>{links.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-link ${active === id ? 'active' : ''}`} onClick={() => onNavigate(id)}><Icon size={18}/><span>{label}</span>{active === id && <i/>}</button>)}</nav>
    <div className="sidebar-bottom"><div className="tip-icon"><Leaf size={18}/></div><strong>Small steps add up.</strong><p>Every mindful choice brings you closer to your goals.</p><span className="sidebar-version">SPENDWISE · STUDENT EDITION</span></div>
  </aside>;
}
