import { useState, useEffect } from 'react';
import { Award, LogOut } from 'lucide-react';
import { 
  connectWallet, 
  getXLMBalance, 
  sendXLMTransaction,
  WalletError,
  TransactionError
} from './services/stellarService';

function App() {
  const [address, setAddress] = useState<any>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<{ type: 'idle' | 'pending' | 'success' | 'error', message: string, hash?: string }>({ type: 'idle', message: '' });
  const [activeTab, setActiveTab] = useState<'play' | 'create'>('play');

  useEffect(() => {
    if (address) {
      fetchData();
    }
  }, [address]);

  const fetchData = async () => {
    if (!address) return;
    try {
        const addrString = typeof address === 'string' ? address : address.address || address.toString();
        const bal = await getXLMBalance(addrString);
        setBalance(bal || "0");
    } catch (e) {
        console.error("Failed to fetch balance", e);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      setTxStatus({ type: 'idle', message: '' });
      const pubKey = await connectWallet();
      console.log("Connected address:", pubKey);
      setAddress(pubKey);
    } catch (error: any) {
      console.error(error);
      setTxStatus({ type: 'error', message: error.message || 'Connection failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setBalance(null);
    setTxStatus({ type: 'idle', message: '' });
  };

  const handleTestTransfer = async () => {
    if (!address) return;
    try {
      const addrString = typeof address === 'string' ? address : address.address || address.toString();
      setTxStatus({ type: 'pending', message: 'Sending 0.1 XLM to yourself...' });
      const response = await sendXLMTransaction(addrString, "0.1");
      setTxStatus({ 
        type: 'success', 
        message: 'Transaction successful!',
        hash: response.hash
      });
      fetchData();
    } catch (error: any) {
      setTxStatus({ type: 'error', message: error.message || 'Transfer failed' });
    }
  };

  // Safe display address
  const displayAddress = () => {
    if (!address) return "";
    const str = typeof address === 'string' ? address : address.address || address.toString() || "";
    if (str.length < 12) return str;
    return `${str.slice(0, 6)}...${str.slice(-6)}`;
  };

  return (
    <div className="container" style={{ minHeight: '100vh', background: '#09090b', color: 'white' }}>
      {/* Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', padding: '1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Award size={32} color="#7c3aed" />
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Stellar Quiz</h1>
        </div>
        
        {address ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#4ade80', fontSize: '0.9rem', fontWeight: 'bold', background: 'rgba(74, 222, 128, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem' }}>
              {displayAddress()}
            </span>
            <button className="secondary" onClick={handleDisconnect} style={{ padding: '0.5rem', background: '#27272a', border: 'none', color: 'white', borderRadius: '0.5rem' }}>
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button className="primary" onClick={handleConnect} disabled={loading} style={{ background: '#7c3aed', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold' }}>
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </nav>

      <main>
        {address ? (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div className="glass-card" style={{ background: '#18181b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #27272a' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button style={{ background: activeTab === 'play' ? '#7c3aed' : '#27272a', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem' }} onClick={() => setActiveTab('play')}>Play</button>
                    <button style={{ background: activeTab === 'create' ? '#7c3aed' : '#27272a', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem' }} onClick={() => setActiveTab('create')}>Create</button>
                </div>

                {activeTab === 'play' ? (
                    <div>
                        <h2>Available Quizzes</h2>
                        <div style={{ padding: '1.5rem', background: '#09090b', borderRadius: '0.5rem', border: '1px solid #27272a' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>Stellar Basics</h3>
                            <p style={{ color: '#a1a1aa' }}>Learn the fundamentals of the network.</p>
                            <button style={{ background: '#27272a', color: 'white', border: '1px solid #3f3f46', padding: '0.5rem 1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>Start Quiz</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2>Admin Panel</h2>
                        <input placeholder="Enter a question..." style={{ width: '100%', padding: '0.75rem', background: '#09090b', border: '1px solid #27272a', borderRadius: '0.5rem', color: 'white', marginBottom: '1rem' }} />
                        <button style={{ width: '100%', background: '#7c3aed', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>Create Quiz</button>
                    </div>
                )}
            </div>

            <div className="glass-card" style={{ background: '#18181b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #27272a', height: 'fit-content' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#a1a1aa', fontSize: '0.8rem' }}>YOUR ACCOUNT</h3>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{balance || '0.00'} XLM</div>
                    <div style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>Testnet Balance</div>
                </div>
                
                <div style={{ borderTop: '1px solid #27272a', paddingTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '1rem' }}>LEVEL 1 TASKS</p>
                    <button onClick={handleTestTransfer} disabled={txStatus.type === 'pending'} style={{ width: '100%', background: '#7c3aed', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>
                        {txStatus.type === 'pending' ? 'Processing...' : 'Send Test XLM (0.1)'}
                    </button>
                </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Decentralized Learning</h2>
            <p style={{ color: '#a1a1aa', maxWidth: '500px', margin: '0 auto 2rem' }}>Connect your wallet to participate in on-chain quizzes and earn points.</p>
            <button onClick={handleConnect} style={{ background: '#7c3aed', color: 'white', padding: '1rem 2rem', border: 'none', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>Get Started</button>
          </div>
        )}
      </main>

      {txStatus.type !== 'idle' && (
        <div style={{ 
          position: 'fixed', bottom: '2rem', right: '2rem', 
          background: '#18181b', border: `1px solid ${txStatus.type === 'error' ? '#ef4444' : '#22c55e'}`,
          padding: '1.5rem', borderRadius: '0.75rem', color: 'white', width: '320px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>{txStatus.type === 'error' ? 'Transaction Failed' : 'Transaction Success'}</h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#a1a1aa' }}>{txStatus.message}</p>
          {txStatus.hash && (
            <a href={`https://stellar.expert/explorer/testnet/tx/${txStatus.hash}`} target="_blank" style={{ color: '#7c3aed', fontSize: '0.8rem', textDecoration: 'none' }}>View on Explorer →</a>
          )}
          <button onClick={() => setTxStatus({ type: 'idle', message: '' })} style={{ background: 'none', color: '#a1a1aa', border: 'none', position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </div>
  );
}

export default App;
