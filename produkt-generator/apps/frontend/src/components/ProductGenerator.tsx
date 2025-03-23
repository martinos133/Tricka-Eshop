'use client';

import { useState } from 'react';

export default function ProductGenerator() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('499');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitToShopify = async () => {
    if (!title || !price || !image) {
      alert('Vyplň všetky polia a nahraj motív.');
      return;
    }

    setUploading(true);

    try {
      const res = await fetch('http://localhost:3000/shopify/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: `Produkt: ${title}`,
          image,
          price,
        }),
      });

      const data = await res.json();
      console.log('✅ Úspech:', data);
      alert('Produkt bol odoslaný do Shopify!');
    } catch (error) {
      console.error('❌ Chyba:', error);
      alert('Nepodarilo sa odoslať produkt.');
    }

    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🎨 Generátor Produktov</h1>

      <div>
        <label className="block font-medium">Názov produktu</label>
        <input
          type="text"
          className="border w-full px-4 py-2 rounded mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Napr. Tričko s potlačou"
        />
      </div>

      <div>
        <label className="block font-medium">Cena (Kč)</label>
        <input
          type="number"
          className="border w-full px-4 py-2 rounded mt-1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Nahraj motív (JPG, PNG, SVG)</label>
        <input
          type="file"
          accept="image/*"
          className="mt-2"
          onChange={handleImageUpload}
        />
      </div>

      {image && (
        <div className="mt-4">
          <p className="font-medium">Náhľad:</p>
          <div className="border p-4 rounded w-64 h-64 bg-white flex items-center justify-center shadow">
            <img src={image} alt="Náhľad motívu" className="max-w-full max-h-full" />
          </div>
        </div>
      )}

      <button
        onClick={handleSubmitToShopify}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? 'Odosielam...' : '➕ Odoslať do Shopify'}
      </button>
    </div>
  );
}
