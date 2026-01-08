import { supabase } from '@/integrations/supabase/client';

const CLOUD_NAME = 'dmclexcnp';
const UPLOAD_PRESET = 'restaurant-uploads';

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  error?: {
    message: string;
  };
}

/**
 * رفع صورة مباشرة إلى Cloudinary من المتصفح
 * @param file - الملف المراد رفعه
 * @param publicId - المعرف المحدد للصورة
 */
export async function uploadToCloudinary(
  file: File,
  publicId: string
): Promise<CloudinaryUploadResponse> {
  try {
    // إضافة timestamp للـ public_id لجعله فريد في كل مرة
    const uniquePublicId = `${publicId}_${Date.now()}`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('public_id', uniquePublicId);
    
    console.log('Uploading to Cloudinary:', { 
      publicId: uniquePublicId, 
      fileSize: file.size, 
      fileType: file.type 
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary upload failed:', response.status, errorText);
      throw new Error(`فشل رفع الصورة: ${response.status}`);
    }

    const data = await response.json();
    console.log('Cloudinary upload successful:', data);
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * حذف صورة من Cloudinary عبر Edge Function
 * @param publicId - معرف الصورة للحذف
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!publicId) {
    console.log('No publicId provided, skipping delete');
    return true;
  }
  
  try {
    console.log('Deleting from Cloudinary:', publicId);
    
    const { data, error } = await supabase.functions.invoke('cloudinary-delete', {
      body: { public_id: publicId },
    });

    if (error) {
      console.error('Error deleting from Cloudinary:', error);
      // لا نرمي خطأ هنا لأن الحذف ليس حرجاً
      return false;
    }

    console.log('Delete result:', data);
    return data?.success || false;
  } catch (error) {
    console.error('Delete exception:', error);
    return false;
  }
}

/**
 * إنشاء public_id لصورة الغلاف
 */
export function getCoverPublicId(restaurantId: string): string {
  return `restaurants/${restaurantId}/cover`;
}

/**
 * إنشاء public_id للشعار
 */
export function getLogoPublicId(restaurantId: string): string {
  return `restaurants/${restaurantId}/logo`;
}

/**
 * إنشاء public_id لصورة صنف
 */
export function getMenuItemPublicId(restaurantId: string, itemId: string): string {
  return `restaurants/${restaurantId}/menu-items/${itemId}`;
}