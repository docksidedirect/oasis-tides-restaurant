import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuAPI } from "../../lib/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DialogFooter } from "../ui/dialog";
import { toast } from "sonner";

const MenuItemForm = ({ menuItem, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: menuItem?.name || "",
    description: menuItem?.description || "",
    price: menuItem?.price || 0,
    category: menuItem?.category || "main_course",
    image: menuItem?.image || "",
    popular: menuItem?.popular || false,
    available: menuItem?.available || true,
    ingredients: menuItem?.ingredients
      ? typeof menuItem.ingredients === "string"
        ? JSON.parse(menuItem.ingredients).join(", ")
        : menuItem.ingredients.join(", ")
      : "",
    allergens: menuItem?.allergens
      ? typeof menuItem.allergens === "string"
        ? JSON.parse(menuItem.allergens).join(", ")
        : menuItem.allergens.join(", ")
      : "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name || "",
        description: menuItem.description || "",
        price: menuItem.price || 0,
        category: menuItem.category || "main_course",
        image: menuItem.image || "",
        popular: menuItem.popular || false,
        available: menuItem.available || true,
        ingredients: menuItem.ingredients
          ? typeof menuItem.ingredients === "string"
            ? JSON.parse(menuItem.ingredients).join(", ")
            : menuItem.ingredients.join(", ")
          : "",
        allergens: menuItem.allergens
          ? typeof menuItem.allergens === "string"
            ? JSON.parse(menuItem.allergens).join(", ")
            : menuItem.allergens.join(", ")
          : "",
      });
    }
  }, [menuItem]);

  const handleChange = (e) => {
    const { id, value, type, checked, files } = e.target;
    if (type === "file") {
      setImageFile(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const createMutation = useMutation({
    mutationFn: menuAPI.createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminMenuItems"]);
      toast.success("Menu item created successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to create menu item.", {
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => menuAPI.updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminMenuItems"]);
      toast.success("Menu item updated successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to update menu item.", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    for (const key in formData) {
      if (key === "popular" || key === "available") {
        dataToSend.append(key, formData[key] ? 1 : 0);
      } else if (key === "ingredients" || key === "allergens") {
        dataToSend.append(
          key,
          formData[key]
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "")
            .join(",")
        );
      } else {
        dataToSend.append(key, formData[key]);
      }
    }
    if (imageFile) {
      dataToSend.append("image", imageFile);
    }

    if (menuItem) {
      // For update, Laravel expects PUT, but FormData with file requires POST with _method=PUT
      dataToSend.append("_method", "PUT");
      updateMutation.mutate({ id: menuItem.id, data: dataToSend });
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">
          Price
        </Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Select value={formData.category} onValueChange={handleSelectChange}>
          <SelectTrigger id="category" className="col-span-3">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main_course">Main Course</SelectItem>
            <SelectItem value="appetizer">Appetizer</SelectItem>
            <SelectItem value="dessert">Dessert</SelectItem>
            <SelectItem value="beverage">Beverage</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="image" className="text-right">
          Image
        </Label>
        <Input
          id="image"
          type="file"
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="ingredients" className="text-right">
          Ingredients (comma-separated)
        </Label>
        <Textarea
          id="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          className="col-span-3"
          placeholder="e.g., flour, sugar"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="allergens" className="text-right">
          Allergens (comma-separated)
        </Label>
        <Textarea
          id="allergens"
          value={formData.allergens}
          onChange={handleChange}
          className="col-span-3"
          placeholder="e.g., gluten, nuts"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="popular" className="text-right">
          Popular
        </Label>
        <Switch
          id="popular"
          checked={formData.popular}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, popular: checked }))
          }
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="available" className="text-right">
          Available
        </Label>
        <Switch
          id="available"
          checked={formData.available}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, available: checked }))
          }
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {menuItem ? "Update Item" : "Add Item"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MenuItemForm;
