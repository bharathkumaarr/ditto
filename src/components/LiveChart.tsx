import { useState, useEffect } from 'react'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

import { TrendingUp, TrendingDown, RefreshCw, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import './LiveChart.css'

interface PriceData {
    time: string
    price: number
}

interface LiveChartProps {
    symbol: string
    name: string
    type: 'crypto' | 'stock'
}

// Map of supported symbols to CoinGecko IDs
const cryptoIdMap: Record<string, string> = {
    'btc': 'bitcoin',
    'bitcoin': 'bitcoin',
    'eth': 'ethereum',
    'ethereum': 'ethereum',
    'sol': 'solana',
    'solana': 'solana',
    'doge': 'dogecoin',
    'dogecoin': 'dogecoin',
    'bnb': 'binancecoin',
    'xrp': 'ripple',
    'ada': 'cardano',
    'dot': 'polkadot',
    'matic': 'matic-network',
    'polygon': 'matic-network',
    'avax': 'avalanche-2',
    'link': 'chainlink'
}

// Simulated stock data for S&P500, Dow Jones, etc.
const stockSimulatedData: Record<string, { basePrice: number, volatility: number }> = {
    'sp500': { basePrice: 5021.84, volatility: 0.003 },
    's&p500': { basePrice: 5021.84, volatility: 0.003 },
    's&p 500': { basePrice: 5021.84, volatility: 0.003 },
    'dow': { basePrice: 38671.69, volatility: 0.002 },
    'dowjones': { basePrice: 38671.69, volatility: 0.002 },
    'dow jones': { basePrice: 38671.69, volatility: 0.002 },
    'nasdaq': { basePrice: 15990.66, volatility: 0.004 },
    'aapl': { basePrice: 185.92, volatility: 0.02 },
    'apple': { basePrice: 185.92, volatility: 0.02 },
    'googl': { basePrice: 141.80, volatility: 0.018 },
    'google': { basePrice: 141.80, volatility: 0.018 },
    'msft': { basePrice: 404.87, volatility: 0.015 },
    'microsoft': { basePrice: 404.87, volatility: 0.015 },
    'tsla': { basePrice: 193.57, volatility: 0.035 },
    'tesla': { basePrice: 193.57, volatility: 0.035 }
}

function generateStockData(symbol: string): { data: PriceData[], currentPrice: number, change24h: number, high: number, low: number } {
    const config = stockSimulatedData[symbol.toLowerCase()] || { basePrice: 100, volatility: 0.02 }
    const data: PriceData[] = []
    let price = config.basePrice * (0.98 + Math.random() * 0.04) // Start within 2% of base
    let high = price
    let low = price
    const startPrice = price

    for (let i = 23; i >= 0; i--) {
        const change = (Math.random() - 0.48) * config.volatility * price // Slight upward bias
        price = Math.max(price + change, price * 0.9)
        high = Math.max(high, price)
        low = Math.min(low, price)
        data.push({
            time: `${i}h ago`,
            price: Math.round(price * 100) / 100
        })
    }

    const currentPrice = price
    const change24h = ((currentPrice - startPrice) / startPrice) * 100

    return { data, currentPrice, change24h: Math.round(change24h * 100) / 100, high, low }
}

export function LiveChart({ symbol, name, type }: LiveChartProps) {
    const [data, setData] = useState<PriceData[]>([])
    const [currentPrice, setCurrentPrice] = useState<number | null>(null)
    const [change24h, setChange24h] = useState<number | null>(null)
    const [high24h, setHigh24h] = useState<number | null>(null)
    const [low24h, setLow24h] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const fetchCryptoData = async () => {
        const coinId = cryptoIdMap[symbol.toLowerCase()] || symbol.toLowerCase()

        try {
            // Fetch current price and 24h data
            const priceResponse = await fetch(
                `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
            )

            if (!priceResponse.ok) {
                throw new Error('Failed to fetch price data')
            }

            const priceData = await priceResponse.json()

            // Fetch historical data for chart (24 hours)
            const chartResponse = await fetch(
                `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`
            )

            if (!chartResponse.ok) {
                throw new Error('Failed to fetch chart data')
            }

            const chartData = await chartResponse.json()

            // Process chart data - take every 12th point for ~24 points
            const prices = chartData.prices
            const step = Math.floor(prices.length / 24) || 1
            const processedData: PriceData[] = []

            for (let i = 0; i < prices.length; i += step) {
                const [timestamp, price] = prices[i]
                const date = new Date(timestamp)
                processedData.push({
                    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    price: Math.round(price * 100) / 100
                })
            }

            setData(processedData)
            setCurrentPrice(priceData.market_data.current_price.usd)
            setChange24h(priceData.market_data.price_change_percentage_24h)
            setHigh24h(priceData.market_data.high_24h.usd)
            setLow24h(priceData.market_data.low_24h.usd)
            setLastUpdated(new Date())
            setError(null)
        } catch (err) {
            console.error('Error fetching crypto data:', err)
            setError('Failed to fetch data. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const fetchStockData = () => {
        // Use simulated data for stocks
        const stockData = generateStockData(symbol)
        setData(stockData.data)
        setCurrentPrice(stockData.currentPrice)
        setChange24h(stockData.change24h)
        setHigh24h(stockData.high)
        setLow24h(stockData.low)
        setLastUpdated(new Date())
        setLoading(false)
    }

    const fetchData = () => {
        setLoading(true)
        if (type === 'crypto') {
            fetchCryptoData()
        } else {
            fetchStockData()
        }
    }

    useEffect(() => {
        fetchData()
        // Auto-refresh every 60 seconds
        const interval = setInterval(fetchData, 60000)
        return () => clearInterval(interval)
    }, [symbol, type])

    const isPositiveChange = (change24h ?? 0) >= 0
    const chartColor = isPositiveChange ? '#22c55e' : '#ef4444'
    const chartGradientId = `gradient-${symbol.replace(/[^a-zA-Z0-9]/g, '')}`

    const formatPrice = (price: number) => {
        if (price >= 1000) {
            return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
        return `$${price.toFixed(price < 1 ? 6 : 2)}`
    }

    return (
        <motion.div
            className="live-chart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="live-chart-header">
                <div className="chart-title-section">
                    <div className="chart-icon">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h2 className="chart-name">{name}</h2>
                        <span className="chart-symbol">{symbol.toUpperCase()}</span>
                    </div>
                </div>
                <button
                    className={`refresh-btn ${loading ? 'spinning' : ''}`}
                    onClick={fetchData}
                    disabled={loading}
                    aria-label="Refresh data"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {error ? (
                <div className="chart-error">
                    <p>{error}</p>
                    <button onClick={fetchData}>Retry</button>
                </div>
            ) : loading && !currentPrice ? (
                <div className="chart-loading">
                    <div className="loading-spinner" />
                    <p>Loading live data...</p>
                </div>
            ) : (
                <>
                    <div className="price-section">
                        <div className="current-price">
                            {currentPrice && formatPrice(currentPrice)}
                        </div>
                        <div className={`price-change ${isPositiveChange ? 'positive' : 'negative'}`}>
                            {isPositiveChange ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            <span>{Math.abs(change24h ?? 0).toFixed(2)}%</span>
                            <span className="change-period">24h</span>
                        </div>
                    </div>

                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                                        <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="time"
                                    stroke="#666"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    stroke="#666"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['dataMin', 'dataMax']}
                                    tickFormatter={(value) => value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value.toFixed(0)}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(0,0,0,0.9)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                    formatter={(value) => value != null ? [formatPrice(Number(value)), 'Price'] : ['--', 'Price']}
                                    labelStyle={{ color: '#888' }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={chartColor}
                                    strokeWidth={2}
                                    fill={`url(#${chartGradientId})`}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="stats-row">
                        <div className="stat">
                            <span className="stat-label">24h High</span>
                            <span className="stat-value high">{high24h && formatPrice(high24h)}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">24h Low</span>
                            <span className="stat-value low">{low24h && formatPrice(low24h)}</span>
                        </div>
                    </div>

                    {lastUpdated && (
                        <div className="last-updated">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                            {type === 'stock' && <span className="simulated-badge">Simulated</span>}
                        </div>
                    )}
                </>
            )}
        </motion.div>
    )
}
