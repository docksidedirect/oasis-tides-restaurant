// src/app/blog/[slug]/page.tsx
import { Metadata } from "next";
import { blogAPI } from "@/lib/api";

interface Props {
  params: { slug: string };
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
  description?: string;
  imageUrl?: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post: BlogPost = await blogAPI.getPostBySlug(params.slug);
  return {
    title: post.title,
    description: post.description ?? "",
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.imageUrl ? [{ url: post.imageUrl }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post: BlogPost = await blogAPI.getPostBySlug(params.slug);

  return (
    <main className="max-w-4xl mx-auto p-6 sm:p-8">
      <article>
        <h1 className="text-4xl font-bold mb-4 text-ocean-700">{post.title}</h1>
        <time
          dateTime={post.publishedAt}
          className="block text-sm text-gray-500 mb-6"
        >
          Published on {new Date(post.publishedAt).toLocaleDateString()}
        </time>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full rounded-lg mb-6 object-cover max-h-96"
            loading="lazy"
          />
        )}
        <div
          className="prose prose-ocean max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
