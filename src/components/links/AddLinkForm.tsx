import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/pages/Links";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface AddLinkFormProps {
  link?: Link;
  onSave: (link: any) => void;
  onCancel: () => void;
}

export function AddLinkForm({ link, onSave, onCancel }: AddLinkFormProps) {
  const [name, setName] = useState(link?.name || "");
  const [url, setUrl] = useState(link?.url || "");
  const [logoPreview, setLogoPreview] = useState<string | null>(link?.logo_url || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    url?: string;
    logo?: string;
  }>({});

  const isEditing = !!link;
  const title = isEditing ? "Edit Link" : "Add New Link";
  const buttonText = isEditing ? "Save Changes" : "Save Link";

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!url.trim()) {
      newErrors.url = "URL is required";
    } else if (!url.trim().startsWith('http')) {
      newErrors.url = "URL must start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, logo: 'Please select an image file (JPEG, PNG, GIF, WEBP, SVG)' }));
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'File size must be less than 2MB' }));
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, logo: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    let finalLogoUrl = logoPreview;

    // Handle file upload if there's a new logo file
    if (logoFile) {
      try {
        setIsUploading(true);

        // Verify authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated. Please log in.");
        }

        // Generate a sanitized file name
        const fileName = `${Date.now()}-${logoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `logos/${fileName}`;
        
        console.log("Uploading file:", { fileName, filePath, fileType: logoFile.type, fileSize: logoFile.size });

        // Upload to 'saif' bucket
        const { error: uploadError } = await supabase.storage
          .from('saif')
          .upload(filePath, logoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('saif')
          .getPublicUrl(filePath);

        if (!publicUrl) {
          throw new Error("Failed to retrieve public URL");
        }

        console.log("Public URL:", publicUrl);
        finalLogoUrl = publicUrl;
      } catch (error: any) {
        console.error("Error uploading logo:", error);
        toast.error(error.message || "Failed to upload logo. The link will be saved without a logo.");
        finalLogoUrl = null;
      } finally {
        setIsUploading(false);
      }
    }

    // Prepare link data
    const linkData = {
      name,
      url: url.startsWith('http') ? url : `https://${url}`,
      logo_url: finalLogoUrl || null,
      ...(isEditing ? { id: link.id } : { user_id: (await supabase.auth.getUser()).data.user?.id })
    };

    try {
      toast.loading("Saving link...");
      await onSave(linkData);
      toast.dismiss();
      toast.success(isEditing ? "Link updated successfully" : "Link created successfully");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to save link");
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Edit your saved link details." : "Add a new link to your collection."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Favorite Site"
            required
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
          {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo-upload">Logo (Optional)</Label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="logo-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="object-contain w-full h-full rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, SVG (MAX. 2MB)
                  </p>
                </div>
              )}
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {errors.logo && <p className="text-sm text-destructive">{errors.logo}</p>}
          <p className="text-xs text-muted-foreground">
            Recommended: Square image, max 2MB, JPEG, PNG, GIF, SVG formats.
          </p>
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : buttonText}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}