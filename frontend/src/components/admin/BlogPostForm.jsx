import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogAPI } from "../../lib/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { toast } from "sonner";

const BlogPostForm = ({ blogPost, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    imageFile: null,
    published: false,
    published_at: "",
  });

  useEffect(() => {
    if (blogPost) {
      setFormData({
        title: blogPost.title || "",
        summary: blogPost.summary || "",
        content: blogPost.content || "",
        imageFile: null,
        published: blogPost.published || false,
        published_at: blogPost.published_at
          ? new Date(blogPost.published_at).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [blogPost]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        imageFile: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  function sanitizeInput(str) {
    return str
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'") // apostrophes
      .replace(/[\u2013\u2014]/g, "-") // dashes
      .replace(/[^\x00-\x7F]/g, (c) => c) // keep Unicode
      .trim();
  }

  const createMutation = useMutation({
    mutationFn: (data) => blogAPI.createBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminBlogPosts"]);
      toast.success("Blog post created successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to create blog post.", {
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => blogAPI.updateBlogPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminBlogPosts"]);
      toast.success("Blog post updated successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to update blog post.", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const sendData = new FormData();
    const cleanedSummary = sanitizeInput(formData.summary).slice(0, 500);

    sendData.append("title", formData.title);
    sendData.append("summary", cleanedSummary);
    sendData.append("content", formData.content);
    if (formData.imageFile) {
      sendData.append("image", formData.imageFile);
    }
    sendData.append("published", formData.published ? "1" : "0");
    sendData.append("published_at", formData.published_at);

    if (blogPost) {
      updateMutation.mutate({ id: blogPost.id, data: sendData });
    } else {
      createMutation.mutate(sendData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 py-4"
      encType="multipart/form-data"
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="summary" className="text-right">
          Summary
        </Label>
        <Textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          required
          maxLength={500}
          style={{ maxHeight: "150px", overflowY: "auto" }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="content" className="text-right">
          Content
        </Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={6}
          required
          style={{ maxHeight: "200px", overflowY: "auto" }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="image" className="text-right">
          Upload Image
        </Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="published_at" className="text-right">
          Published At
        </Label>
        <Input
          id="published_at"
          name="published_at"
          type="datetime-local"
          value={formData.published_at}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Label htmlFor="published" className="text-right mb-0">
          Published
        </Label>
        <input
          id="published"
          name="published"
          type="checkbox"
          checked={formData.published}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {blogPost ? "Update Post" : "Create Post"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default BlogPostForm;
