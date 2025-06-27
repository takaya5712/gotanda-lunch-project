"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export default function ReviewForm({ restaurantId }: { restaurantId: string }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // TODO: ここでSupabaseにレビューを保存する
      console.log("レビューを投稿:", {
        restaurantId,
        rating,
        title,
        content,
        visitDate,
      });

      // フォームをリセット
      setRating(5);
      setTitle("");
      setContent("");
      setVisitDate("");

      // TODO: 成功メッセージを表示
    } catch (err) {
      setError("レビューの投稿に失敗しました。もう一度お試しください。");
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">口コミを投稿</h3>
      
      <form onSubmit={handleSubmit}>
        {/* 評価 */}
        <div className="mb-4">
          <label className="block font-medium mb-2">
            評価 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                {star <= rating ? (
                  <StarIconSolid className="w-8 h-8 text-yellow-400" />
                ) : (
                  <StarIcon className="w-8 h-8 text-gray-300" />
                )}
              </button>
            ))}
            <span className="ml-2 text-gray-600">{rating}点</span>
          </div>
        </div>

        {/* タイトル */}
        <div className="mb-4">
          <label className="block font-medium mb-2">
            タイトル
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：とても美味しかったです！"
            className="w-full p-2 border rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* 本文 */}
        <div className="mb-4">
          <label className="block font-medium mb-2">
            本文 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="お店の雰囲気、料理の味、サービスなど、あなたの体験を教えてください"
            className="w-full p-2 border rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
            rows={5}
          />
        </div>

        {/* 訪問日 */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            訪問日
          </label>
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="p-2 border rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
            {error}
          </div>
        )}

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={submitting || !content}
          className={`w-full py-3 rounded-lg font-medium
            ${submitting || !content
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
            }`}
        >
          {submitting ? "投稿中..." : "口コミを投稿する"}
        </button>
      </form>
    </div>
  );
} 