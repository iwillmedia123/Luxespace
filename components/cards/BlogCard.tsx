import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { BlogPost } from "@/types";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export default function BlogCard({ post, className }: BlogCardProps) {
  const publishedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  return (
    <Card className={cn("p-0 flex flex-col group h-full bg-luxury-dark border-luxury-border/30", className)}>
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-luxury-charcoal" />
        )}
        
        {/* First Tag Overlay */}
        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="glass">{post.tags[0]}</Badge>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Published Date metadata */}
          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
            <Calendar className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
            <span>{publishedDate}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg text-white group-hover:text-luxury-gold transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          {/* Summary */}
          <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
            {post.summary}
          </p>
        </div>

        {/* Read More Link */}
        <div className="pt-2 border-t border-luxury-border/20 mt-4 flex items-center justify-between">
          <span className="text-[10px] uppercase text-gray-500 font-medium">Market Editorial</span>
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-luxury-gold font-bold hover:text-white transition-colors duration-300"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
