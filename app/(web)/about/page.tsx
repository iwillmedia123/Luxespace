import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Luxespace Properties",
  description: "Learn about Luxespace Properties, Dubai's premier luxury real estate advisory firm built on transparency, expertise, and research.",
};

export default function AboutPage() {
  return <AboutClient />;
}
