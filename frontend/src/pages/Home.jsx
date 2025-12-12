import { useState, useEffect } from 'react';
import { sweetService } from '../services/api';
import SweetCard from '../components/SweetCard';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Home = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [purchasingId, setPurchasingId] = useState(null);

    useEffect(() => {
        fetchSweets();
    }, []);

    const fetchSweets = async () => {
        try {
            const response = await sweetService.getAll();
            setSweets(response.data);
        } catch (error) {
            console.error("Failed to fetch sweets", error);
            toast.error("Failed to load sweets. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (sweet) => {
        setPurchasingId(sweet.id);
        try {
            await sweetService.purchase(sweet.id);
            toast.success(`Successfully purchased ${sweet.name}!`);
            // Optimistically update stock or refetch
            setSweets(prev => prev.map(s =>
                s.id === sweet.id ? { ...s, quantity: s.quantity - 1 } : s
            ));
        } catch (error) {
            const message = error.response?.data?.error || "Purchase failed.";
            toast.error(message);
        } finally {
            setPurchasingId(null);
        }
    };

    const filteredSweets = sweets.filter(sweet =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sweet.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Our Sweets</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Explore our delicious collection</p>
                </div>

                <div className="w-full md:w-auto relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full md:w-80 pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all shadow-sm"
                        placeholder="Search sweets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 text-pink-600 animate-spin" />
                </div>
            ) : filteredSweets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSweets.map(sweet => (
                        <SweetCard
                            key={sweet.id}
                            sweet={sweet}
                            onPurchase={handlePurchase}
                            purchasing={purchasingId === sweet.id}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                        <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No sweets found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        No sweets match your search criteria.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
