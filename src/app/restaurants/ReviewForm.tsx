"use client";

import { useState } from "react";

export default function ReviewForm({ restaurantId }: { restaurantId: string }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // ここでAPI呼び出し（Supabaseなど）を行う
    // 例: await addReview({ restaurantId, title, content, rating, visitDate });
    setSubmitting(false);
    // 入力値リセットやメッセージ表示など
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="mb-2">
        <label className="block font-medium mb-1">評価</label>
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border rounded p-1">
          {[5,4,3,2,1].map(num => (
            <option key={num} value={num}>{num}点</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block font-medium mb-1">タイトル</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="border rounded p-1 w-full" />
      </div>
      <div className="mb-2">
        <label className="block font-medium mb-1">本文 <span className="text-red-500">*</span></label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required className="border rounded p-1 w-full" rows={3} />
      </div>
      <div className="mb-2">
        <label className="block font-medium mb-1">訪問日</label>
        <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} className="border rounded p-1" />
      </div>
      <button type="submit" disabled={submitting} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        {submitting ? "投稿中..." : "口コミを投稿"}
      </button>
    </form>
  );
}