import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Home, 
  ShoppingCart, 
  User, 
  Plus, 
  Minus, 
  Phone,
  MapPin,
  Clock,
  Share2,
  Settings
} from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cover_image_url: string;
  logo_url: string;
  phone: string;
  whatsapp_phone: string;
  address: string;
  owner_id: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  display_order: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function Restaurant() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const isOwner = user && restaurant && user.id === restaurant.owner_id;

  useEffect(() => {
    if (username) {
      fetchRestaurantData();
    }
  }, [username]);

  const fetchRestaurantData = async () => {
    try {
      // جلب بيانات المطعم
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('username', username)
        .single();

      if (restaurantError || !restaurantData) {
        navigate('/404');
        return;
      }

      setRestaurant(restaurantData);

      // جلب الفئات
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restaurantData.id)
        .order('display_order');

      setCategories(categoriesData || []);

      // جلب عناصر القائمة
      const { data: menuData } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantData.id)
        .eq('is_available', true)
        .order('display_order');

      setMenuItems(menuData || []);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحميل بيانات المطعم',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    toast({
      title: 'تم إضافة العنصر',
      description: `تم إضافة ${item.name} إلى السلة`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const sendOrderToWhatsApp = () => {
    if (cart.length === 0) return;

    const orderText = cart.map(item => 
      `${item.name} x${item.quantity} = ${item.price * item.quantity} جنيه`
    ).join('\n');
    
    const totalPrice = getTotalPrice();
    const message = `مرحباً، أريد طلب:\n\n${orderText}\n\nالإجمالي: ${totalPrice} جنيه\n\nشكراً لكم.`;
    
    const whatsappUrl = `https://wa.me/${restaurant?.whatsapp_phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredMenuItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category_id === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المطعم...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">المطعم غير موجود</h1>
          <Button onClick={() => navigate('/')}>العودة للرئيسية</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">{restaurant.name}</h1>
          <div className="flex items-center gap-2">
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/${username}/dashboard`)}
              >
                <Settings className="w-4 h-4 ml-2" />
                إدارة المطعم
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 ml-2" />
              مشاركة
            </Button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-orange-400 to-red-500">
        {restaurant.cover_image_url && (
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-4 right-4 text-white">
          <h2 className="text-2xl font-bold">{restaurant.name}</h2>
          {restaurant.description && (
            <p className="text-sm opacity-90">{restaurant.description}</p>
          )}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {restaurant.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{restaurant.phone}</span>
              </div>
            )}
            {restaurant.address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.address}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>مفتوح الآن</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-2 overflow-x-auto">
              <Button
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('all')}
              >
                الكل
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-6 pb-24">
        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">لا توجد عناصر في القائمة حالياً</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMenuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {item.price} جنيه
                        </span>
                        <div className="flex items-center gap-2">
                          {cart.find(cartItem => cartItem.id === item.id) ? (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="font-semibold">
                                {cart.find(cartItem => cartItem.id === item.id)?.quantity}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => addToCart(item)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="w-4 h-4 ml-1" />
                              إضافة
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    {item.image_url && (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6">
              <button className="flex flex-col items-center gap-1 text-primary">
                <Home className="w-5 h-5" />
                <span className="text-xs">الرئيسية</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-600">
                <User className="w-5 h-5" />
                <span className="text-xs">المطعم</span>
              </button>
            </div>
            
            {cart.length > 0 && (
              <Button
                onClick={sendOrderToWhatsApp}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>طلب ({cart.length})</span>
                <span>{getTotalPrice()} جنيه</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}