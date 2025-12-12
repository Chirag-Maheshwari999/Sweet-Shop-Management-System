import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Candy } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-pink-600 hover:text-pink-700 transition-colors">
                        <Candy className="w-8 h-8" />
                        <span className="hidden sm:inline">SweetShop</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-gray-600 dark:text-gray-300 hidden md:inline">
                                    Welcome, {user.username || 'User'}
                                </span>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-pink-600 font-medium transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-pink-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition-colors shadow-lg shadow-pink-600/20"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
