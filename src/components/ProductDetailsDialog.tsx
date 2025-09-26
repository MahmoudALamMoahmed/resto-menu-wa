import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  category_id: string;
}

interface Size {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  display_order: number;
}

interface ProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  sizes: Size[];
  onAddToCart: (item: MenuItem, selectedSize?: Size) => void;
}

export default function ProductDetailsDialog({
  open,
  onOpenChange,
  item,
  sizes,
  onAddToCart
}: ProductDetailsDialogProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const itemSizes = sizes.filter(size => size.menu_item_id === item.id);
  const hasMultipleSizes = itemSizes.length > 0;

  const handleAddToCart = () => {
    if (hasMultipleSizes && !selectedSize) {
      return; // لا يمكن الإضافة بدون اختيار حجم
    }
    
    // إضافة المنتج بالكمية المحددة
    for (let i = 0; i < quantity; i++) {
      onAddToCart(item, selectedSize || undefined);
    }
    
    onOpenChange(false);
    setSelectedSize(null);
    setQuantity(1);
  };

  const getCurrentPrice = () => {
    return selectedSize ? selectedSize.price : item.price;
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>تفاصيل المنتج</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* صورة المنتج */}
          {item.image_url && (
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* اسم المنتج */}
          <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
          
          {/* وصف المنتج */}
          {item.description && (
            <p className="text-gray-600 text-sm">{item.description}</p>
          )}
          
          {/* الأحجام المتاحة */}
          {hasMultipleSizes ? (
            <div className="space-y-3">
              <p className="text-sm font-medium">اختر الحجم:</p>
              <RadioGroup
                value={selectedSize?.id || ""}
                onValueChange={(sizeId) => {
                  const size = itemSizes.find(s => s.id === sizeId);
                  setSelectedSize(size || null);
                }}
                className="grid grid-cols-1 gap-2"
              >
                {itemSizes.map((size) => (
                  <div key={size.id} className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value={size.id} id={size.id} />
                    <Label
                      htmlFor={size.id}
                      className="flex-1 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{size.name}</span>
                        <span className="text-primary font-bold">{size.price} جنيه</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : null}
          
          {/* الكمية */}
          <div className="space-y-2">
            <p className="text-sm font-medium">الكمية:</p>
            <div className="flex items-center justify-center space-x-4 space-x-reverse">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-bold min-w-[40px] text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseQuantity}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* السعر الإجمالي */}
          <div className="text-center">
            <div className="text-sm text-gray-600">السعر الإجمالي:</div>
            <div className="text-2xl font-bold text-primary">
              {getCurrentPrice() * quantity} جنيه
            </div>
          </div>
          
          {/* زر الإضافة */}
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={hasMultipleSizes && !selectedSize}
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة إلى السلة ({quantity})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}