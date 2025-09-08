import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

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
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}-${Date.now()}.${fileExt}`;
      const filePath = `checklist-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('checklist-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('checklist-images')
        .getPublicUrl(filePath);

      onImageUpload(publicUrl);
      
      toast({
        title: "Image uploaded successfully",
        description: "Image has been attached to this checklist item.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeImage = () => {
    onImageUpload('');
  };

  if (currentImageUrl) {
    return (
      <Card className="p-2">
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Checklist item"
            className="w-full h-32 object-cover rounded"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-1 right-1"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 border-dashed">
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="flex items-center justify-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
          <Upload className="h-4 w-4" />
          <span className="text-sm">Upload Image</span>
          <ImageIcon className="h-4 w-4" />
        </div>
      </label>
    </Card>
  );
};