"use client";

import { useState, FormEvent } from "react";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export interface NewsletterSectionProps {
  className?: string;
}

export default function NewsletterSection({ className }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API registration delay
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <Card
      hoverEffect={false}
      className={className}
    >
      <div className="max-w-3xl mx-auto text-center space-y-8 py-6">
        <div className="space-y-3">
          <Typography variant="subheading">
            Private Catalog Registration
          </Typography>
          <Typography variant="section" as="h3">
            Subscribe To Private Portfolios
          </Typography>
          <Typography variant="body" className="max-w-xl mx-auto text-xs sm:text-sm text-gray-400">
            Receive off-market residential offerings, luxury market advisory, and developer release notifications in Dubai before they reach the public market.
          </Typography>
        </div>

        {status === "success" ? (
          <div className="p-6 bg-luxury-gold/5 border border-luxury-gold/20 rounded-xl space-y-2 max-w-md mx-auto">
            <Typography variant="subheading" className="text-luxury-gold">
              Subscription Successful
            </Typography>
            <Typography variant="body" className="text-xs text-gray-300">
              Your credentials have been validated. You will receive private catalogue releases shortly.
            </Typography>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-end sm:items-center">
            <div className="w-full text-left">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your private email address"
                disabled={status === "loading"}
                className="bg-luxury-charcoal"
              />
            </div>
            <Button
              type="submit"
              isLoading={status === "loading"}
              disabled={status === "loading"}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
}
