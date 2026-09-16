import { z } from "zod";
import { NextRequest } from "next/server";
import { ok, created, notFound, validationProblem, serverError } from "@/lib/api-response";
import { dbStore } from "@/lib/db-store";

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string().optional(),
  author: z.string().min(2),
  authorRole: z.string().min(2),
  category: z.string().min(2),
  tags: z.array(z.string()).optional().default([]),
  readTimeMinutes: z.number().int().min(1).max(60).optional().default(5),
  isPublished: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false)
});

const updateBlogSchema = blogPostSchema.partial().extend({
  id: z.string().min(1, "Post ID is required for updates")
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";
    const slug = searchParams.get("slug");

    if (slug) {
      const post = dbStore.getBlogPostBySlug(slug);
      if (!post) return notFound("Blog post not found");
      return ok({ post });
    }

    const posts = dbStore.getAllBlogPosts(publishedOnly);
    return ok({
      posts,
      total: posts.length,
      published: posts.filter((p) => p.isPublished).length,
      drafts: posts.filter((p) => !p.isPublished).length,
      featured: posts.filter((p) => p.featured).length
    });
  } catch (err) {
    return serverError("Failed to fetch blog posts");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = blogPostSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const post = dbStore.createBlogPost(parsed.data);
    return created({ post });
  } catch (err) {
    return serverError("Failed to create blog post");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateBlogSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { id, ...updates } = parsed.data;
    const post = dbStore.updateBlogPost(id, updates);
    if (!post) return notFound("Blog post not found");
    return ok({ post });
  } catch (err) {
    return serverError("Failed to update blog post");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return validationProblem({ message: "Post ID is required" } as never);

    const deleted = dbStore.deleteBlogPost(id);
    if (!deleted) return notFound("Blog post not found");
    return ok({ message: "Blog post deleted successfully" });
  } catch (err) {
    return serverError("Failed to delete blog post");
  }
}
