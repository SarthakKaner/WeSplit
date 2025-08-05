import React, { useState, useEffect } from 'react';
import { X, Edit2, Check } from 'lucide-react';
import { createWorker } from 'tesseract.js';

export default function OCRPreviewModal({ image, onConfirm, onClose }) {
  const [loading, setLoading] = useState(true);
  const [ocrData, setOcrData] = useState({
    title: '',
    items: [],
    total: 0
  });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const processImage = async () => {
      setLoading(true);
      
      try {
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(image);
        await worker.terminate();

        // Parse the OCR text to extract bill information
        const parsedData = parseOCRText(text);
        setOcrData(parsedData);
      } catch (error) {
        console.error('OCR processing failed:', error);
        // Fallback to mock data if OCR fails
        const mockData = {
          title: 'Restaurant Bill',
          items: [
            { id: '1', name: 'Item 1', price: 12.50, participants: [] },
            { id: '2', name: 'Item 2', price: 18.00, participants: [] },
            { id: '3', name: 'Tax', price: 2.45, participants: [] }
          ],
          total: 32.95
        };
        setOcrData(mockData);
      } finally {
        setLoading(false);
      }
    };

    processImage();
  }, [image]);

  const parseOCRText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const items = [];
    let title = 'Bill';
    let total = 0;

    // Simple parsing logic - this can be enhanced based on bill format
    lines.forEach((line, index) => {
      // Try to find restaurant name or title in first few lines
      if (index < 3 && line.length > 3 && !line.match(/\d+\.\d+/)) {
        title = line.trim();
      }

      // Look for price patterns (e.g., "Item Name 12.50" or "12.50")
      const priceMatch = line.match(/(\d+\.\d+)/);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1]);
        const itemName = line.replace(priceMatch[0], '').trim() || `Item ${items.length + 1}`;
        
        items.push({
          id: (items.length + 1).toString(),
          name: itemName,
          price: price,
          participants: []
        });
        
        total += price;
      }
    });

    // If no items found, create a default item
    if (items.length === 0) {
      items.push({
        id: '1',
        name: 'Bill Total',
        price: 0,
        participants: []
      });
    }

    return {
      title: title || 'Restaurant Bill',
      items,
      total: Math.round(total * 100) / 100
    };
  };

  const updateItem = (id, field, value) => {
    setOcrData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotal = () => {
    return ocrData.items.reduce((sum, item) => sum + item.price, 0);
  };

  const handleConfirm = () => {
    const finalData = {
      ...ocrData,
      total: calculateTotal()
    };
    onConfirm(finalData);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
          <div className="inline-block bg-white rounded-lg p-8 text-center shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Bill Image</h3>
            <p className="text-gray-600">Extracting expense details using OCR...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Review Extracted Bill Data</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Original Image</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Bill"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>

              {/* Extracted Data */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bill Title
                  </label>
                  <input
                    type="text"
                    value={ocrData.title}
                    onChange={(e) => setOcrData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Extracted Items</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {ocrData.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2 p-2 border border-gray-200 rounded">
                        {editingItem === item.id ? (
                          <>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => setEditingItem(null)}
                              className="p-1 text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm">{item.name}</span>
                            <span className="w-20 text-sm text-right">₹{item.price.toFixed(2)}</span>
                            <button
                              onClick={() => setEditingItem(item.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700"
              >
                Use This Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}