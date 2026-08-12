import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || API_URL + '';

export default function Catalog() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(API_URL + '/templates');
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        setTemplates(data.templates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) return <div className="min-h-screen p-8 text-center text-gray-500">Loading catalog...</div>;
  if (error) return <div className="min-h-screen p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
          Свадебные шаблоны
        </h1>
        
        {templates.length === 0 ? (
          <div className="text-center text-gray-500">Нет доступных шаблонов</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {template.thumbnail || template.preview_image ? (
                    <img
                      src={template.thumbnail || template.preview_image}
                      alt={template.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-indigo-50 text-indigo-200">
                      <span className="text-sm font-medium">Нет превью</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold tracking-wide text-indigo-600 bg-indigo-50 rounded-full mb-3">
                      {template.category || 'Standard'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-900">
                      {Number(template.price).toLocaleString('ru-RU')} {template.currency}
                    </span>
                    <Link
                      to={`/templates/${template.slug}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Посмотреть
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
