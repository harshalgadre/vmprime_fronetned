import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/services/api";

interface Color {
  name: string;
  color: string;
  images?: string[]; // Array of image URLs for this color
}

const ProductsPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [newColor, setNewColor] = useState({ name: "", color: "#000000", images: [] as string[] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [colorImages, setColorImages] = useState<{[key: string]: File[]}>({});
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);

  // Updated categories list
  const categories = [
    "Rado", "Rolex", "Fossil", "Armani", "Casio", "Tissot", 
    "G-Shock", "Hublot", "Patel", "Tag", "Cartier", "Tommy"
  ];
  
  // Predefined genders
  const genders = ["Men", "Women", "All"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    // Initialize colors with actual image URLs (not data URLs)
    const initializedColors = product.colors?.map(color => ({
      ...color,
      images: color.images || []
    })) || [];
    setColors(initializedColors);
    setImagePreview(product.image);
    setUploadedImage(null);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    try {
      await deleteProduct(id);
      // Refresh the product list
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product: " + error.message);
    }
  };

  const addColor = () => {
    if (newColor.color) {
      // Generate a name based on the color if not provided
      const colorName = newColor.name || getColorName(newColor.color);
      setColors([...colors, { name: colorName, color: newColor.color, images: [] }]);
      setNewColor({ name: "", color: "#000000", images: [] });
    }
  };

  // Simple function to generate color names
  const getColorName = (hexColor: string): string => {
    const colorMap: Record<string, string> = {
      "#ff0000": "Red",
      "#00ff00": "Green",
      "#0000ff": "Blue",
      "#ffff00": "Yellow",
      "#ff00ff": "Magenta",
      "#00ffff": "Cyan",
      "#000000": "Black",
      "#ffffff": "White",
      "#ff7f00": "Orange",
      "#9400d3": "Violet",
      "#ff1493": "Pink",
      "#8b4513": "Brown",
      "#708090": "Slate",
      "#20b2aa": "LightSeaGreen",
      "#4169e1": "RoyalBlue",
      "#ff6347": "Tomato",
      "#32cd32": "LimeGreen",
      "#ffd700": "Gold"
    };
    
    // Check if we have a predefined name
    const lowerHex = hexColor.toLowerCase();
    if (colorMap[lowerHex]) {
      return colorMap[lowerHex];
    }
    
    // If not, return a generic name
    return hexColor.toUpperCase();
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle color-specific image upload
  const handleColorImageChange = (e: React.ChangeEvent<HTMLInputElement>, colorIndex: number) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Check if we're exceeding the limit of 4 images per color
      const currentImages = colors[colorIndex]?.images || [];
      if (currentImages.length + files.length > 4) {
        alert("Maximum 4 images allowed per color");
        return;
      }
      
      // If we're editing an existing product, upload the images to the server immediately
      if (selectedProduct && selectedProduct._id) {
        uploadColorImagesToServer(files, colorIndex);
      } else {
        // For new products, we need to handle this differently
        // We'll store the files temporarily and upload them after the product is created
        const newColors = [...colors];
        
        // Convert files to data URLs for preview
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Update the images array with the data URL for preview
            const updatedImages = [...(newColors[colorIndex].images || []), reader.result as string];
            newColors[colorIndex].images = updatedImages;
            setColors([...newColors]); // Create new array to trigger re-render
          };
          reader.readAsDataURL(file);
        });
        
        // Store the actual files for later upload
        const currentColorFiles = colorImages[colorIndex] || [];
        setColorImages({
          ...colorImages,
          [colorIndex]: [...currentColorFiles, ...Array.from(files)]
        });
      }
    }
  };

  // Upload color images to server
  const uploadColorImagesToServer = async (files: FileList, colorIndex: number) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('colorImages', file);
      });
      formData.append('colorIndex', colorIndex.toString());
      
      // We need to make a direct fetch call here since this is a special endpoint
      // In production, we'll use relative path; in development, we'll use the full URL
      const baseUrl = import.meta.env.DEV 
        ? 'https://localhost:5000/api' 
        : '/api';
      
      const response = await fetch(`${baseUrl}/products/${selectedProduct?._id}/color-images`, {
        method: 'POST',
        headers: {
          'x-admin-auth': 'admin-secret-key'
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload color images');
      }
      
      const updatedProduct = await response.json();
      
      // Update the colors state with the new images
      const updatedColors = updatedProduct.colors.map((color: any, index: number) => ({
        ...color,
        images: color.images || []
      }));
      
      setColors(updatedColors);
    } catch (error) {
      console.error('Error uploading color images:', error);
      alert('Failed to upload color images: ' + error.message);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const triggerColorImageInput = (colorIndex: number) => {
    setSelectedColorIndex(colorIndex);
    // Create a temporary input element for file selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => handleColorImageChange(e as any, colorIndex);
    input.click();
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Extract form data
      const productData = {
        name: formData.get('name') as string,
        category: formData.get('category') as string,
        gender: formData.get('gender') as string,
        price: Number(formData.get('price')),
        originalPrice: formData.get('originalPrice') ? Number(formData.get('originalPrice')) : undefined,
        description: formData.get('description') as string,
        badge: formData.get('badge') as string,
        // Process colors to remove data URLs before sending to backend
        colors: colors.map(color => ({
          name: color.name,
          color: color.color,
          // Filter out data URLs (they start with 'data:') and only keep actual image URLs
          images: color.images ? color.images.filter(img => !img.startsWith('data:')) : []
        })),
        features: (formData.get('features') as string)?.split('\n').filter(f => f.trim()) || []
      };
      
      let response;
      let savedProduct;
      
      if (selectedProduct && selectedProduct._id) {
        // Update existing product
        if (uploadedImage) {
          // For file uploads, we need to make a direct call
          const baseUrl = import.meta.env.DEV 
            ? 'https://localhost:5000/api' 
            : '/api';
          
          // Create FormData for file upload
          const uploadFormData = new FormData();
          uploadFormData.append('data', JSON.stringify(productData));
          uploadFormData.append('image', uploadedImage);
          
          response = await fetch(`${baseUrl}/products/${selectedProduct._id}`, {
            method: 'PUT',
            headers: {
              'x-admin-auth': 'admin-secret-key'
            },
            body: uploadFormData
          });
        } else {
          // No image upload, use the API service
          const result = await updateProduct(selectedProduct._id, productData);
          savedProduct = result;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `Failed to save product: ${response.status} ${response.statusText}`;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If parsing fails, use the raw text
            if (errorText) errorMessage = errorText;
          }
          throw new Error(errorMessage);
        }
        
        if (response) {
          savedProduct = await response.json();
        }
      } else {
        // Create new product
        if (uploadedImage) {
          // For file uploads, we need to make a direct call
          const baseUrl = import.meta.env.DEV 
            ? 'https://localhost:5000/api' 
            : '/api';
          
          // Create FormData for file upload
          const uploadFormData = new FormData();
          uploadFormData.append('data', JSON.stringify(productData));
          uploadFormData.append('image', uploadedImage);
          
          response = await fetch(`${baseUrl}/products`, {
            method: 'POST',
            headers: {
              'x-admin-auth': 'admin-secret-key'
            },
            body: uploadFormData
          });
        } else {
          // No image upload, use the API service
          const result = await createProduct(productData);
          savedProduct = result;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `Failed to save product: ${response.status} ${response.statusText}`;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If parsing fails, use the raw text
            if (errorText) errorMessage = errorText;
          }
          throw new Error(errorMessage);
        }
        
        if (response) {
          savedProduct = await response.json();
        }
        
        // For new products, upload color images after the product is created
        if (Object.keys(colorImages).length > 0) {
          for (const colorIndexStr in colorImages) {
            const colorIndex = parseInt(colorIndexStr);
            const files = colorImages[colorIndex];
            if (files && files.length > 0) {
              await uploadColorImagesForNewProduct(files, colorIndex, savedProduct._id);
            }
          }
        }
      }
      
      setIsAddDialogOpen(false);
      setSelectedProduct(null);
      setColors([]);
      setImagePreview(null);
      setUploadedImage(null);
      setColorImages({}); // Clear temporary color images
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload color images for new products
  const uploadColorImagesForNewProduct = async (files: File[], colorIndex: number, productId: string) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('colorImages', file);
      });
      formData.append('colorIndex', colorIndex.toString());
      
      // We need to make a direct fetch call here since this is a special endpoint
      // In production, we'll use relative path; in development, we'll use the full URL
      const baseUrl = import.meta.env.DEV 
        ? 'https://localhost:5000/api' 
        : '/api';
      
      const response = await fetch(`${baseUrl}/products/${productId}/color-images`, {
        method: 'POST',
        headers: {
          'x-admin-auth': 'admin-secret-key'
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload color images');
      }
      
      const updatedProduct = await response.json();
      return updatedProduct;
    } catch (error) {
      console.error('Error uploading color images for new product:', error);
      throw error;
    }
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setColors([]);
    setNewColor({ name: "", color: "#000000", images: [] });
    setImagePreview(null);
    setUploadedImage(null);
    setColorImages({}); // Clear temporary color images
    setIsAddDialogOpen(true);
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Error: {error}</div>
        <Button onClick={fetchProducts} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">No Products Found</h2>
          <p className="text-muted-foreground mb-4">You haven't added any products yet.</p>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.gender}</TableCell>
                  <TableCell>₹{product.price?.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {product.colors && product.colors.slice(0, 3).map((color, index) => (
                        <span
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        />
                      ))}
                      {product.colors && product.colors.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        onClick={() => product._id && handleDelete(product._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              Fill in the product details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="Enter product name" 
                  defaultValue={selectedProduct?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={selectedProduct?.category}
                  required
                  className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  name="gender"
                  defaultValue={selectedProduct?.gender}
                  required
                  className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="">Select Gender</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input 
                  id="badge" 
                  name="badge"
                  placeholder="e.g., Sale, Premium, New" 
                  defaultValue={selectedProduct?.badge}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input 
                  id="price" 
                  name="price"
                  type="number" 
                  placeholder="Current price" 
                  defaultValue={selectedProduct?.price}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  placeholder="Original price"
                  defaultValue={selectedProduct?.originalPrice}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Product description"
                className="min-h-[100px]"
                defaultValue={selectedProduct?.description}
              />
            </div>

            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="grid grid-cols-4 gap-4">
                <div
                  className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary relative"
                  onClick={triggerFileInput}
                >
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="absolute bottom-1 text-xs text-muted-foreground">Upload</span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {[2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-not-allowed opacity-50"
                  >
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Colors</Label>
              <div className="flex gap-4 mb-2 items-end">
                <div className="flex-1">
                  <Label htmlFor="colorName">Color Name (Optional)</Label>
                  <Input
                    id="colorName"
                    placeholder="Color name (e.g., Blue)"
                    value={newColor.name}
                    onChange={(e) =>
                      setNewColor({ ...newColor, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="colorPicker">Select Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="colorPicker"
                      type="color"
                      className="w-16 h-10 p-1"
                      value={newColor.color}
                      onChange={(e) =>
                        setNewColor({ ...newColor, color: e.target.value })
                      }
                    />
                    <div 
                      className="w-10 h-10 rounded border border-gray-300"
                      style={{ backgroundColor: newColor.color }}
                    />
                  </div>
                </div>
                <Button type="button" onClick={addColor} className="h-10">
                  Add
                </Button>
              </div>
              
              {/* Color list with image upload option */}
              <div className="space-y-3">
                {colors.map((color, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.color }}
                        />
                        <span className="font-medium">{color.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeColor(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {/* Color-specific images */}
                    <div className="mt-2">
                      <Label className="text-sm">Color Images (2-4 images recommended)</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {color.images && color.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative">
                            <img 
                              src={image.startsWith('data:') ? image : `/placeholder.svg`} 
                              alt={`Color ${color.name}`} 
                              className="w-16 h-16 object-cover rounded border"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full"
                              onClick={() => {
                                const newColors = [...colors];
                                const currentImages = newColors[index].images || [];
                                newColors[index].images = currentImages.filter((_, i) => i !== imgIndex);
                                setColors(newColors);
                              }}
                            >
                              <X className="w-2 h-2" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => triggerColorImageInput(index)}
                          className="h-16 w-16 border-dashed"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground self-center">
                          {color.images ? `${color.images.length}/4` : '0/4'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Features (one per line)</Label>
              <Textarea
                name="features"
                placeholder="Enter features (one per line)"
                className="min-h-[100px]"
                defaultValue={selectedProduct?.features?.join('\n')}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;