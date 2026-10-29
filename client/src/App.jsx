import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, Menu, X, Leaf, CircleHelp } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import TransactionForm from './components/TransactionForm.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Budgets from './pages/Budgets.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const demoTransactions = [
 { _id:'demo-1', title:'Monthly stipend', amount:12000, category:'Salary', date:new Date().toISOString().slice(0,10), type:'income' },
 { _id:'demo-2', title:'Groceries & essentials', amount:1450, category:'Food', date:new Date().toISOString().slice(0,10), type:'expense' },
 { _id:'demo-3', title:'Metro and auto', amount:620, category:'Transport', date:new Date(Date.now()-86400000).toISOString().slice(0,10), type:'expense' },
 { _id:'demo-4', title:'Coffee with friends', amount:380, category:'Food', date:new Date(Date.now()-2*86400000).toISOString().slice(0,10), type:'expense' },
 { _id:'demo-5', title:'Course materials', amount:850, category:'Education', date:new Date(Date.now()-3*86400000).toISOString().slice(0,10), type:'expense' },
 { _id:'demo-6', title:'Streaming subscription', amount:299, category:'Entertainment', date:new Date(Date.now()-4*86400000).toISOString().slice(0,10), type:'expense' },
];
const defaultBudget = { monthlyLimit: 10000, categories: { Food:2500, Transport:1500, Shopping:1500, Bills:1000, Entertainment:800, Health:1000, Education:1500, Other:1000 } };
async function request(path, options = {}) {
 const response = await fetch(`${API}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
 const data = response.status === 204 ? null : await response.json().catch(() => ({}));
 if (!response.ok) throw new Error(data?.message || 'Request failed. Please try again.');
 return data;
}
export default function App() {
 const [active, setActive] = useState('dashboard');
 const [transactions, setTransactions] = useState([]);
 const [budget, setBudget] = useState(defaultBudget);
 const [formOpen, setFormOpen] = useState(false);
 const [editing, setEditing] = useState(null);
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [notice, setNotice] = useState('');
 const [backendOnline, setBackendOnline] = useState(false);
 const [demoMode, setDemoMode] = useState(false);
 const [loading, setLoading] = useState(true);
 const categoryBudgets = useMemo(() => budget.categories || {}, [budget]);
 const showNotice = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 3200); };
 const loadData = useCallback(async () => {
   setLoading(true);
   try {
     const [tx, savedBudgets] = await Promise.all([request('/transactions'), request('/budgets')]);
     setTransactions(tx); setBudget(savedBudgets || defaultBudget); setBackendOnline(true); setDemoMode(false);
   } catch (error) {
     setBackendOnline(false); setDemoMode(true); setTransactions(demoTransactions); setBudget(defaultBudget);
   } finally { setLoading(false); }
 }, []);
 useEffect(() => { loadData(); }, [loadData]);
 const openAdd = () => { setEditing(null); setFormOpen(true); };
 const openEdit = (item) => { if (String(item._id).startsWith('demo-')) { showNotice('Connect MongoDB and start the backend to edit saved records.'); return; } setEditing(item); setFormOpen(true); };
 const saveTransaction = async (values) => {
   if (demoMode) throw new Error('Start the backend and connect MongoDB to save transactions. Demo data is read-only until then.');
   const saved = editing ? await request(`/transactions/${editing._id}`, { method:'PUT', body:JSON.stringify(values) }) : await request('/transactions', { method:'POST', body:JSON.stringify(values) });
   setTransactions(old => editing ? old.map(t => t._id === saved._id ? saved : t) : [saved, ...old]);
   showNotice(editing ? 'Transaction updated.' : 'Transaction added.');
 };
 const deleteTransaction = async (id) => {
   if (!window.confirm('Delete this transaction? This cannot be undone.')) return;
   if (demoMode || String(id).startsWith('demo-')) { showNotice('Connect the backend to delete saved records.'); return; }
   try { await request(`/transactions/${id}`, { method:'DELETE' }); setTransactions(old=>old.filter(t=>t._id!==id)); showNotice('Transaction deleted.'); }
   catch(error) { showNotice(error.message); }
 };
 const saveBudget = async (values) => {
   if (demoMode) throw new Error('Start the backend and connect MongoDB to save your budget.');
   const saved = await request('/budgets', { method:'POST', body:JSON.stringify(values) }); setBudget(saved); showNotice('Budget saved.');
 };
 const navigate = (section) => { setActive(section); setSidebarOpen(false); };
 return <div className="app-shell"><div className={`mobile-scrim ${sidebarOpen?'visible':''}`} onClick={()=>setSidebarOpen(false)}/><div className={`sidebar-wrap ${sidebarOpen?'sidebar-open':''}`}><Navbar active={active} onNavigate={navigate}/><button className="mobile-close" onClick={()=>setSidebarOpen(false)} aria-label="Close navigation"><X size={20}/></button></div>
 <main className="main-area"><header className="topbar"><button className="mobile-menu" onClick={()=>setSidebarOpen(true)} aria-label="Open navigation"><Menu size={21}/></button><div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{active === 'dashboard' ? 'Dashboard' : active === 'transactions' ? 'Transactions' : 'Budgets'}</strong></div><div className="topbar-right"><span className={`connection-pill ${backendOnline?'connected':'offline'}`}><span/>{backendOnline?'MongoDB connected':'Demo preview'}</span><button className="topbar-icon" aria-label="Help" title="SpendWise mini-project"><CircleHelp size={18}/></button><div className="avatar">S</div></div></header>
 {demoMode && !loading && <div className="demo-banner"><span><Leaf size={16}/><strong>Preview mode</strong> — sample data is shown. Connect MongoDB and start the server to save your own transactions.</span><button onClick={loadData}>Retry connection</button></div>}
 {loading ? <div className="loading-state"><span className="loading-spinner"/><strong>Getting your finances ready…</strong></div> : active === 'dashboard' ? <Dashboard transactions={transactions} budget={budget} categoryBudgets={categoryBudgets} onAdd={openAdd} onEdit={openEdit} onDelete={deleteTransaction} onNavigate={navigate}/> : active === 'transactions' ? <Transactions transactions={transactions} onAdd={openAdd} onEdit={openEdit} onDelete={deleteTransaction}/> : <Budgets transactions={transactions} budget={budget} categoryBudgets={categoryBudgets} onSave={saveBudget}/>}
 </main>{formOpen && <TransactionForm initial={editing} onSave={saveTransaction} onClose={()=>{setFormOpen(false);setEditing(null);}}/>}{notice && <div className="toast"><span>✓</span>{notice}</div>}</div>;
}
