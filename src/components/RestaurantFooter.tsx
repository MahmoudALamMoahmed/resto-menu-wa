import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Truck
} from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp_phone: string;
  delivery_phone: string;
  complaints_phone: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  working_hours: string;
}

interface RestaurantFooterProps {
  restaurant: Restaurant;
}

export default function RestaurantFooter({ restaurant }: RestaurantFooterProps) {
  return (
    <footer className="bg-gray-900 text-white mt-12" dir="rtl">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Restaurant Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-primary">{restaurant.name}</h3>
            {restaurant.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <span className="text-gray-300">{restaurant.address}</span>
              </div>
            )}
            {restaurant.working_hours && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <span className="text-gray-300">{restaurant.working_hours}</span>
              </div>
            )}
          </div>

          {/* Contact Numbers */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">أرقام التواصل</h4>
            <div className="space-y-3">
              {restaurant.delivery_phone && (
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-gray-400">طلبات الدليفري</div>
                    <a 
                      href={`tel:${restaurant.delivery_phone}`}
                      className="text-gray-300 hover:text-primary transition-colors"
                    >
                      {restaurant.delivery_phone}
                    </a>
                  </div>
                </div>
              )}
              
              {restaurant.whatsapp_phone && (
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-success" />
                  <div>
                    <div className="text-sm text-gray-400">واتساب</div>
                    <a 
                      href={`https://wa.me/${restaurant.whatsapp_phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-success transition-colors"
                    >
                      {restaurant.whatsapp_phone}
                    </a>
                  </div>
                </div>
              )}

              {restaurant.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-sm text-gray-400">الهاتف الرئيسي</div>
                    <a 
                      href={`tel:${restaurant.phone}`}
                      className="text-gray-300 hover:text-accent transition-colors"
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                </div>
              )}

              {restaurant.complaints_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-destructive" />
                  <div>
                    <div className="text-sm text-gray-400">الشكاوي</div>
                    <a 
                      href={`tel:${restaurant.complaints_phone}`}
                      className="text-gray-300 hover:text-destructive transition-colors"
                    >
                      {restaurant.complaints_phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Digital Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">التواصل الرقمي</h4>
            <div className="space-y-3">
              {restaurant.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a 
                    href={`mailto:${restaurant.email}`}
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    {restaurant.email}
                  </a>
                </div>
              )}

              <div className="flex gap-4 mt-4">
                {restaurant.facebook_url && (
                  <a 
                    href={restaurant.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                
                {restaurant.instagram_url && (
                  <a 
                    href={restaurant.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors duration-200"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">معلومات إضافية</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>نسعى لتقديم أفضل خدمة لعملائنا الكرام</p>
              <p>جميع أطباقنا طازجة ومحضرة يومياً</p>
              <p>نلتزم بأعلى معايير النظافة والجودة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>
              جميع الحقوق محفوظة لـ{" "}
              <a 
                href="https://menutech.sa" 
                className="text-primary hover:text-primary-light transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                منيو تك
              </a>
              {" "}© 2024
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}