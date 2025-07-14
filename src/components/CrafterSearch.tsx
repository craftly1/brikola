
import React, { useState } from 'react';
import { Search, Star, MapPin, Award, Phone, MessageCircle } from 'lucide-react';
import { useOrders, Crafter } from '../contexts/FirebaseOrderContext';

interface CrafterSearchProps {
  onSelectCrafter?: (crafter: Crafter) => void;
  specialty?: string;
}

const CrafterSearch: React.FC<CrafterSearchProps> = ({ onSelectCrafter, specialty }) => {
  const { searchCrafters } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialty || '');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<Crafter[]>([]);
  const [loading, setLoading] = useState(false);

  const specialties = [
    'نجارة',
    'سباكة',
    'كهرباء',
    'تكييف',
    'صباغة',
    'بلاط وسيراميك',
    'تنظيف',
    'صيانة عامة'
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      const crafters = await searchCrafters(selectedSpecialty, location);
      
      let filteredResults = crafters;
      if (searchTerm) {
        filteredResults = crafters.filter(crafter =>
          crafter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crafter.specialty.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setResults(filteredResults);
    } catch (error) {
      console.error('Error searching crafters:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">البحث عن حرفي</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البحث بالاسم أو التخصص
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن حرفي..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التخصص
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">جميع التخصصات</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدينة
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="الرياض، جدة، الدمام..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري البحث...</span>
              </div>
            ) : (
              'بحث'
            )}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">نتائج البحث ({results.length})</h3>
          
          {results.map((crafter) => (
            <div key={crafter.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">{crafter.name}</h4>
                    {crafter.verified && (
                      <div className="relative">
                        <Award className="w-5 h-5 text-blue-500" />
                        <span className="sr-only">حرفي معتمد</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">
                      <strong>التخصص:</strong> {crafter.specialty}
                    </p>
                    <p className="text-gray-600">
                      <strong>الخبرة:</strong> {crafter.experience}
                    </p>
                    <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{crafter.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      {renderStars(crafter.rating)}
                      <span className="text-sm text-gray-600 mr-1">
                        ({crafter.rating.toFixed(1)})
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {crafter.completedOrders} طلب مكتمل
                    </span>
                  </div>
                </div>

                {onSelectCrafter && (
                  <button
                    onClick={() => onSelectCrafter(crafter)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    اختيار
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-600">لا توجد نتائج للبحث</p>
          <p className="text-gray-500 text-sm">جرب تغيير معايير البحث</p>
        </div>
      )}
    </div>
  );
};

export default CrafterSearch;
