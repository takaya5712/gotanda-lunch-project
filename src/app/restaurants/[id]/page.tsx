import Image from "next/image";
import { StarIcon, MapPinIcon, PhoneIcon, ClockIcon, CurrencyYenIcon, HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getRestaurant } from "@/utils/supabase";
import { notFound } from "next/navigation";
import { secureHeapUsed } from "crypto";
import ReviewForm from "./ReviewForm";

type Props = {
  params: {
    id: string;
  };
};

type RatingDistribution = {
  [key in 1|2|3|4|5]: number;
};

// レーティングバーコンポーネント
function RatingBar({ rating, count, total }: { rating: number; count: number; total: number }) {
  const percentage = (count / total) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 text-sm text-right">{rating}点</div>
      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-12 text-sm text-gray-500">{count}件</div>
    </div>
  );
}

// 星評価コンポーネント
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIconSolid
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-yellow-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default async function RestaurantPage({ params }: Props) {
  // Next.js 15ではparamsをawaitする必要がある
  const resolvedParams = await params;
  console.log('Fetching restaurant with ID:', resolvedParams.id);
  
  try {
    const restaurant = await getRestaurant(resolvedParams.id);
    console.log('Restaurant data:', JSON.stringify(restaurant, null, 2));
    
    if (!restaurant) {
      console.log('Restaurant not found');
      notFound();
      return null;
    }

    const totalReviews = restaurant.reviewCount;
    console.log('Total reviews:', totalReviews);

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
          {/* メイン画像セクション */}
          <div className="relative h-[400px] bg-gray-200">
            <div className="absolute inset-0 grid grid-cols-3 gap-1">
              {restaurant.images.slice(0, 3).map((photo, index) => (
                <div key={index} className="relative h-full">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={`${restaurant.name}の写真 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      No Photo
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-full text-sm hover:bg-white">
              写真をすべて見る
            </button>
          </div>

          {/* 店舗基本情報 */}
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <StarIconSolid className="w-5 h-5 text-yellow-400" />
                      <span className="ml-1 font-bold">{restaurant.rating?.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-500">（{restaurant.reviewCount}件）</span>
                    <span className="text-gray-500">·</span>
                    <span>{restaurant.price_range}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.categories.map((category) => (
                      <span key={category} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">
                  <HeartIcon className="w-5 h-5" />
                  <span>保存</span>
                </button>
              </div>

              {/* 基本情報テーブル */}
              <div className="border-t mt-6 pt-6">
                <h2 className="text-xl font-bold mb-4">基本情報</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">住所</div>
                      <div className="text-gray-600">{restaurant.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">電話番号</div>
                      <div className="text-gray-600">{restaurant.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">営業時間</div>
                      <div className="text-gray-600">
                        {typeof restaurant.business_hours === 'string' 
                          ? restaurant.business_hours 
                          : JSON.stringify(restaurant.business_hours)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CurrencyYenIcon className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">予算</div>
                      <div className="text-gray-600">{restaurant.price_range}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 店舗説明 */}
              <div className="border-t mt-6 pt-6">
                <h2 className="text-xl font-bold mb-4">お店の説明</h2>
                <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
              </div>

              {/* 設備・サービス */}
              <div className="border-t mt-6 pt-6">
                <h2 className="text-xl font-bold mb-4">設備・サービス</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {restaurant.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 人気メニュー */}
              <div className="border-t mt-6 pt-6">
                <h2 className="text-xl font-bold mb-4">人気メニュー</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {restaurant.popularMenus.map((menu) => (
                    <div key={menu.name} className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="relative h-48">
                        {menu.image_url ? (
                          <Image
                            src={menu.image_url}
                            alt={menu.name}
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
                        <div className="font-medium mb-1">{menu.name}</div>
                        <div className="text-red-600 mb-2">¥{menu.price.toLocaleString()}</div>
                        <p className="text-sm text-gray-600">{menu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 口コミセクション */}
              <div className="border-t mt-6 pt-6">
                <h2 className="text-xl font-bold mb-4">口コミ</h2>
                
                {/* 口コミ投稿フォーム */}
                <ReviewForm restaurantId={restaurant.id} />

                {/* 評価分布 */}
                {totalReviews > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">評価の分布</h3>
                    <div className="space-y-2">
                      {Object.entries(restaurant.ratingDistribution)
                        .sort(([a], [b]) => Number(b) - Number(a))
                        .map(([rating, count]) => (
                          <RatingBar
                            key={rating}
                            rating={Number(rating)}
                            count={count}
                            total={totalReviews}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* 口コミ一覧 */}
                {restaurant.reviews && restaurant.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {restaurant.reviews.map((review: any) => (
                      <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-bold mb-1">{review.title || "タイトルなし"}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <StarRating rating={review.rating} />
                              <span>{review.rating}点</span>
                              <span>·</span>
                              <time>{new Date(review.visit_date).toLocaleDateString()}</time>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <ChatBubbleLeftIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-gray-600 whitespace-pre-wrap">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    まだ口コミはありません。最初の口コミを投稿してみませんか？
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in RestaurantPage:', error);
    notFound();
    return null;
  }
} 