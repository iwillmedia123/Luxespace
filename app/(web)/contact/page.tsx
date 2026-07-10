import { Metadata } from "next";
import ContactClient from "@/app/(web)/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Luxespace Properties",
  description: "Connect with our real estate consultants to discuss properties for sale & rent, investment portfolios, Golden Visa solutions, or general enquiries.",
};

export default function ContactPage() {
  return <ContactClient />;
}
