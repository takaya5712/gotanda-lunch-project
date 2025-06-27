import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing required environment variables for Supabase');
}

console.log('Initializing Supabase client with:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export type Restaurant = {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  business_hours: {
    lunch?: string;
    dinner?: string;
  };
  price_range: string;
  restaurant_categories: Array<{
    categories: {
      name: string;
    };
  }>;
  restaurant_images: Array<{
    url: string;
    is_main: boolean;
  }>;
  restaurant_feature_relations: Array<{
    restaurant_features: {
      name: string;
    };
  }>;
  menus: Array<{
    name: string;
    price: number;
    description: string;
    image_url: string | null;
    is_popular: boolean;
  }>;
  reviews: Array<{
    id: string;
    title: string;
    content: string;
    rating: number;
    visit_date: string;
    helpful_count: number;
    created_at: string;
  }>;
};

export type RestaurantSummary = {
  id: string;
  name: string;
  price_range: string;
  categories: string[];
  mainImage: string | undefined;
  rating: number | null;
  reviewCount: number;
};

// レストラン一覧を取得
export async function getRestaurants(keyword?: string): Promise<RestaurantSummary[]> {
  console.log('Fetching restaurants list...', { keyword });
  
  try {
    let query = supabase
      .from('restaurants')
      .select(`
        id,
        name,
        price_range,
        restaurant_categories (
          categories (
            name
          )
        ),
        restaurant_images (
          url,
          is_main
        ),
        reviews (
          rating
        )
      `)
      .limit(5);  // 5件に制限

    // キーワードが指定されている場合、検索条件を追加
    if (keyword) {
      query = query.ilike('name', `%${keyword}%`);
    }

    const { data: restaurants, error } = await query;

    if (error) {
      console.error('Error fetching restaurants:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    if (!restaurants) {
      console.log('No restaurants found');
      return [];
    }

    console.log('Found restaurants:', restaurants.length);
    return restaurants.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      price_range: restaurant.price_range,
      categories: (restaurant.restaurant_categories as any[])?.map(rc => (rc.categories as any).name) ?? [],
      mainImage: (restaurant.restaurant_images as any[])?.find(img => img.is_main)?.url,
      rating: (restaurant.reviews as any[])?.length > 0
        ? (restaurant.reviews as any[]).reduce((acc: number, review: any) => acc + review.rating, 0) / (restaurant.reviews as any[]).length
        : null,
      reviewCount: (restaurant.reviews as any[])?.length ?? 0
    }));
  } catch (error) {
    console.error('Unexpected error in getRestaurants:', error);
    throw error;
  }
}

// レストラン詳細を取得
export async function getRestaurant(id: string): Promise<Restaurant & {
  categories: string[];
  images: string[];
  mainImage: string | undefined;
  features: string[];
  popularMenus: Restaurant['menus'];
  rating: number | null;
  reviewCount: number;
  ratingDistribution: Record<number, number>;
}> {
  console.log('Fetching restaurant details for ID:', id);

  try {
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select(`
        id,
        name,
        description,
        address,
        phone,
        business_hours,
        price_range,
        restaurant_categories (
          categories (
            name
          )
        ),
        restaurant_images (
          url,
          is_main
        ),
        restaurant_feature_relations (
          restaurant_features (
            name
          )
        ),
        menus (
          name,
          price,
          description,
          image_url,
          is_popular
        ),
        reviews (
          id,
          title,
          content,
          rating,
          visit_date,
          helpful_count,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching restaurant:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    if (!restaurant) {
      console.log('Restaurant not found for ID:', id);
      throw new Error('Restaurant not found');
    }

    console.log('Found restaurant:', {
      id: restaurant.id,
      name: restaurant.name,
      hasCategories: !!restaurant.restaurant_categories?.length,
      hasImages: !!restaurant.restaurant_images?.length,
      hasFeatures: !!restaurant.restaurant_feature_relations?.length,
      hasMenus: !!restaurant.menus?.length,
      hasReviews: !!restaurant.reviews?.length
    });
    
    const processedData = {
      ...restaurant,
      categories: (restaurant.restaurant_categories as any[])?.map(rc => (rc.categories as any).name) ?? [],
      images: (restaurant.restaurant_images as any[])?.map(img => img.url) ?? [],
      mainImage: (restaurant.restaurant_images as any[])?.find(img => img.is_main)?.url,
      features: (restaurant.restaurant_feature_relations as any[])?.map(rf => (rf.restaurant_features as any).name) ?? [],
      popularMenus: (restaurant.menus as any[])?.filter(menu => menu.is_popular) ?? [],
      rating: (restaurant.reviews as any[])?.length > 0
        ? (restaurant.reviews as any[]).reduce((acc: number, review: any) => acc + review.rating, 0) / (restaurant.reviews as any[]).length
        : null,
      reviewCount: (restaurant.reviews as any[])?.length ?? 0,
      ratingDistribution: (restaurant.reviews as any[])?.reduce((acc: Record<number, number>, review: any) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}) ?? {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    };

    return processedData as unknown as Restaurant & {
      categories: string[];
      images: string[];
      mainImage: string | undefined;
      features: string[];
      popularMenus: Restaurant['menus'];
      rating: number | null;
      reviewCount: number;
      ratingDistribution: Record<number, number>;
    };
  } catch (error) {
    console.error('Unexpected error in getRestaurant:', error);
    throw error;
  }
} 