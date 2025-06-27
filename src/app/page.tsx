import Image from "next/image";
import { MagnifyingGlassIcon, MapPinIcon, CurrencyYenIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { getRestaurants } from "@/utils/supabase";

type SearchParams = {
  keyword?: string;
  area?: string;
};

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const keyword = searchParams.keyword || "";
  const restaurants = await getRestaurants(keyword);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <div className="container mx-auto px-4 py-3">
          <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-700">
            Gotanda Lunch
          </Link>
        </div>
      </header>

      <div className="pt-16">
        {/* メインビジュアル */}
        <div className="relative h-[500px] pt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800">
          </div>
          <div className="relative container mx-auto px-4 pt-20">
            <h1 className="text-4xl font-bold text-white text-center mb-8">
              五反田のおすすめランチを探そう
            </h1>
            <div className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-lg">
              <form className="flex gap-2" action="/" method="GET">
                <input
                  type="text"
                  placeholder="エリア・駅名"
                  className="flex-1 p-2 border rounded"
                  name="area"
                  defaultValue={searchParams.area || ""}
                />
                <input
                  type="text"
                  placeholder="キーワード"
                  className="flex-1 p-2 border rounded"
                  name="keyword"
                  defaultValue={keyword}
                />
                <button 
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                >
                  検索
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* コンテンツセクション */}
        <div className="container mx-auto px-4 py-12">
          {/* 人気のジャンル */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">人気のジャンル</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['和食', 'ラーメン', 'イタリアン', '中華'].map((genre) => (
                <a
                  key={genre}
                  href="#"
                  className="bg-white rounded-lg shadow hover:shadow-md transition p-4 text-center"
                >
                  <div className="text-lg font-medium">{genre}</div>
                </a>
              ))}
            </div>
          </section>

          {/* 探し方 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">お店を探す</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="#" className="flex items-center gap-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                <MapPinIcon className="w-6 h-6 text-red-600" />
                <div>
                  <div className="font-medium">エリアから探す</div>
                  <div className="text-sm text-gray-500">五反田駅周辺のお店</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                <CurrencyYenIcon className="w-6 h-6 text-red-600" />
                <div>
                  <div className="font-medium">予算から探す</div>
                  <div className="text-sm text-gray-500">ランチ予算別で検索</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                <MagnifyingGlassIcon className="w-6 h-6 text-red-600" />
                <div>
                  <div className="font-medium">こだわり条件から探す</div>
                  <div className="text-sm text-gray-500">席数・個室・お子様OK</div>
                </div>
              </a>
            </div>
          </section>

          {/* 新着のお店 */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              {keyword ? `「${keyword}」の検索結果` : "新着のお店"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {restaurants.length === 0 ? (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  該当するお店が見つかりませんでした。
                </div>
              ) : (
                restaurants.map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    href={`/restaurants/${restaurant.id}`}
                    className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
                  >
                    <div className="relative h-48 bg-gray-200">
                      {restaurant.mainImage ? (
                        <Image
                          src={restaurant.mainImage}
                          alt={restaurant.name}
                          fill
                          className="object-cover" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="font-medium mb-2">{restaurant.name}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        {restaurant.categories.join(' · ')}
                      </div>
                      <div className="text-sm text-gray-500">予算: {restaurant.price_range}</div>
                      {restaurant.rating && (
                        <div className="mt-2 text-sm text-gray-600">
                          ★ {restaurant.rating.toFixed(1)} ({restaurant.reviewCount}件)
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm">
            © 2024 Gotanda Lunch All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
