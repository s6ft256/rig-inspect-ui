import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImageUrl?: string;
  itemId: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImageUrl,
  itemId,
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}-${Math.random()}.${fileExt}`;
      const filePath = `checklist-items/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('checklist-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('checklist-images')
        .getPublicUrl(filePath);

      onImageUpload(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onImageUpload('');
  };

  return (
    <div className="flex items-center gap-2">
      {currentImageUrl ? (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Checklist item"
            className="h-12 w-12 object-cover rounded border"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="sr-only"
            id={`image-upload-${itemId}`}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => document.getElementById(`image-upload-${itemId}`)?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Add Image'}
          </Button>
        </div>
      )}
    </div>
  );
};