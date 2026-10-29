import { ArrowDownLeft, ArrowUpRight, Wallet, PiggyBank } from 'lucide-react';
const icons = { expenses: ArrowUpRight, income: ArrowDownLeft, budget: Wallet, saved: PiggyBank };
export default function SummaryCard({ label, value, note, type = 'expenses', tone = 'green' }) {
  const Icon = icons[type] || Wallet;
  return <article className="summary-card"><div className="summary-top"><span>{label}</span><span className={`summary-icon ${tone}`}><Icon size={18}/></span></div><strong className="summary-value">{value}</strong><p>{note}</p></article>;
}
