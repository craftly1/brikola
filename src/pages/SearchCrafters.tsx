
import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Award, Phone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders, Crafter } from '../contexts/FirebaseOrderContext'; // Import Crafter interface and useOrders

const SearchCrafters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Crafter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { searchCrafters } = useOrders(); // Get searchCrafters from context

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the searchCrafters function from the context
      const results = await searchCrafters(searchTerm, searchTerm); // Assuming searchTerm can be specialty or location
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching crafters:', err);
      setError('حدث خطأ أثناء البحث عن الحرفيين. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(); // Initial load of crafters
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">البحث عن حرفي</h1>
        <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            placeholder="ابحث بالاسم أو المهارة..."
            className="flex-grow p-3 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-3 hover:bg-blue-600 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-gray-600">جاري البحث...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && searchResults.length === 0 && searchTerm && (
        <p className="text-center text-gray-600">لا توجد نتائج لبحثك.</p>
      )}

      {!loading && !error && searchResults.length > 0 && (
        <div className="space-y-4">
          {searchResults.map((crafter) => (
            <div key={crafter.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">{crafter.name}</h2>
                {crafter.rating > 0 && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{crafter.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2 flex items-center gap-1"><MapPin className="w-4 h-4" /> {crafter.location}</p>
              <p className="text-sm text-gray-600 mb-3 flex items-center gap-1"><Award className="w-4 h-4" /> {crafter.specialty}</p>
              
              <div className="flex gap-2">
                <a 
                  href={`tel:${crafter.phone}`}
                  className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-4 h-4" /> اتصال
                </a>
                <button
                  onClick={() => navigate(`/chat/${crafter.id}`)} // Assuming chat with crafter is by crafter ID
                  className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> دردشة
                </button>
                <button
                  onClick={() => navigate(`/create-order?crafterId=${crafter.id}`)}
                  className="flex items-center gap-1 px-3 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors"
                >
                  إرسال طلب
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCrafters;


