import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../AuthContext';
import { Link, Navigate } from 'react-router-dom';

const Portfolio = () => {
    const { user, token } = useContext(AuthContext);
    const [holdings, setHoldings] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [liveBalance, setLiveBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newListName, setNewListName] = useState("");

    const fetchPortfolioData = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [summaryRes, watchlistRes] = await Promise.all([
                // fetch('http://127.0.0.1:8000/api/portfolio/summary/', {
                //     headers: { 'Authorization': `Bearer ${token}` }
                // }),
                fetch('https://smap-backend-yrlx.onrender.com/api/portfolio/summary/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                // fetch('http://127.0.0.1:8000/api/portfolio/watchlist/', {
                //     headers: { 'Authorization': `Bearer ${token}` }
                // }),
                fetch('https://smap-backend-yrlx.onrender.com/api/portfolio/watchlist/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                // fetch('http://127.0.0.1:8000/api/portfolio/wallet/', { 
                //     headers: { 'Authorization': `Bearer ${token}` } 
                // }),
                fetch('https://smap-backend-yrlx.onrender.com/api/portfolio/wallet/', { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                })
            ]);

            if (!summaryRes.ok || !watchlistRes.ok) {
                throw new Error("Failed to fetch portfolio data.");
            }

            const summaryData = await summaryRes.json();
            const watchlistData = await watchlistRes.json();

            setHoldings(summaryData.data || []);
            setWatchlist(watchlistData.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPortfolioData();
    }, [fetchPortfolioData]);

    // Security Check: Kick unauthenticated users back to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-main)' }}>Loading your assets...</div>;
    }

    // Calculate dynamic total net worth based on live API prices
    const totalInvestedValue = holdings.reduce((sum, item) => sum + item.current_value, 0);
    const netWorth = (user?.balance || 0) + totalInvestedValue;
    const profitAmount = netWorth - 100000;
    const totalNetProfit = holdings.reduce((sum, item) => sum + (item.net_profit || 0), 0);

    const createNewWatchlist = async (e) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        try {
            // const response = await fetch('http://127.0.0.1:8000/api/portfolio/watchlist/', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            //     body: JSON.stringify({ action: 'create_group', name: newListName })
            // });
            const response = await fetch('https://smap-backend-yrlx.onrender.com/api/portfolio/watchlist/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action: 'create_group', name: newListName })
            });
            if (response.ok) {
                setNewListName('');
                await fetchPortfolioData();
            }
        } catch (error) { console.error(error); }
    };

    // ➕ Adds a stock to a specific folder right from the dashboard
    const addStockToGroup = async (e, groupId) => {
        e.preventDefault();
        const symbol = e.target.symbol.value.trim().toUpperCase();
        if (!symbol) return;
        try {
            // const response = await fetch('http://127.0.0.1:8000/api/portfolio/watchlist/', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            //     body: JSON.stringify({ action: 'add_stock', group_id: groupId, symbol: symbol })
            // });
            const response = await fetch('https://smap-backend-yrlx.onrender.com/api/portfolio/watchlist/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action: 'add_stock', group_id: groupId, symbol: symbol })
            });
            if (response.ok) {
                e.target.reset();
                await fetchPortfolioData();
            }
        } catch (error) { console.error(error); }
    };

    // 🗑️ Deletes an entire watchlist folder
    const deleteWatchlist = async (groupId) => {
        try {
            // const response = await fetch('http://127.0.0.1:8000/api/portfolio/watchlist/', {
            //     method: 'DELETE',
            //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            //     body: JSON.stringify({ action: 'delete_group', group_id: groupId })
            // });
            const response = await fetch('https://smap-backend-yrlx.onrender.com/api/portfolio/watchlist/', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action: 'delete_group', group_id: groupId })
            });
            if (response.ok) {
                await fetchPortfolioData();
            }
        } catch (error) { console.error(error); }
    };

    // 🗑️ Removes a single stock from a folder
    const removeStock = async (itemId) => {
        try {
            // const response = await fetch('http://127.0.0.1:8000/api/portfolio/watchlist/', {
            //     method: 'DELETE',
            //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            //     body: JSON.stringify({ action: 'remove_stock', item_id: itemId })
            // });
            const response = await fetch('https://smap-backend-yrlx.onrender.com/api/portfolio/watchlist/', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action: 'remove_stock', item_id: itemId })
            });
            if (response.ok) {
                await fetchPortfolioData();
            }
        } catch (error) { console.error(error); }
    };
    
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            
            {/* Header Section */}
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <h1 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>{user.username}'s Portfolio</h1>
                <div style={{ display: 'flex', gap: '30px' }}>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Purchasing Power</p>
                        <h2 style={{ margin: 0, color: '#10b981' }}>
                            ${(user.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        
                    </div>
                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Total Net Worth</p>
                        <h2 style={{ margin: 0, color: 'var(--text-main)' }}>${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    </div>

                    <div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Net Profit</p>
                        <h2 style={{ margin: 0, color: totalNetProfit >= 0 ? '#10b981' : '#ef4444' }}>
                            {totalNetProfit >= 0 ? '+' : '-'}${Math.abs(totalNetProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Active Holdings Table */}
            <h2 style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Active Holdings</h2>
            {holdings.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No active trades found. Visit the market to buy some stock!</p>
            ) : (
                <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-main)' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                <th style={{ padding: '12px' }}>Asset</th>
                                <th style={{ padding: '12px' }}>Shares</th>
                                <th style={{ padding: '12px' }}>Average Buy Price</th>
                                <th style={{ padding: '12px' }}>Total Cost</th>
                                <th style={{ padding: '12px' }}>Current Price</th>
                                <th style={{ padding: '12px' }}>Total Value</th>
                                <th style={{ padding: '12px' }}>Net Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                                        <Link to={`/stock/${item.symbol}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {item.symbol}
                                        </Link>
                                    </td>
                                    <td>{item.net_shares}</td>
                                    
                                    {/* 🚨 NEW: Average Execution Price */}
                                    <td>${item.avg_buy_price.toFixed(2)}</td>
                                    
                                    {/* 🚨 NEW: Total money spent on these shares */}
                                    <td>${item.total_cost.toFixed(2)}</td>
                                    
                                    <td>${item.current_price.toFixed(2)}</td>
                                    <td>${item.current_value.toFixed(2)}</td>
                                    
                                    {/* 🚨 NEW: Individual Stock Profit (Green for positive, Red for negative) */}
                                    <td style={{ color: item.net_profit >= 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                        {item.net_profit >= 0 ? '+' : ''}${item.net_profit.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Watchlist Section */}
            {/* --- CUSTOM WATCHLISTS SECTION --- */}
            <div style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>My Watchlists</h2>
                    
                    {/* The Input to Create a New List */}
                    <form onSubmit={createNewWatchlist} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            placeholder="New List Name (e.g. Tech)" 
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        />
                        <button type="submit" style={{ padding: '8px 16px', background: '#3b82f6', color: 'var(--text-main)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            + Create
                        </button>
                    </form>
                </div>

                {/* Map through the Folders */}
                {watchlist.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>You don't have any watchlists yet. Create one above!</p>
                ) : (
                    watchlist.map((group, index) => (
                        <div key={index} style={{ marginBottom: '30px', background: 'var(--bg-card)', padding: '20px', borderRadius: '8px' }}>
                            
                            {/* Folder Header with Delete Button */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                                <h3 style={{ marginTop: 0, color: '#e2e8f0' }}>{group.name}</h3>
                                <button onClick={() => deleteWatchlist(group.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                                     Delete List
                                </button>
                            </div>

                            {/* Add Stock Form - Directly inside the folder! */}
                            <form onSubmit={(e) => addStockToGroup(e, group.id)} style={{ display: 'flex', gap: '10px', marginTop: '15px', marginBottom: '15px' }}>
                                <input name="symbol" type="text" placeholder="Stock Symbol (e.g. AAPL)" style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }} />
                                <button type="submit" style={{ padding: '6px 12px', background: 'transparent', color: 'var(--text-main)', border: 'true', borderRadius: '4px', cursor: 'pointer' }}>+ Add Stock</button>
                            </form>
                            
                            {group.items.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No stocks in this list yet.</p>
                            ) : (
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ color: 'var(--text-secondary)', fontSize: '14px', borderBottom: '1px solid var(--border-color)' }}>
                                            <th style={{ paddingBottom: '10px' }}>Asset</th>
                                            <th style={{ paddingBottom: '10px' }}>Company</th>
                                            <th style={{ paddingBottom: '10px' }}>Live Price</th>
                                            <th style={{ paddingBottom: '10px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Map through the Stocks */}
                                        {group.items.map((item, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '15px 0', color: '#3b82f6', fontWeight: 'bold' }}>
                                                    <Link to={`/stock/${item.symbol}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        {item.symbol}
                                                    </Link>
                                                </td>
                                                <td style={{ padding: '15px 0' }}>{item.company_name}</td>
                                                <td style={{ padding: '15px 0', fontWeight: 'bold' }}>${item.current_price.toFixed(2)}</td>
                                                <td style={{ padding: '15px 0' }}>
                                                    <button onClick={() => removeStock(item.item_id)} style={{ background: '#ef4444', color: 'var(--text-main)', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))
                )}
            </div>
            
        </div>
    );
};

export default Portfolio;