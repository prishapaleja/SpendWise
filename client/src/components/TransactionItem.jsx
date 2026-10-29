import { ArrowDownLeft, ArrowUpRight, MoreHorizontal } from 'lucide-react';
const categoryIcons = { Food: '🍽️', Transport: '🚕', Shopping: '🛍️', Bills: '⚡', Entertainment: '🎬', Health: '🩺', Education: '📚', Salary: '💼', Other: '✳️' };
export default function TransactionItem({ transaction, onEdit, onDelete, compact = false }) {
  const income = transaction.type === 'income';
  return <div className={`transaction-row ${compact ? 'compact' : ''}`}>
    <div className={`category-icon ${income ? 'income-bg' : ''}`}>{categoryIcons[transaction.category] || '✳️'}</div>
    <div className="transaction-main"><strong>{transaction.title}</strong><span>{transaction.category} · {new Date(`${transaction.date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div>
    <strong className={`transaction-amount ${income ? 'positive' : ''}`}>{income ? '+' : '−'}₹{Number(transaction.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>
    {!compact && <div className="row-actions"><button aria-label="Edit transaction" onClick={() => onEdit(transaction)}><MoreHorizontal size={19}/></button><div className="action-menu"><button onClick={() => onEdit(transaction)}>Edit</button><button className="delete-action" onClick={() => onDelete(transaction._id)}>Delete</button></div></div>}
  </div>;
}
