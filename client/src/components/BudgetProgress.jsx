export default function BudgetProgress({ label, spent, limit, compact = false }) {
  const amount = Number(spent) || 0, cap = Number(limit) || 0;
  const percent = cap > 0 ? Math.round(amount / cap * 100) : 0;
  const tone = percent >= 100 ? 'danger' : percent >= 80 ? 'warning' : 'safe';
  return <div className={`budget-progress ${compact ? 'budget-compact' : ''}`}><div className="progress-heading"><span>{label}</span><strong className={tone === 'danger' ? 'danger-text' : tone === 'warning' ? 'warning-text' : ''}>{percent}%</strong></div><div className="progress-track"><span className={`progress-fill ${tone}`} style={{ width: `${Math.min(percent, 100)}%` }}/></div><div className="progress-meta"><span>₹{amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })} spent</span><span>{cap ? `₹${Math.max(0, cap - amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })} left` : 'No limit set'}</span></div>{percent >= 100 && <p className="budget-alert">Budget exceeded by ₹{(amount - cap).toLocaleString('en-IN', { maximumFractionDigits: 0 })}.</p>}{percent >= 80 && percent < 100 && <p className="budget-alert warning-alert">You’re getting close to this limit.</p>}</div>;
}
