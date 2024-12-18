import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  id: number;
  category: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [category, setCategory] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<'secondhand' | 'handmade'>('secondhand');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://vicious-damara-gentaproject-0a193137.koyeb.app/category');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('stock_qty', stockQty);
    formData.append('category_id', category?.toString() || '');
    formData.append('description', description);
    if (image) formData.append('product_img', image);
    formData.append('status', status);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'https://vicious-damara-gentaproject-0a193137.koyeb.app/product/addproduct',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Product added successfully:', response.data);
      onClose(); // Close modal after submission
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
    style={{ alignItems: "flex-start", paddingTop: "5rem" }}>
  <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
    <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Stock Quantity</label>
        <input
          type="number"
          value={stockQty}
          onChange={(e) => setStockQty(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <select
          value={category || ''}
          onChange={(e) => setCategory(parseInt(e.target.value))}
          className="w-full p-2 border rounded-lg"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Product Image</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'secondhand' | 'handmade')}
          className="w-full p-2 border rounded-lg"
        >
          <option value="secondhand">Secondhand</option>
          <option value="handmade">Handmade</option>
        </select>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Product'}
        </button>
      </div>
    </form>
  </div>
</div>

  ) : null;
};

export default AddProductModal;