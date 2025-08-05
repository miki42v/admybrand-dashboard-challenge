import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ChevronsRight, Download, Moon, Sun, Bot, User, Filter, Calendar, Search, Sparkles, X, ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight as ChevronRightIcon } from 'lucide-react';

// --- MOCK DATA ---
const initialData = [
    { date: '2023-10-01', campaign: 'Fall Sale 2023', impressions: 45000, clicks: 2250, cost: 1125, conversions: 112 },
    { date: '2023-10-02', campaign: 'Fall Sale 2023', impressions: 48000, clicks: 2400, cost: 1200, conversions: 120 },
    { date: '2023-10-03', campaign: 'Q4 Brand Awareness', impressions: 75000, clicks: 1500, cost: 900, conversions: 30 },
    { date: '2023-10-04', campaign: 'Fall Sale 2023', impressions: 52000, clicks: 2860, cost: 1430, conversions: 150 },
    { date: '2023-10-05', campaign: 'Holiday Promo Teaser', impressions: 60000, clicks: 3300, cost: 1650, conversions: 180 },
    { date: '2023-10-06', campaign: 'Q4 Brand Awareness', impressions: 80000, clicks: 1680, cost: 1008, conversions: 35 },
    { date: '2023-10-07', campaign: 'Holiday Promo Teaser', impressions: 65000, clicks: 3900, cost: 1950, conversions: 215 },
    { date: '2023-10-08', campaign: 'Fall Sale 2023', impressions: 49000, clicks: 2695, cost: 1347, conversions: 145 },
    { date: '2023-10-09', campaign: 'Q4 Brand Awareness', impressions: 82000, clicks: 1722, cost: 1033, conversions: 40 },
    { date: '2023-10-10', campaign: 'Holiday Promo Teaser', impressions: 71000, clicks: 4260, cost: 2130, conversions: 250 },
    { date: '2023-10-11', campaign: 'Fall Sale 2023', impressions: 53000, clicks: 3045, cost: 1522, conversions: 165 },
    { date: '2023-10-12', campaign: 'Q4 Brand Awareness', impressions: 85000, clicks: 1870, cost: 1122, conversions: 42 },
    { date: '2023-10-13', campaign: 'Holiday Promo Teaser', impressions: 78000, clicks: 4680, cost: 2340, conversions: 280 },
    { date: '2023-10-14', campaign: 'Fall Sale 2023', impressions: 55000, clicks: 3300, cost: 1650, conversions: 180 },
    { date: '2023-10-15', campaign: 'Q4 Brand Awareness', impressions: 90000, clicks: 2000, cost: 1200, conversions: 50 },
    { date: '2023-10-16', campaign: 'Black Friday Early Access', impressions: 120000, clicks: 9600, cost: 4800, conversions: 500 },
    { date: '2023-10-17', campaign: 'Black Friday Early Access', impressions: 135000, clicks: 11475, cost: 5737, conversions: 610 },
    { date: '2023-10-18', campaign: 'Holiday Promo Teaser', impressions: 82000, clicks: 5330, cost: 2665, conversions: 310 },
    { date: '2023-10-19', campaign: 'Fall Sale 2023', impressions: 58000, clicks: 3770, cost: 1885, conversions: 200 },
    { date: '2023-10-20', campaign: 'Q4 Brand Awareness', impressions: 95000, clicks: 2280, cost: 1368, conversions: 60 },
];

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

// --- REUSABLE UI COMPONENTS ---

