import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({ title: '', amount: '', category: 'Food', date: today(), type: 'expense' });
export default function TransactionForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(blank());
  const [error, setError] = useState('');
  useEffect(() => { setForm(initial ? { ...initial, amount: String(initial.amount) } : blank()); setError(''); }, [initial]);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => { e.preventDefault(); if (!form.title.trim() || Number(form.amount) <= 0 || !form.date) { setError('Enter a title, a positive amount and a date.'); return; } try { await onSave({ ...form, title: form.title.trim(), amount: Number(form.amount) }); onClose(); } catch (err) { setError(err.message || 'Could not save transaction.'); } };
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><div className="modal-heading"><div><p className="eyebrow">YOUR MONEY, YOUR WAY</p><h2 id="form-title">{initial ? 'Edit transaction' : 'Add transaction'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20}/></button></div>
    <form onSubmit={submit} className="transaction-form"><div className="type-switch"><button type="button" className={form.type === 'expense' ? 'selected expense-selected' : ''} onClick={() => setForm({ ...form, type: 'expense' })}>Expense</button><button type="button" className={form.type === 'income' ? 'selected income-selected' : ''} onClick={() => setForm({ ...form, type: 'income' })}>Income</button></div>
    <label>Transaction title<input name="title" value={form.title} onChange={change} placeholder="e.g. Lunch with friends" maxLength="80" autoFocus/></label>
    <label>Amount (₹)<input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={change} placeholder="0.00"/></label>
    <div className="form-two"><label>Category<select name="category" value={form.category} onChange={change}>{['Food','Transport','Shopping','Bills','Entertainment','Health','Education','Salary','Other'].map(c => <option key={c}>{c}</option>)}</select></label><label>Date<input name="date" type="date" value={form.date} onChange={change}/></label></div>
    {error && <p className="form-error">{error}</p>}<div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button type="submit" className="button primary">{initial ? 'Save changes' : 'Add transaction'}</button></div></form></section></div>;
}
