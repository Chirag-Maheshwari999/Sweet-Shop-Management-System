import { useState, useEffect } from 'react';
import { sweetService } from '../services/api';
import SweetForm from '../components/SweetForm';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSweet, setEditingSweet] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Basic protection (redirect if not admin) is handled here for simplicity
        // Ideally this should be a Higher Order Component or Protected Route
        if (user && user.role.toUpperCase() !== 'ADMIN') {
            navigate('/');
            toast.error("Access denied. Admin only area.");
        }
    }, [user, navigate]);

    useEffect(() => {
        fetchSweets();
    }, []);

    const fetchSweets = async () => {
        try {
            const response = await sweetService.getAll();
            setSweets(response.data);
        } catch (error) {
            console.error("Failed to fetch sweets", error);
            toast.error("Failed to fetch sweets.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingSweet(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (sweet) => {
        setEditingSweet(sweet);
        setIsFormOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this sweet?')) {
            try {
                await sweetService.delete(id);
                toast.success('Sweet deleted successfully');
                setSweets(sweets.filter(s => s.id !== id));
            } catch (error) {
                console.error("Delete failed", error);
                toast.error('Failed to delete sweet');
            }
        }
    };

    const handleFormSubmit = async (data) => {
        setFormLoading(true);
        try {
            // Convert price/quantity to numbers
            const payload = {
                ...data,
                price: parseFloat(data.price),
                quantity: parseInt(data.quantity, 10)
            };

            if (editingSweet) {
                await sweetService.update(editingSweet.id, payload);
                toast.success('Sweet updated successfully');
                setSweets(sweets.map(s => s.id === editingSweet.id ? { ...s, ...payload } : s));
            } else {
                const response = await sweetService.create(payload);
                toast.success('Sweet created successfully');
                // If the backend returns the created object with ID, use it. 
                // Otherwise re-fetch or use placeholder ID if necessary, but re-fetch is safer.
                fetchSweets();
            }
            setIsFormOpen(false);
        } catch (error) {
            console.error("Operation failed", error);
            toast.error('Operation failed. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-pink-600" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your inventory</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors shadow-lg shadow-pink-600/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Sweet
                </button>
            </div>

            {/* Sweet List Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {sweets.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No sweets found. Click "Add Sweet" to create one.
                                    </td>
                                </tr>
                            ) : (
                                sweets.map((sweet) => (
                                    <tr key={sweet.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{sweet.name}</td>
                                        <td className="px-6 py-4">₹{sweet.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sweet.quantity === 0 ? 'bg-red-100 text-red-800' :
                                                sweet.quantity < 5 ? 'bg-amber-100 text-amber-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {sweet.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(sweet)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(sweet.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
                            </h2>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <SweetForm
                                sweet={editingSweet}
                                onSubmit={handleFormSubmit}
                                onCancel={() => setIsFormOpen(false)}
                                loading={formLoading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
