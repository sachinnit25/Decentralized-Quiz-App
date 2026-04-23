import { useState } from 'react';
import { Wallet, LogOut, RefreshCcw, Send, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { connectWallet, getXLMBalance, sendXLM } from './services/stellarService';

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [txTarget, setTxTarget] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txStatus, setTxStatus] = useState<{ type: 'idle' | 'pending' | 'success' | 'error', message: string, hash?: string }>({ type: 'idle', message: '' });

  const handleConnect = async () => {
    try {
      setLoading(true);
      const pubKey = await connectWallet();
      setAddress(pubKey);
      await fetchBalance(pubKey);
    } catch (error: any) {
      setTxStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setBalance(null);
    setTxStatus({ type: 'idle', message: '' });
  };

  const fetchBalance = async (pubKey: string) => {
    const bal = await getXLMBalance(pubKey);
    setBalance(bal);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTarget || !txAmount) return;

    try {
      setTxStatus({ type: 'pending', message: 'Submitting transaction to Stellar Testnet...' });
      const result = await sendXLM(txTarget, txAmount);
      setTxStatus({ 
        type: 'success', 
        message: 'Transaction Successful!', 
        hash: result.hash 
      });
      if (address) await fetchBalance(address);
    } catch (error: any) {
      setTxStatus({ type: 'error', message: error.message || 'Transaction failed.' });
    }
  };

  return (
    <div className="container">
      {/* Header / Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.75rem' }}>
            <Wallet size={24} color="white" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>StellarQuiz</h1>
        </div>
        
        {address ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="status-badge status-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
              Connected: {address.slice(0, 4)}...{address.slice(-4)}
            </div>
            <button className="secondary" onClick={handleDisconnect} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Disconnect
            </button>
          </div>
        ) : (
          <button className="primary" onClick={handleConnect} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? <RefreshCcw size={16} className="animate-pulse" /> : <Wallet size={16} />} 
            Connect Freighter
          </button>
        )}
      </nav>

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>XLM Balance</h3>
            <button className="secondary" onClick={() => address && fetchBalance(address)} style={{ padding: '0.5rem' }}>
              <RefreshCcw size={16} />
            </button>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {balance ? Number(balance).toFixed(2) : '0.00'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>XLM</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Stellar Testnet Account</p>
        </motion.div>

        {/* Transaction Flow */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
        >
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Send XLM</h3>
          <form onSubmit={handleSend}>
            <div className="input-group">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Recipient Address</label>
              <input 
                placeholder="G..." 
                value={txTarget} 
                onChange={(e) => setTxTarget(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Amount</label>
              <input 
                type="number" 
                step="0.0000001" 
                placeholder="0.0" 
                value={txAmount} 
                onChange={(e) => setTxAmount(e.target.value)}
                required
              />
            </div>
            <button className="primary" type="submit" disabled={!address || txStatus.type === 'pending'} style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={16} /> Send Transaction
            </button>
          </form>
        </motion.div>
      </main>

      {/* Transaction Feedback Overlay */}
      <AnimatePresence>
        {txStatus.type !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card"
            style={{ 
              marginTop: '2rem', 
              borderLeft: `4px solid var(--${txStatus.type === 'success' ? 'success' : txStatus.type === 'error' ? 'error' : 'accent'})` 
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {txStatus.type === 'pending' && <RefreshCcw size={24} className="animate-pulse" color="var(--accent)" />}
              {txStatus.type === 'success' && <CheckCircle size={24} color="var(--success)" />}
              {txStatus.type === 'error' && <AlertCircle size={24} color="var(--error)" />}
              <div>
                <h4 style={{ margin: 0, textTransform: 'capitalize' }}>{txStatus.type}</h4>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-muted)' }}>{txStatus.message}</p>
                {txStatus.hash && (
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${txStatus.hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', marginTop: '0.5rem' }}
                  >
                    View on Explorer <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <button className="secondary" style={{ marginLeft: 'auto', padding: '0.25rem 0.5rem' }} onClick={() => setTxStatus({ type: 'idle', message: '' })}>Dismiss</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <footer style={{ marginTop: '5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        Built for Decentralized Quiz App on Stellar Testnet
      </footer>
    </div>
  );
}

export default App;