const KpiCard = ({ title, value, change, description, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
        <div>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="mt-4">
            <p className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{description}</p>
        </div>
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                <p className="label font-bold text-gray-800 dark:text-gray-100">{label}</p>
                {payload.map((pld, index) => (
                    <p key={index} style={{ color: pld.fill || pld.stroke }} className="intro">{`${pld.name}: ${pld.name === 'cost' ? formatCurrency(pld.value) : formatNumber(pld.value)}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const SkeletonLoader = ({ className }) => <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ${className}`}></div>;

// --- MAIN APP COMPONENT ---
export default function App() {
    // Core State
    const [theme, setTheme] = useState('light');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Modal State
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
    const [insightsContent, setInsightsContent] = useState('');
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

    // Filters State
    const [dateRange, setDateRange] = useState({ start: '2023-10-01', end: '2023-10-20' });
    const [selectedCampaign, setSelectedCampaign] = useState('All');

    // Table State
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    // --- SIDE EFFECTS ---
    useEffect(() => {
        // Initial data load simulation
        setIsLoading(true);
        setTimeout(() => {
            setData(initialData);
            setIsLoading(false);
        }, 1500);
    }, []);

    useEffect(() => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [theme]);

    // Simulate real-time data updates
    useEffect(() => {
        if (isLoading) return; // Don't run on initial load
        const interval = setInterval(() => {
            setData(prevData =>
                prevData.map(item => ({
                    ...item,
                    impressions: item.impressions + Math.floor(Math.random() * 500 - 200),
                    clicks: item.clicks + Math.floor(Math.random() * 50 - 25),
                }))
            );
        }, 5000);
        return () => clearInterval(interval);
    }, [isLoading]);

    // --- DATA PROCESSING & MEMOIZATION ---
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const itemDate = new Date(item.date);
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            const isDateInRange = itemDate >= startDate && itemDate <= endDate;
            const isCampaignMatch = selectedCampaign === 'All' || item.campaign === selectedCampaign;
            return isDateInRange && isCampaignMatch;
        });
    }, [data, dateRange, selectedCampaign]);

    const sortedAndPaginatedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortableItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredData, sortConfig, currentPage]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const campaignOptions = useMemo(() => ['All', ...new Set(initialData.map(item => item.campaign))], []);

    const kpiCalculations = useMemo(() => {
        if (filteredData.length === 0) return { totalClicks: '0', ctr: '0.00%', cpa: formatCurrency(0), roas: '0.00x' };
        const totalImpressions = filteredData.reduce((sum, item) => sum + item.impressions, 0);
        const totalClicks = filteredData.reduce((sum, item) => sum + item.clicks, 0);
        const totalCost = filteredData.reduce((sum, item) => sum + item.cost, 0);
        const totalConversions = filteredData.reduce((sum, item) => sum + item.conversions, 0);
        const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
        const cpa = totalConversions > 0 ? totalCost / totalConversions : 0;
        const roas = totalCost > 0 ? (totalConversions * 50) / totalCost : 0; // Assuming $50 value per conversion
        return { totalClicks: formatNumber(totalClicks), ctr: `${ctr.toFixed(2)}%`, cpa: formatCurrency(cpa), roas: `${roas.toFixed(2)}x` };
    }, [filteredData]);
    
    const campaignPerformance = useMemo(() => {
        const performance = {};
        filteredData.forEach(item => {
            if (!performance[item.campaign]) performance[item.campaign] = { clicks: 0, cost: 0, conversions: 0 };
            performance[item.campaign].clicks += item.clicks;
            performance[item.campaign].cost += item.cost;
            performance[item.campaign].conversions += item.conversions;
        });
        return Object.entries(performance).map(([name, values]) => ({ name, ...values }));
    }, [filteredData]);

    const costDistribution = useMemo(() => campaignPerformance.map(c => ({ name: c.name, value: c.cost })), [campaignPerformance]);
    const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f97316'];

    // --- EVENT HANDLERS ---
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handleExport = () => {
        const headers = "Date,Campaign,Impressions,Clicks,Cost,Conversions\n";
        const csvContent = filteredData.map(d => Object.values(d).join(",")).join("\n");
        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "admybrand_insights_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleGenerateInsights = async () => {
        if (filteredData.length === 0) {
            setInsightsContent("There is no data to analyze for the selected filters.");
            setIsInsightsModalOpen(true);
            return;
        }
        setIsGeneratingInsights(true);
        setIsInsightsModalOpen(true);
        setInsightsContent('');
        const prompt = `Analyze the following marketing campaign data and provide a concise summary of key insights. Format the output using markdown. Include: 1. A brief overview. 2. 2-3 positive highlights. 3. 1-2 areas for improvement. 4. One actionable recommendation. Data: ${JSON.stringify(filteredData, null, 2)}`;
        try {
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) setInsightsContent(result.candidates[0].content.parts[0].text);
            else throw new Error("No content received from API.");
        } catch (error) {
            console.error("Error generating insights:", error);
            setInsightsContent("Sorry, I was unable to generate insights. Please check your API key and try again.");
        } finally {
            setIsGeneratingInsights(false);
        }
    };

    // --- RENDER METHOD ---
    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
            <div className="flex min-h-screen">
                <aside className={`bg-white dark:bg-gray-800/50 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700/50 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                    <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200 dark:border-gray-700/50">
                        <h1 className={`font-bold text-xl text-blue-600 dark:text-blue-400 transition-opacity duration-200 ${!sidebarOpen && 'opacity-0'}`}>ADmyBRAND</h1>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronsRight className={`transform transition-transform duration-300 ${sidebarOpen && 'rotate-180'}`} /></button>
                    </div>
                </aside>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, here's your campaign overview.</p>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4 mt-4 sm:mt-0">
                            <button onClick={handleGenerateInsights} className="flex items-center space-x-2 px-3 py-3 bg-blue-500 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg hover:bg-blue-600 transition-all"><Sparkles className="w-4 h-4" /><span className="hidden sm:inline">✨ Generate Insights</span></button>
                            <button onClick={toggleTheme} className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">{theme === 'light' ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-yellow-400" />}</button>
                            <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-gray-800 text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-shadow"><Download className="w-4 h-4" /><span className="hidden sm:inline">Export</span></button>
                        </div>
                    </header>

                    <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Filter className="w-5 h-5" /><span className="font-semibold">Filters:</span></div>
                        <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-400" /><input type="date" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-sm" /><span>-</span><input type="date" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-sm" /></div>
                        <div className="flex items-center gap-2"><Search className="w-5 h-5 text-gray-400" /><select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-sm w-48">{campaignOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                    </div>

                    {isLoading ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-40" />)}
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <SkeletonLoader className="lg:col-span-2 h-[422px]" />
                                <SkeletonLoader className="h-[422px]" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <KpiCard title="Total Clicks" value={kpiCalculations.totalClicks} change="+5.4%" description="vs. previous period" icon={ChevronsRight} color="text-blue-500" />
                                <KpiCard title="Click-Through Rate (CTR)" value={kpiCalculations.ctr} change="-1.2%" description="vs. previous period" icon={ChevronsRight} color="text-purple-500" />
                                <KpiCard title="Cost Per Acquisition (CPA)" value={kpiCalculations.cpa} change="+2.1%" description="vs. previous period" icon={ChevronsRight} color="text-red-500" />
                                <KpiCard title="Return on Ad Spend (ROAS)" value={kpiCalculations.roas} change="+15.8%" description="vs. previous period" icon={ChevronsRight} color="text-green-500" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"><h3 className="text-xl font-bold mb-4">Performance Over Time</h3><div style={{ width: '100%', height: 350 }}><ResponsiveContainer><LineChart data={filteredData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} /><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip content={<CustomTooltip />} /><Legend /><Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} /><Line type="monotone" dataKey="impressions" stroke="#8b5cf6" strokeWidth={2} /></LineChart></ResponsiveContainer></div></div>
                                <AIAssistant data={filteredData} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"><h3 className="text-xl font-bold mb-4">Clicks by Campaign</h3><div style={{ width: '100%', height: 300 }}><ResponsiveContainer><BarChart data={campaignPerformance} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} /><XAxis type="number" hide /><YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} /><Tooltip cursor={{ fill: 'rgba(100,100,100,0.1)' }} content={<CustomTooltip />} /><Bar dataKey="clicks" fill="#3b82f6" background={{ fill: '#eee', fillOpacity: 0.1 }} /></BarChart></ResponsiveContainer></div></div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"><h3 className="text-xl font-bold mb-4">Cost Distribution</h3><div style={{ width: '100%', height: 300 }}><ResponsiveContainer><PieChart><Pie data={costDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5}><Tooltip content={<CustomTooltip />} />{costDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />))}</Pie><Legend /></PieChart></ResponsiveContainer></div></div>
                            </div>

                            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                                <h3 className="text-xl font-bold mb-4">Campaign Breakdown</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                                            <tr>
                                                {['date', 'campaign', 'clicks', 'cost'].map(key => (
                                                    <th key={key} className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key)}>
                                                        <div className="flex items-center gap-1">
                                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                                            {sortConfig.key === key ? (sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <ChevronDown className="w-4 h-4 opacity-30" />}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedAndPaginatedData.map((item, index) => (
                                                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-6 py-4">{item.date}</td><td className="px-6 py-4 font-medium">{item.campaign}</td><td className="px-6 py-4 text-right">{formatNumber(item.clicks)}</td><td className="px-6 py-4 text-right">{formatCurrency(item.cost)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    <p>Page {currentPage} of {totalPages}</p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><ChevronsLeft className="w-4 h-4" /></button>
                                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><ChevronDown className="w-4 h-4 rotate-90" /></button>
                                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><ChevronUp className="w-4 h-4 rotate-90" /></button>
                                        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><ChevronRightIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
            {isInsightsModalOpen && <InsightsModal isOpen={isInsightsModalOpen} onClose={() => setIsInsightsModalOpen(false)} content={insightsContent} isLoading={isGeneratingInsights} />}
        </div>
    );
}

// --- AI Assistant Component ---
function AIAssistant({ data }) {
    const [messages, setMessages] = useState([{ from: 'ai', text: "Hello! Ask me anything about the data in the dashboard." }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMessage = { from: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setInput('');
        try {
            const aiResponse = await getAIResponse(input, data);
            setMessages(prev => [...prev, { from: 'ai', text: aiResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { from: 'ai', text: "I'm having trouble connecting. Please check the API key and try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getAIResponse = async (query, currentData) => {
        const prompt = `You are a helpful and concise marketing data analyst named ADdy. Based on the following JSON data, answer the user's question. If the data is empty, inform the user they need to select a valid date range. Keep your answers short. Data: ${JSON.stringify(currentData, null, 2)} Question: "${query}"`;
        if (currentData.length === 0) return "There is no data for the selected period. Please choose a different date range or campaign to analyze.";
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0) return result.candidates[0].content.parts[0].text;
        return "I'm sorry, I couldn't process that request.";
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col h-[422px]">
            <h3 className="text-xl font-bold p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-500" />AI Assistant</h3>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                        {msg.from === 'ai' && <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-white" /></div>}
                        <div className={`max-w-xs md:max-w-sm p-3 rounded-2xl ${msg.from === 'ai' ? 'bg-gray-100 dark:bg-gray-700 rounded-tl-none' : 'bg-blue-500 text-white rounded-br-none'}`}><p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p></div>
                        {msg.from === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5" /></div>}
                    </div>
                ))}
                {isLoading && <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-white" /></div><div className="max-w-xs md:max-w-sm p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 rounded-tl-none flex items-center space-x-1"><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-0"></span><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></span><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></span></div></div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700/50"><div className="relative"><input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Ask a question..." className="w-full bg-gray-100 dark:bg-gray-700 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isLoading} /><button onClick={handleSend} disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 transition-colors"><ChevronsRight className="w-5 h-5" /></button></div></div>
        </div>
    );
}

// --- Insights Modal Component ---
function InsightsModal({ isOpen, onClose, content, isLoading }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700"><h3 className="text-lg font-bold flex items-center gap-2"><Sparkles className="text-blue-500" /> AI Generated Insights</h3><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-5 h-5" /></button></div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {isLoading ? (<div className="flex flex-col items-center justify-center h-48"><Bot className="w-12 h-12 text-blue-500 animate-bounce" /><p className="mt-4 text-gray-500 dark:text-gray-400">Generating insights, please wait...</p></div>) : (<div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }}></div>)}
                </div>
            </div>
        </div>
    );
}
