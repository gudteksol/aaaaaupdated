import { Twitter, MessageCircle, Copy, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const CONTRACT_ADDRESS = 'Cf5Hb3cQ4KbhcG3hYWhit1Ttt6Jxd48WVvkotnv8pump';
  const [copied, setCopied] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT_ADDRESS}`);
        const data = await response.json();
        if (data.pairs && data.pairs.length > 0) {
          setTokenData(data.pairs[0]);
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: string | number) => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return '$0.00';
    if (numValue >= 1e9) return `$${(numValue / 1e9).toFixed(2)}B`;
    if (numValue >= 1e6) return `$${(numValue / 1e6).toFixed(2)}M`;
    if (numValue >= 1e3) return `$${(numValue / 1e3).toFixed(2)}K`;
    return `$${numValue.toFixed(2)}`;
  };

  const formatPrice = (price: string | number) => {
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(priceNum)) return '$0.00';
    if (priceNum < 0.000001) return `$${priceNum.toFixed(10)}`;
    if (priceNum < 0.01) return `$${priceNum.toFixed(6)}`;
    return `$${priceNum.toFixed(4)}`;
  };

  const safePercent = (val: any) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? 0 : num;
  };

  const tickerItems = tokenData ? [
    { label: 'PRICE', value: formatPrice(tokenData.priceUsd), change: `${safePercent(tokenData.priceChange?.h24) >= 0 ? '+' : ''}${safePercent(tokenData.priceChange?.h24).toFixed(2)}%` },
    { label: 'MARKET CAP', value: formatNumber(tokenData.marketCap || 0), change: `${safePercent(tokenData.priceChange?.h24) >= 0 ? '+' : ''}${safePercent(tokenData.priceChange?.h24).toFixed(2)}%` },
    { label: '24H VOLUME', value: formatNumber(tokenData.volume?.h24 || 0), change: `${safePercent(tokenData.volumeChange?.h24) >= 0 ? '+' : ''}${safePercent(tokenData.volumeChange?.h24).toFixed(2)}%` },
    { label: 'LIQUIDITY', value: formatNumber(tokenData.liquidity?.usd || 0), change: 'LOCKED' },
    { label: 'FDV', value: formatNumber(tokenData.fdv || 0), change: tokenData.pairCreatedAt ? `${Math.floor((Date.now() - tokenData.pairCreatedAt) / (1000 * 60 * 60 * 24))}d old` : '' },
    { label: 'TXNS 24H', value: `${tokenData.txns?.h24?.buys || 0}B / ${tokenData.txns?.h24?.sells || 0}S`, change: `${(tokenData.txns?.h24?.buys || 0) + (tokenData.txns?.h24?.sells || 0)} total` },
  ] : [
    { label: 'PRICE', value: 'Loading...', change: '-' },
    { label: 'MARKET CAP', value: 'Loading...', change: '-' },
    { label: '24H VOLUME', value: 'Loading...', change: '-' },
    { label: 'LIQUIDITY', value: 'Loading...', change: '-' },
    { label: 'FDV', value: 'Loading...', change: '-' },
    { label: 'TXNS 24H', value: 'Loading...', change: '-' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 w-full bg-black text-white py-3 z-50 overflow-hidden">
        <div className="flex animate-scroll">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex whitespace-nowrap">
              {tickerItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 mx-8">
                  <span className="font-bold text-[#00FF00]">{item.label}:</span>
                  <span className="font-semibold">{item.value}</span>
                  <span className={`text-sm ${item.change.startsWith('+') ? 'text-[#00FF00]' : item.change === 'LOCKED' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {item.change}
                  </span>
                  <span className="text-gray-500">•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed top-12 w-full bg-white/90 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-gray-100/50 flex items-center justify-center backdrop-blur-sm border border-gray-200/50 overflow-hidden">
              <img
                src="/mumu-the-bull-2-1024x752-1.jpg"
                alt="MUMU"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <a href="#gallery" className="text-sm font-medium hover:text-gray-600 transition-colors">GALLERY</a>
            <a href="#chart" className="text-sm font-medium hover:text-gray-600 transition-colors">CHART</a>
            <a href="https://x.com/i/communities/2012768514172768307" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-gray-600 transition-colors">COMMUNITY</a>
            <a href="https://knowyourmeme.com/memes/mumu" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-gray-600 transition-colors">KYM</a>
            <a href="https://pump.fun/coin/Cf5Hb3cQ4KbhcG3hYWhit1Ttt6Jxd48WVvkotnv8pump" target="_blank" rel="noopener noreferrer" className="bg-[#00FF00] text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-[#00DD00] transition-all">
              BUY $MUMU
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-44 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <section className="min-h-[80vh] flex flex-col items-center justify-center text-center">
            <h1 className="text-[180px] font-black leading-none mb-12">MUMU</h1>
            <a href="https://pump.fun/coin/Cf5Hb3cQ4KbhcG3hYWhit1Ttt6Jxd48WVvkotnv8pump" target="_blank" rel="noopener noreferrer" className="bg-[#00FF00] text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-[#00DD00] transition-all border-2 border-black">
              BUY $MUMU
            </a>
          </section>

          <section id="gallery" className="py-20">
            <div className="bg-gradient-to-b from-gray-50 to-white py-16">
              <div className="flex gap-12 justify-center items-center flex-wrap">
                <div className="group">
                  <div className="bg-white p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300" style={{boxShadow: '0 10px 40px rgba(0,0,0,0.15)'}}>
                    <div className="border-8 border-[#8B7355] p-4 bg-gradient-to-br from-amber-50 to-amber-100">
                      <img
                        src="/mumu_joker_pf.jpeg"
                        alt="MUMU Gallery 1"
                        className="w-80 h-80 object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-white p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300" style={{boxShadow: '0 10px 40px rgba(0,0,0,0.15)'}}>
                    <div className="border-8 border-[#8B7355] p-4 bg-gradient-to-br from-amber-50 to-amber-100">
                      <img
                        src="/mum_uqwefq.jpeg"
                        alt="MUMU Gallery 2"
                        className="w-80 h-80 object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-white p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300" style={{boxShadow: '0 10px 40px rgba(0,0,0,0.15)'}}>
                    <div className="border-8 border-[#8B7355] p-4 bg-gradient-to-br from-amber-50 to-amber-100">
                      <img
                        src="/mumu_pfpfpf.png"
                        alt="MUMU Gallery 3"
                        className="w-80 h-80 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="chart" className="py-20">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <iframe
                id="dexscreener-embed"
                src="https://dexscreener.com/solana/Cf5Hb3cQ4KbhcG3hYWhit1Ttt6Jxd48WVvkotnv8pump?embed=1&theme=light&trades=0&info=0"
                className="w-full h-[600px] rounded-lg"
              ></iframe>
            </div>
          </section>

          <section id="community" className="py-20 text-center">
            <h2 className="text-6xl font-black mb-16">JOIN THE COMMUNITY</h2>
            <div className="flex gap-6 justify-center items-center">
              <a href="https://x.com/Mumudotfun" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">
                <Twitter size={28} />
              </a>
              <a href="https://x.com/i/communities/2012768514172768307" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">
                <MessageCircle size={28} />
              </a>
              <button onClick={copyAddress} className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">
                <Copy size={28} />
              </button>
            </div>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-6 right-6 flex items-center gap-4 text-xs">
        <button onClick={copyAddress} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:scale-105 transition-transform">
          <Copy size={14} />
          {copied ? 'COPIED!' : 'COPY ADDRESS'}
        </button>
        <a href="https://x.com/Mumudotfun" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">
          <Twitter size={16} />
        </a>
        <a href="https://x.com/i/communities/2012768514172768307" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">
          <MessageCircle size={16} />
        </a>
      </footer>
    </div>
  );
}

export default App;
