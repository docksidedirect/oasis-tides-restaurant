<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    // List all blog posts
    public function index(Request $request)
    {
        // Admins get all posts paginated by creation time descending
        if ($request->user() && $request->user()->hasRole("admin")) {
            $blogPosts = BlogPost::orderByDesc("created_at")->paginate(10);
        } else {
            // Public users only see published posts ordered by published_at descending
            $blogPosts = BlogPost::where('published', true)
                ->orderByDesc("published_at")
                ->paginate(10);
        }
        return response()->json(["success" => true, "blog_posts" => $blogPosts]);
    }

    // Show a specific blog post by slug (published only)
    public function show($slug)
    {
        $blogPost = BlogPost::where('published', true)
            ->where("slug", $slug)
            ->first();

        if (!$blogPost) {
            return response()->json(["success" => false, "message" => "Blog post not found"], 404);
        }
        return response()->json(["success" => true, "blog_post" => $blogPost]);
    }

    // Create a new blog post (Admin only)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "summary" => "required|string|max:500",
            "content" => "required|string",
            "image" => "nullable|string|max:255",
            "published" => "boolean",
            "published_at" => "nullable|date",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => "Validation errors",
                "errors" => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        $data["slug"] = Str::slug($data["title"]);

        // Automatically set published_at if published is true and published_at missing or null
        if (isset($data["published"]) && $data["published"] && empty($data["published_at"])) {
            $data["published_at"] = now();
        }

        // If published is false, ensure published_at is null
        if (isset($data["published"]) && !$data["published"]) {
            $data["published_at"] = null;
        }

        $blogPost = BlogPost::create($data);
        return response()->json([
            "success" => true,
            "message" => "Blog post created successfully",
            "blog_post" => $blogPost
        ], 201);
    }

    // Update existing blog post (Admin only)
    public function update(Request $request, $id)
    {
        $blogPost = BlogPost::find($id);
        if (!$blogPost) {
            return response()->json(["success" => false, "message" => "Blog post not found"], 404);
        }

        $validator = Validator::make($request->all(), [
            "title" => "sometimes|required|string|max:255",
            "summary" => "sometimes|required|string|max:500",
            "content" => "sometimes|required|string",
            "image" => "nullable|string|max:255",
            "published" => "boolean",
            "published_at" => "nullable|date",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => "Validation errors",
                "errors" => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        if (isset($data["title"])) {
            $data["slug"] = Str::slug($data["title"]);
        }

        // Update published_at as needed
        if (isset($data["published"])) {
            if ($data["published"] && empty($blogPost->published_at)) {
                $data["published_at"] = now();
            } elseif (!$data["published"]) {
                $data["published_at"] = null;
            }
        }

        $blogPost->update($data);

        return response()->json([
            "success" => true,
            "message" => "Blog post updated successfully",
            "blog_post" => $blogPost
        ]);
    }

    // Delete a blog post (Admin only)
    public function destroy($id)
    {
        $blogPost = BlogPost::find($id);
        if (!$blogPost) {
            return response()->json(["success" => false, "message" => "Blog post not found"], 404);
        }

        $blogPost->delete();

        return response()->json([
            "success" => true,
            "message" => "Blog post deleted successfully"
        ]);
    }
}
