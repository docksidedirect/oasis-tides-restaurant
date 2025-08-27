// src/app/blog/page.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { blogAPI } from "@/lib/api";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);

  const loadPosts = async (newPage: number) => {
    setLoading(true);
    try {
      const data = await blogAPI.getPosts(newPage, pageSize);
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setTotalPosts(data.total);
      setPage(newPage);
    } catch (err) {
      // Handle error gracefully
      console.error("Failed to load blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(1);
  }, []);

  const canLoadMore = posts.length < totalPosts;

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-semibold mb-8">Blog</h1>
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.id} className="border-b pb-4">
            <Link
              href={`/blog/${post.slug}`}
              className="group block hover:underline"
            >
              <h2 className="text-xl font-bold text-ocean-700 group-hover:text-ocean-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-700">{post.summary}</p>
              <time
                dateTime={post.publishedAt}
                className="text-sm text-gray-500 mt-1 block"
              >
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            </Link>
          </li>
        ))}
      </ul>
      {canLoadMore && (
        <button
          onClick={() => loadPosts(page + 1)}
          disabled={loading}
          className="mt-8 px-6 py-2 bg-ocean-600 text-white rounded hover:bg-ocean-700 transition"
          aria-label="Load more blog posts"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </main>
  );
}
