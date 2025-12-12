import { ShoppingCart } from 'lucide-react';
import { cn } from '../utils';

const SweetCard = ({ sweet, onPurchase, purchasing }) => {
    const { name, description, price, quantity, imageUrl } = sweet;
    const isOutOfStock = quantity === 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
            <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <span className="text-4xl">🍬</span>
                    </div>
                )}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg px-4 py-2 border-2 border-white rounded-lg">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1" title={name}>
                        {name}
                    </h3>
                    <span className="text-lg font-bold text-pink-600">
                        ₹{price}
                    </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
                    {description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className={cn(
                        "text-sm font-medium",
                        quantity < 5 ? (quantity === 0 ? "text-red-500" : "text-amber-500") : "text-gray-500 dark:text-gray-400"
                    )}>
                        {quantity === 0 ? "Unavailable" : `${quantity} left`}
                    </span>

                    <button
                        onClick={() => onPurchase(sweet)}
                        disabled={isOutOfStock || purchasing}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            isOutOfStock
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                                : "bg-pink-600 text-white hover:bg-pink-700 shadow-md shadow-pink-600/20 active:scale-95"
                        )}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SweetCard;
