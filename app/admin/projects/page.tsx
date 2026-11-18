"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Search, Trash2, Edit, X, Copy, Eye, Globe, Calendar, 
  FileText, Sparkles, Building2, MapPin, Clock, 
  CheckCircle2
} from "lucide-react";
import { db } from "@/lib/db";
import { Project, Developer, Community, Agent, ProjectUnit, ProjectMilestone, ProjectDriveTime, ProjectFaq } from "@/types";
import Button from "@/components/ui/Button";
import dynamic from "next/dynamic";
import PdfBrochureUploader from "@/components/admin/PdfBrochureUploader";
import { formatAED } from "@/lib/utils";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false });
const MediaUploadGrid = dynamic(() => import("@/components/admin/MediaUploadGrid"), { ssr: false });

export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Drawer modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Active Tab in Drawer: "overview" | "media_brochure" | "tables" | "content" | "seo"
  const [activeTab, setActiveTab] = useState<"overview" | "media_brochure" | "tables" | "content" | "seo">("overview");

  // Success / Error Alerts state
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State: Core
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [developerId, setDeveloperId] = useState("");
  const [developerName, setDeveloperName] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Townhouses & Luxury Villas");
  const [startingPrice, setStartingPrice] = useState<number>(3800000);
  const [paymentPlanSummary, setPaymentPlanSummary] = useState("60/40 with 10% Down Payment");
  const [handoverDate, setHandoverDate] = useState("October 2030");
  const [status, setStatus] = useState<Project['status']>("pre-launch");
  const [isFeatured, setIsFeatured] = useState(true);
  const [assignedAgentId, setAssignedAgentId] = useState("");
  const [tagsText, setTagsText] = useState("Palm Springs, Nakheel, Jebel Ali, Off-Plan, Townhouses, Villas");

  // Form State: Media & PDF Brochure (Strictly PDF only, max 20MB)
  const [coverImage, setCoverImage] = useState<string>("/assets/apartment_render.webp");
  const [gallery, setGallery] = useState<string[]>([]);
  const [pdfBrochureUrl, setPdfBrochureUrl] = useState<string>("");
  const [pdfBrochureName, setPdfBrochureName] = useState<string>("");
  const [pdfBrochureSize, setPdfBrochureSize] = useState<string>("");

  // Form State: Structured Tables
  const [units, setUnits] = useState<ProjectUnit[]>([]);
  const [paymentPlan, setPaymentPlan] = useState<ProjectMilestone[]>([]);
  const [driveTimes, setDriveTimes] = useState<ProjectDriveTime[]>([]);
  const [faqs, setFaqs] = useState<ProjectFaq[]>([]);
  const [amenitiesText, setAmenitiesText] = useState("");

  // Form State: SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const triggerAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [projs, devs, comms, ags] = await Promise.all([
          db.getProjects(),
          db.getDevelopers(),
          db.getCommunities(),
          db.getAgents(),
        ]);
        setProjects(projs);
        setDevelopers(devs);
        setCommunities(comms);
        setAgents(ags);
        if (ags.length > 0) setAssignedAgentId(ags[0].id);
      } catch (err) {
        console.error("Projects manager load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProject) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setActiveTab("overview");
    setTitle("");
    setSlug("");
    setHeadline("");
    setDescription("");
    setContent("");
    setDeveloperId(developers.length > 0 ? developers[0].id : "");
    setDeveloperName(developers.length > 0 ? developers[0].name : "Nakheel");
    setCommunityId(communities.length > 0 ? communities[0].id : "");
    setCommunityName(communities.length > 0 ? communities[0].name : "Jebel Ali");
    setLocation("Jebel Ali, South of Sheikh Zayed Road, Opposite Palm Jebel Ali");
    setPropertyType("Townhouses & Luxury Villas");
    setStartingPrice(3800000);
    setPaymentPlanSummary("60/40 with 10% Down Payment");
    setHandoverDate("October 2030");
    setStatus("pre-launch");
    setIsFeatured(true);
    setTagsText("Off-Plan, New Launch, Dubai Villas, Townhouses");
    if (agents.length > 0) setAssignedAgentId(agents[0].id);

    setCoverImage("/assets/apartment_render.webp");
    setGallery([]);
    setPdfBrochureUrl("");
    setPdfBrochureName("");
    setPdfBrochureSize("");

    setUnits([
      { typology: "3BR Townhouse (Mid Unit)", startingPrice: "AED 3,800,000", buaSqft: 2328, plotSqft: 2178, pricePerSqftBua: "~1,632" },
      { typology: "4BR Townhouse (Corner Unit)", startingPrice: "AED 4,600,000", buaSqft: 2780, plotSqft: 2850, pricePerSqftBua: "~1,654" },
      { typology: "4BR Standalone Villa", startingPrice: "AED 7,000,000", buaSqft: 4250, plotSqft: 5500, pricePerSqftBua: "~1,647" },
      { typology: "5BR Luxury Villa", startingPrice: "AED 8,900,000", buaSqft: 5420, plotSqft: 7200, pricePerSqftBua: "~1,642" },
    ]);

    setPaymentPlan([
      { milestone: "Down Payment on Booking", sharePercentage: "10%", timing: "On Booking" },
      { milestone: "1st Instalment", sharePercentage: "10%", timing: "April 2027" },
      { milestone: "2nd Instalment", sharePercentage: "10%", timing: "September 2027" },
      { milestone: "3rd Instalment", sharePercentage: "10%", timing: "March 2028" },
      { milestone: "4th Instalment", sharePercentage: "10%", timing: "October 2028" },
      { milestone: "5th Instalment", sharePercentage: "10%", timing: "April 2029" },
      { milestone: "On Handover", sharePercentage: "40%", timing: "October 2030 (Completion)" },
    ]);

    setDriveTimes([
      { destination: "Palm Jebel Ali", time: "14 minutes" },
      { destination: "Al Maktoum International Airport (DWC)", time: "23 minutes" },
      { destination: "Dubai Marina & JBR", time: "25 minutes" },
      { destination: "Downtown Dubai & Burj Khalifa", time: "35 minutes" },
    ]);

    setAmenitiesText("Canyon Park, Thousand Palms Country Club, Silver Spur Racquet Club, Metro Red Line connection");

    setFaqs([
      {
        question: "How much does the project cost?",
        answer: "Starting prices begin from AED 3.8 million for three-bedroom townhouses and up to AED 8.9 million for standalone luxury villas."
      },
      {
        question: "What is the payment plan?",
        answer: "A structured 60/40 plan with a 10% down payment on booking, 50% during construction, and 40% on handover."
      },
      {
        question: "When is the estimated handover?",
        answer: "Estimated construction completion and handover is scheduled for October 2030."
      }
    ]);

    setMetaTitle("");
    setMetaDescription("");
    setSeoKeywords("");
    setCanonicalUrl("");

    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setActiveTab("overview");
    setTitle(project.title);
    setSlug(project.slug);
    setHeadline(project.headline || "");
    setDescription(project.description);
    setContent(project.content);
    setDeveloperId(project.developerId || "");
    setDeveloperName(project.developerName || "");
    setCommunityId(project.communityId || "");
    setCommunityName(project.communityName || "");
    setLocation(project.location);
    setPropertyType(project.propertyType);
    setStartingPrice(project.startingPrice);
    setPaymentPlanSummary(project.paymentPlanSummary || "");
    setHandoverDate(project.handoverDate || "");
    setStatus(project.status);
    setIsFeatured(project.isFeatured ?? false);
    setAssignedAgentId(project.assignedAgentId || "");
    setTagsText(project.tags ? project.tags.join(", ") : "");

    setCoverImage(project.coverImage || "/assets/apartment_render.webp");
    setGallery(project.gallery || []);
    setPdfBrochureUrl(project.pdfBrochureUrl || "");
    setPdfBrochureName(project.pdfBrochureName || "");
    setPdfBrochureSize(project.pdfBrochureSize || "");

    setUnits(project.units && project.units.length > 0 ? project.units : []);
    setPaymentPlan(project.paymentPlan && project.paymentPlan.length > 0 ? project.paymentPlan : []);
    setDriveTimes(project.driveTimes && project.driveTimes.length > 0 ? project.driveTimes : []);
    setFaqs(project.faqs && project.faqs.length > 0 ? project.faqs : []);
    setAmenitiesText(project.amenities ? project.amenities.join(", ") : "");

    setMetaTitle(project.seo?.metaTitle || "");
    setMetaDescription(project.seo?.metaDescription || "");
    setSeoKeywords(project.seo?.keywords ? project.seo.keywords.join(", ") : "");
    setCanonicalUrl(project.seo?.canonicalUrl || "");

    setIsDrawerOpen(true);
  };

  const handleLoadPalmSpringsTemplate = () => {
    setTitle("Palm Springs by Nakheel");
    setSlug("palm-springs-nakheel-jebel-ali");
    setHeadline("Official Prices From AED 3.8M Opposite Palm Jebel Ali");
    setDescription("Palm Springs by Nakheel in Jebel Ali: official launch with prices from AED 3.8M, 60/40 payment plan with 10% down, October 2030 completion, amenities, and price per sq ft breakdown.");
    setLocation("Jebel Ali, South of Sheikh Zayed Road, Opposite Palm Jebel Ali");
    setPropertyType("Townhouses & Luxury Villas");
    setStartingPrice(3800000);
    setPaymentPlanSummary("60/40 with 10% Down Payment");
    setHandoverDate("October 2030");
    setStatus("pre-launch");
    setIsFeatured(true);
    setTagsText("Palm Springs, Nakheel, Jebel Ali, Palm Jebel Ali, Off-Plan, Townhouses, Villas");
    setPdfBrochureUrl("https://assets.luxespace.ae/brochures/nakheel-palm-springs-official-brochure.pdf");
    setPdfBrochureName("Nakheel_Palm_Springs_Official_Brochure.pdf");
    setPdfBrochureSize("14.2 MB");

    setUnits([
      { typology: "3BR Townhouse (Mid Unit, G+1)", startingPrice: "AED 3,800,000", buaSqft: 2328.6, plotSqft: 2178.0, pricePerSqftBua: "~1,632" },
      { typology: "4BR Townhouse (Corner Unit, G+1)", startingPrice: "AED 4,600,000", buaSqft: 2780.0, plotSqft: 2850.0, pricePerSqftBua: "~1,654" },
      { typology: "4BR Townhouse (G+2 Sky Terrace)", startingPrice: "AED 5,200,000", buaSqft: 3340.0, plotSqft: 3100.0, pricePerSqftBua: "~1,556" },
      { typology: "4BR Standalone Villa", startingPrice: "AED 7,000,000", buaSqft: 4250.0, plotSqft: 5500.0, pricePerSqftBua: "~1,647" },
      { typology: "5BR Luxury Villa", startingPrice: "AED 8,900,000", buaSqft: 5420.0, plotSqft: 7200.0, pricePerSqftBua: "~1,642" },
    ]);

    setPaymentPlan([
      { milestone: "Down Payment on Booking", sharePercentage: "10%", timing: "On Booking" },
      { milestone: "1st Instalment", sharePercentage: "10%", timing: "April 2027" },
      { milestone: "2nd Instalment", sharePercentage: "10%", timing: "September 2027" },
      { milestone: "3rd Instalment", sharePercentage: "10%", timing: "March 2028" },
      { milestone: "4th Instalment", sharePercentage: "10%", timing: "October 2028" },
      { milestone: "5th Instalment", sharePercentage: "10%", timing: "April 2029" },
      { milestone: "Final on Handover", sharePercentage: "40%", timing: "October 2030 (Completion)" },
    ]);

    setDriveTimes([
      { destination: "Palm Jebel Ali", time: "14 minutes" },
      { destination: "Al Maktoum International Airport (DWC)", time: "23 minutes" },
      { destination: "Dubai Marina & JBR", time: "25 minutes" },
      { destination: "Downtown Dubai & Burj Khalifa", time: "35 minutes" },
    ]);

    setAmenitiesText("Canyon Park, Thousand Palms Country Club, Silver Spur Racquet Club, Metro Red Line connection");

    setFaqs([
      {
        question: "How much does Palm Springs by Nakheel cost?",
        answer: "Per Nakheel's official payment plan, three-bedroom townhouses start from AED 3.8 million, four-bedroom townhouses from AED 4.6 million (G+1) and AED 5.2 million (G+2), and luxury standalone villas from AED 7 million to AED 8.9 million."
      },
      {
        question: "What is the payment plan?",
        answer: "A structured 60/40 plan with a 10% down payment on booking, 50% distributed across instalments through construction from 2027 to 2029, and 40% on handover in October 2030."
      },
      {
        question: "When is the estimated handover?",
        answer: "Nakheel's official construction completion schedule lists estimated handover for October 2030."
      },
      {
        question: "Where is Palm Springs located?",
        answer: "In Jebel Ali, south of Sheikh Zayed Road, directly opposite Palm Jebel Ali, with a planned Dubai Metro Red Line extension right at the entrance."
      }
    ]);

    setContent(`Nakheel has released the official brochure and sales materials for **Palm Springs**, an exclusive townhouse and villa community in **Jebel Ali**, opposite **Palm Jebel Ali**. 

Homes start from **AED 3.8 million** for a three-bedroom Aliso townhouse on an attractive **60/40 payment plan with a 10% down payment**, with estimated construction completion in **October 2030**.

## Palm Springs: Key Facts

| Feature | Details |
| :--- | :--- |
| **Developer** | Nakheel (Dubai Holding Real Estate) |
| **Location** | Jebel Ali, south of Sheikh Zayed Road, opposite Palm Jebel Ali |
| **Master Plan** | 382 hectares with over 30% dedicated open space |
| **Typologies** | 3 & 4 BR Townhouses, 4 & 5 BR Luxury Villas |
| **Starting Price** | From AED 3,800,000 |
| **Payment Plan** | 60/40 (10% Down Payment on booking) |
| **Handover Date** | Estimated October 2030 |

## Prices, Sizes and Price per Sq Ft

| Typology | Starting Price (AED) | Unit Area (sq ft) | Plot Area (sq ft) | AED / sq ft (BUA) |
| :--- | :--- | :--- | :--- | :--- |
| **3BR Townhouse (Mid Unit, G+1)** | From 3,800,000 | 2,328.6 | 2,178.0 | ~1,632 |
| **4BR Townhouse (Corner Unit, G+1)** | From 4,600,000 | 2,780.0 | 2,850.0 | ~1,654 |
| **4BR Townhouse (G+2 Sky Terrace)** | From 5,200,000 | 3,340.0 | 3,100.0 | ~1,556 |
| **4BR Standalone Villa** | From 7,000,000 | 4,250.0 | 5,500.0 | ~1,647 |
| **5BR Luxury Villa** | From 8,900,000 | 5,420.0 | 7,200.0 | ~1,642 |

## Payment Plan (60/40)

| Milestone | Share (%) | Timing |
| :--- | :--- | :--- |
| **Down Payment on Booking** | 10% | On Booking |
| **1st Instalment** | 10% | April 2027 |
| **2nd Instalment** | 10% | September 2027 |
| **3rd Instalment** | 10% | March 2028 |
| **4th Instalment** | 10% | October 2028 |
| **5th Instalment** | 10% | April 2029 |
| **Final on Handover** | 40% | October 2030 (Construction Completion) |

## Location and Drive Times

Palm Springs sits on the inland corridor of Sheikh Zayed Road, directly opposite Palm Jebel Ali, with a planned Dubai Metro Red Line extension right at the entrance.

| Destination | Drive Time |
| :--- | :--- |
| **Palm Jebel Ali** | 14 minutes |
| **Al Maktoum International Airport (DWC)** | 23 minutes |
| **Dubai Marina & JBR** | 25 minutes |
| **Downtown Dubai & Burj Khalifa** | 35 minutes |

## Amenities & Master Plan Highlights

Nakheel's master plan is organized around three premier social and leisure destinations:
- **Canyon Park**: The landscaped heart of the community featuring botanical gardens, continuous running trails, and outdoor adventure play zones.
- **Thousand Palms Country Club**: Beach-inspired lagoon pool, lap pools, splash pads, licensed clubhouse restaurant, fitness center, and event lawn.
- **Silver Spur Racquet Club**: Professional tennis and padel courts, wellness club, and shaded leisure pavilion.

## Frequently Asked Questions

<details>
<summary>How much does Palm Springs by Nakheel cost?</summary>
Per Nakheel's official payment plan, three-bedroom townhouses start from AED 3.8 million, four-bedroom townhouses from AED 4.6 million (G+1) and AED 5.2 million (G+2), and luxury standalone villas from AED 7 million to AED 8.9 million.
</details>

<details>
<summary>What is the payment plan?</summary>
A structured 60/40 plan with a 10% down payment on booking, further instalments through 2027 to 2029, and 40% on handover in October 2030.
</details>

<details>
<summary>When is handover?</summary>
Nakheel's payment plan lists estimated construction completion in October 2030.
</details>

<details>
<summary>Where is Palm Springs located?</summary>
In Jebel Ali, south of Sheikh Zayed Road, opposite Palm Jebel Ali, with a planned metro station beside the site. Official drive times include 14 minutes to Palm Jebel Ali and 23 minutes to Al Maktoum Airport.
</details>

> [!NOTE]
> **Register Your Interest With Luxe Space**
> Contact our private advisory desk for verified floor plans, unit allocation, and priority booking before public launch.
`);

    setMetaTitle("Palm Springs by Nakheel: Official Prices From AED 3.8M | Luxe Space");
    setMetaDescription("Official prices, 60/40 payment plan, floor plans, and amenities for Palm Springs by Nakheel in Jebel Ali, opposite Palm Jebel Ali.");
    setSeoKeywords("Palm Springs Nakheel, Jebel Ali villas, Palm Jebel Ali townhouses, Dubai off-plan");
    setCanonicalUrl("https://luxespace.ae/projects/palm-springs-nakheel-jebel-ali");

    triggerAlert("success", "Palm Springs project template and tables loaded!");
  };

  const handleDuplicate = async (project: Project) => {
    if (confirm(`Duplicate project "${project.title}"?`)) {
      setLoading(true);
      try {
        const payload: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
          ...project,
          title: `${project.title} (Copy)`,
          slug: `${project.slug}-copy-${Math.floor(Math.random() * 1000)}`,
          status: "pre-launch"
        };
        await db.createProject(payload);
        const updated = await db.getProjects();
        setProjects(updated);
        triggerAlert("success", `Project "${project.title}" duplicated successfully.`);
      } catch (err) {
        console.error("Duplicate error:", err);
        triggerAlert("error", "Failed to duplicate project.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this project?")) {
      setLoading(true);
      try {
        await db.deleteProject(id);
        setProjects(projects.filter((p) => p.id !== id));
        triggerAlert("success", "Project deleted successfully.");
      } catch (err) {
        console.error("Delete error:", err);
        triggerAlert("error", "Failed to delete project.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSaving) return;

    setIsSaving(true);

    const payload: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
      title: title.trim(),
      slug: slug.trim(),
      headline: headline.trim() || undefined,
      description: description.trim(),
      content: content.trim(),
      developerId: developerId || undefined,
      developerName: developerName || undefined,
      communityId: communityId || undefined,
      communityName: communityName || undefined,
      location: location.trim(),
      propertyType,
      startingPrice: Number(startingPrice) || 0,
      paymentPlanSummary: paymentPlanSummary.trim() || undefined,
      handoverDate: handoverDate.trim() || undefined,
      status,
      isFeatured,
      coverImage: coverImage || "/assets/apartment_render.webp",
      gallery,
      pdfBrochureUrl: pdfBrochureUrl || undefined,
      pdfBrochureName: pdfBrochureName || undefined,
      pdfBrochureSize: pdfBrochureSize || undefined,
      units,
      paymentPlan,
      driveTimes,
      amenities: amenitiesText.split(",").map((s) => s.trim()).filter(Boolean),
      faqs,
      assignedAgentId: assignedAgentId || undefined,
      tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
      seo: {
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        keywords: seoKeywords.split(",").map((s) => s.trim()).filter(Boolean),
        canonicalUrl: canonicalUrl.trim(),
        ogImage: coverImage,
        ogTitle: metaTitle.trim(),
        ogDescription: metaDescription.trim()
      }
    };

    try {
      if (editingProject) {
        const updated = await db.updateProject(editingProject.id, payload);
        setProjects((prev) => prev.map((p) => (p.id === updated.id || p.id === editingProject.id ? updated : p)));
        triggerAlert("success", `Project "${updated.title}" updated successfully.`);
      } else {
        const created = await db.createProject(payload);
        setProjects((prev) => [created, ...prev]);
        triggerAlert("success", `Project "${created.title}" launched successfully.`);
      }
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Save project error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      triggerAlert("error", `Failed to save project: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Table row mutations
  const handleAddUnit = () => {
    setUnits([...units, { typology: "New Typology", startingPrice: "AED 4,000,000", buaSqft: 2500, plotSqft: 2800, pricePerSqftBua: "~1,600" }]);
  };
  const handleRemoveUnit = (idx: number) => {
    setUnits(units.filter((_, i) => i !== idx));
  };
  const handleUpdateUnit = (idx: number, field: keyof ProjectUnit, val: string | number | undefined) => {
    const next = [...units];
    next[idx] = { ...next[idx], [field]: val };
    setUnits(next);
  };

  const handleAddMilestone = () => {
    setPaymentPlan([...paymentPlan, { milestone: "New Milestone", sharePercentage: "10%", timing: "Q1 2028" }]);
  };
  const handleRemoveMilestone = (idx: number) => {
    setPaymentPlan(paymentPlan.filter((_, i) => i !== idx));
  };
  const handleUpdateMilestone = (idx: number, field: keyof ProjectMilestone, val: string | number) => {
    const next = [...paymentPlan];
    next[idx] = { ...next[idx], [field]: val };
    setPaymentPlan(next);
  };

  const handleAddDriveTime = () => {
    setDriveTimes([...driveTimes, { destination: "New Destination", time: "20 minutes" }]);
  };
  const handleRemoveDriveTime = (idx: number) => {
    setDriveTimes(driveTimes.filter((_, i) => i !== idx));
  };
  const handleUpdateDriveTime = (idx: number, field: keyof ProjectDriveTime, val: string) => {
    const next = [...driveTimes];
    next[idx] = { ...next[idx], [field]: val };
    setDriveTimes(next);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "What are the payment milestones?", answer: "Instalments are linked directly to construction progress." }]);
  };
  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };
  const handleUpdateFaq = (idx: number, field: keyof ProjectFaq, val: string) => {
    const next = [...faqs];
    next[idx] = { ...next[idx], [field]: val };
    setFaqs(next);
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.developerName && p.developerName.toLowerCase().includes(search.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 select-none">
      {/* Top Banner Alert */}
      {alert && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs tracking-wide transition-all duration-300 ${
            alert.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border border-red-500/30 text-red-300"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <X className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Development Portfolio
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-white font-medium mt-1">
            Projects & Off-Plan Launches
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Manage off-plan real estate releases, structured pricing tables, drive times, and 20MB PDF brochures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleOpenAdd}
            variant="primary"
            className="text-xs font-semibold uppercase tracking-wider py-2.5 px-5 flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>New Project Launch</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Total Launches</span>
          <span className="text-2xl font-serif text-white block">{projects.length}</span>
        </div>
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-luxury-gold font-bold block">Pre-Launch / Active</span>
          <span className="text-2xl font-serif text-luxury-gold block">
            {projects.filter((p) => p.status === "pre-launch" || p.status === "active").length}
          </span>
        </div>
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold block">PDF Brochures Ready</span>
          <span className="text-2xl font-serif text-emerald-400 block">
            {projects.filter((p) => p.pdfBrochureUrl).length}
          </span>
        </div>
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-blue-400 font-bold block">Developers Represented</span>
          <span className="text-2xl font-serif text-blue-400 block">{developers.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, developers, locations..."
            className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["all", "pre-launch", "launching-soon", "active", "under-construction", "handover-soon"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === st
                  ? "bg-luxury-gold text-luxury-charcoal"
                  : "bg-[#1f232c] text-gray-400 hover:text-white border border-luxury-border/30"
              }`}
            >
              {st.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-luxury-border/20 text-luxury-gold bg-[#161a22] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Project & Headline</th>
                <th className="py-4 px-6">Developer & Location</th>
                <th className="py-4 px-6">Starting Price</th>
                <th className="py-4 px-6">Handover</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Brochure PDF (Max 20MB)</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border/10 text-gray-300 font-light">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 italic">
                    Loading projects directory...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 italic">
                    No matching projects found. Click &quot;New Project Launch&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-luxury-charcoal/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-luxury-charcoal border border-luxury-border/30 overflow-hidden shrink-0 relative">
                          <img
                            src={p.coverImage || "/assets/apartment_render.webp"}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-white block leading-snug">
                            {p.title}
                          </span>
                          {p.headline && (
                            <span className="text-[10px] text-gray-400 block line-clamp-1 max-w-[280px]">
                              {p.headline}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <span className="text-white font-medium block">
                          {p.developerName || "Master Developer"}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-luxury-gold" />
                          <span className="line-clamp-1 max-w-[180px]">{p.location}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-luxury-gold font-semibold font-mono text-xs">
                        {formatAED(p.startingPrice)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-300 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>{p.handoverDate || "TBA"}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 text-[9px] font-bold uppercase tracking-wider">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {p.pdfBrochureUrl ? (
                        <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-bold flex items-center gap-1.5 w-fit">
                          <FileText className="w-3 h-3" />
                          <span>{p.pdfBrochureSize || "PDF"}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-500 italic">No PDF Attached</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <a
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Public Dossier"
                          className="text-gray-400 hover:text-luxury-gold transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDuplicate(p)}
                          title="Duplicate Project"
                          className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Modify Project"
                          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Delete Project"
                          className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Modal Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 flex justify-end">
          <div className="w-full max-w-4xl bg-luxury-dark border-l border-luxury-border/30 h-full flex flex-col justify-between shadow-2xl animate-slide-in">
            {/* Drawer Header */}
            <div className="h-16 px-6 sm:px-8 border-b border-luxury-border/20 flex items-center justify-between shrink-0 gap-4 bg-[#161a22]">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-lg text-white font-medium">
                  {editingProject ? "Modify Project Dossier" : "Launch New Project Dossier"}
                </h2>
                <button
                  type="button"
                  onClick={handleLoadPalmSpringsTemplate}
                  className="px-3 py-1 rounded-lg bg-luxury-gold/15 hover:bg-luxury-gold/25 border border-luxury-gold/30 text-luxury-gold text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Auto-fill the Palm Springs by Nakheel structure"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Palm Springs Preset</span>
                </button>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 px-8 py-2.5 border-b border-luxury-border/20 bg-luxury-charcoal/30 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "overview"
                    ? "bg-luxury-gold text-luxury-charcoal"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                1. Core Specs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("media_brochure")}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "media_brochure"
                    ? "bg-luxury-gold text-luxury-charcoal"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>2. PDF & Media</span>
                {pdfBrochureUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tables")}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "tables"
                    ? "bg-luxury-gold text-luxury-charcoal"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                3. Tables & Highlights
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "content"
                    ? "bg-luxury-gold text-luxury-charcoal"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                4. Editorial Body
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "seo"
                    ? "bg-luxury-gold text-luxury-charcoal"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                5. SEO & Meta
              </button>
            </div>

            {/* Form Content Area */}
            <form onSubmit={handleSave} className="h-[calc(100vh-12rem)] overflow-y-auto p-8 space-y-8" data-lenis-prevent>
              {/* TAB 1: OVERVIEW & SPECS */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Palm Springs by Nakheel"
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Subtitle / Catchy Headline
                      </label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Official Prices From AED 3.8M Opposite Palm Jebel Ali"
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Project Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Project['status'])}
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="pre-launch">Pre-Launch</option>
                        <option value="launching-soon">Launching Soon</option>
                        <option value="active">Active (Available)</option>
                        <option value="under-construction">Under Construction</option>
                        <option value="handover-soon">Handover Soon</option>
                        <option value="sold-out">Sold Out</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Master Developer
                      </label>
                      <select
                        value={developerId}
                        onChange={(e) => {
                          setDeveloperId(e.target.value);
                          const d = developers.find((x) => x.id === e.target.value);
                          if (d) setDeveloperName(d.name);
                        }}
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        {developers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Community / District
                      </label>
                      <select
                        value={communityId}
                        onChange={(e) => {
                          setCommunityId(e.target.value);
                          const c = communities.find((x) => x.id === e.target.value);
                          if (c) setCommunityName(c.name);
                        }}
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        {communities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Exact Location & Landmarks
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Jebel Ali, South of Sheikh Zayed Road, Opposite Palm Jebel Ali"
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Starting Price (AED) *
                      </label>
                      <input
                        type="number"
                        required
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(Number(e.target.value))}
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Target Handover Timeline
                      </label>
                      <input
                        type="text"
                        value={handoverDate}
                        onChange={(e) => setHandoverDate(e.target.value)}
                        placeholder="e.g. October 2030 or Q4 2027"
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Payment Plan Ratio / Summary
                      </label>
                      <input
                        type="text"
                        value={paymentPlanSummary}
                        onChange={(e) => setPaymentPlanSummary(e.target.value)}
                        placeholder="e.g. 60/40 with 10% Down Payment"
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Assigned Advisory Consultant
                      </label>
                      <select
                        value={assignedAgentId}
                        onChange={(e) => setAssignedAgentId(e.target.value)}
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        {agents.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.name} ({ag.title})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Project Overview Summary *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief summary of the launch, master plan scale, architectural identity..."
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PDF & MEDIA (Strictly PDF only, max 20MB) */}
              {activeTab === "media_brochure" && (
                <div className="space-y-8 animate-fade-in">
                  {/* Dedicated PDF Brochure Uploader */}
                  <div className="space-y-3 bg-[#171b23] border border-luxury-gold/30 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-luxury-border/20 pb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold block">
                          Official Documentation
                        </span>
                        <h4 className="font-serif text-base text-white font-medium">
                          Project Brochure Upload (PDF Only • Max 20MB)
                        </h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        Auto-Delivered on Form Submit
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      Upload the official master developer brochure or sales deck. Visitors who complete the public inquiry form will automatically receive this file.
                    </p>

                    <PdfBrochureUploader
                      url={pdfBrochureUrl}
                      fileName={pdfBrochureName}
                      fileSize={pdfBrochureSize}
                      maxSizeMb={20}
                      onChange={(data) => {
                        if (data) {
                          setPdfBrochureUrl(data.url);
                          setPdfBrochureName(data.name);
                          setPdfBrochureSize(data.size);
                          triggerAlert("success", `Brochure "${data.name}" attached successfully.`);
                        } else {
                          setPdfBrochureUrl("");
                          setPdfBrochureName("");
                          setPdfBrochureSize("");
                        }
                      }}
                    />
                  </div>

                  {/* Imagery & Renders */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-bold border-b border-luxury-border/20 pb-2">
                      Cover Hero Render & Gallery
                    </h4>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Featured Cover Render
                      </label>
                      <MediaUploadGrid
                        images={coverImage ? [coverImage] : []}
                        onChange={(imgs) => setCoverImage(imgs[0] || "")}
                        maxImages={1}
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Project Exterior & Interior Gallery (Renders)
                      </label>
                      <MediaUploadGrid
                        images={gallery}
                        onChange={setGallery}
                        maxImages={12}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: STRUCTURED TABLES & HIGHLIGHTS */}
              {activeTab === "tables" && (
                <div className="space-y-8 animate-fade-in">
                  {/* Unit Typologies Table */}
                  <div className="space-y-3 bg-[#171b23] border border-luxury-border/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between border-b border-luxury-border/20 pb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold block">
                          Pricing Breakdown
                        </span>
                        <h4 className="font-serif text-sm text-white font-medium">Prices, Sizes & AED/Sq Ft Table</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddUnit}
                        className="px-2.5 py-1 rounded-lg bg-luxury-gold/15 text-luxury-gold hover:bg-luxury-gold/25 border border-luxury-gold/30 text-[10px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Unit Row</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-luxury-border/20 text-gray-400 font-semibold text-[10px] uppercase">
                            <th className="py-2 px-3">Typology</th>
                            <th className="py-2 px-3">Starting Price</th>
                            <th className="py-2 px-3">BUA (sq ft)</th>
                            <th className="py-2 px-3">Plot (sq ft)</th>
                            <th className="py-2 px-3">AED/sq ft</th>
                            <th className="py-2 px-2 text-right">Remove</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-luxury-border/10">
                          {units.map((u, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={u.typology}
                                  onChange={(e) => handleUpdateUnit(idx, "typology", e.target.value)}
                                  className="w-full bg-[#1f232c] border border-luxury-border/30 rounded px-2 py-1 text-xs text-white"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={u.startingPrice}
                                  onChange={(e) => handleUpdateUnit(idx, "startingPrice", e.target.value)}
                                  className="w-full bg-[#1f232c] border border-luxury-border/30 rounded px-2 py-1 text-xs text-white font-mono"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={u.buaSqft || ""}
                                  onChange={(e) => handleUpdateUnit(idx, "buaSqft", e.target.value)}
                                  className="w-20 bg-[#1f232c] border border-luxury-border/30 rounded px-2 py-1 text-xs text-white font-mono"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={u.plotSqft || ""}
                                  onChange={(e) => handleUpdateUnit(idx, "plotSqft", e.target.value)}
                                  className="w-20 bg-[#1f232c] border border-luxury-border/30 rounded px-2 py-1 text-xs text-white font-mono"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={u.pricePerSqftBua || ""}
                                  onChange={(e) => handleUpdateUnit(idx, "pricePerSqftBua", e.target.value)}
                                  className="w-24 bg-[#1f232c] border border-luxury-border/30 rounded px-2 py-1 text-xs text-white font-mono"
                                />
                              </td>
                              <td className="py-2 px-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveUnit(idx)}
                                  className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Payment Plan Milestones Table */}
                  <div className="space-y-3 bg-[#171b23] border border-luxury-border/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between border-b border-luxury-border/20 pb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold block">
                          Installment Schedule
                        </span>
                        <h4 className="font-serif text-sm text-white font-medium">Payment Plan Milestones Table</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddMilestone}
                        className="px-2.5 py-1 rounded-lg bg-luxury-gold/15 text-luxury-gold hover:bg-luxury-gold/25 border border-luxury-gold/30 text-[10px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Milestone</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-luxury-border/20 text-gray-400 font-semibold text-[10px] uppercase">
                            <th className="py-2 px-3">Milestone</th>
                            <th className="py-2 px-3">Share (%)</th>
                            <th className="py-2 px-3">Due Timing</th>
                            <th className="py-2 px-2 text-right">Remove</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-luxury-border/10">
                          {paymentPlan.map((m, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={m.milestone}
                                  onChange={(e) => handleUpdateMilestone(idx, "milestone", e.target.value)}
                                  className="w-full bg-[#1f232c] border border-luxury-border/30 rounded px-2 py-1 text-xs text-white"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={m.sharePercentage}
                                  onChange={(e) => handleUpdateMilestone(idx, "sharePercentage", e.target.value)}
                                  className="w-24 bg-[#1f232c] border border-luxury-border/30 rounded px-2 py-1 text-xs text-white font-mono"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={m.timing}
                                  onChange={(e) => handleUpdateMilestone(idx, "timing", e.target.value)}
                                  className="w-full bg-[#1f232c] border border-luxury-border/30 rounded px-2 py-1 text-xs text-white"
                                />
                              </td>
                              <td className="py-2 px-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMilestone(idx)}
                                  className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Drive Times & Connectivity Table */}
                  <div className="space-y-3 bg-[#171b23] border border-luxury-border/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between border-b border-luxury-border/20 pb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold block">
                          Connectivity
                        </span>
                        <h4 className="font-serif text-sm text-white font-medium">Location & Drive Times Table</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddDriveTime}
                        className="px-2.5 py-1 rounded-lg bg-luxury-gold/15 text-luxury-gold hover:bg-luxury-gold/25 border border-luxury-gold/30 text-[10px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Destination</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-luxury-border/20 text-gray-400 font-semibold text-[10px] uppercase">
                            <th className="py-2 px-3">Key Landmark / Destination</th>
                            <th className="py-2 px-3">Transit Time</th>
                            <th className="py-2 px-2 text-right">Remove</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-luxury-border/10">
                          {driveTimes.map((d, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={d.destination}
                                  onChange={(e) => handleUpdateDriveTime(idx, "destination", e.target.value)}
                                  className="w-full bg-[#1f232c] border border-luxury-border/30 rounded px-2 py-1 text-xs text-white"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={d.time}
                                  onChange={(e) => handleUpdateDriveTime(idx, "time", e.target.value)}
                                  className="w-48 bg-[#1f232c] border border-luxury-border/30 rounded px-2 py-1 text-xs text-white"
                                />
                              </td>
                              <td className="py-2 px-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDriveTime(idx)}
                                  className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Frequently Asked Questions */}
                  <div className="space-y-3 bg-[#171b23] border border-luxury-border/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between border-b border-luxury-border/20 pb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold block">
                          FAQ Accordion Builder
                        </span>
                        <h4 className="font-serif text-sm text-white font-medium">Buyer & Investor Questions</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddFaq}
                        className="px-2.5 py-1 rounded-lg bg-luxury-gold/15 text-luxury-gold hover:bg-luxury-gold/25 border border-luxury-gold/30 text-[10px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {faqs.map((f, idx) => (
                        <div key={idx} className="p-3 bg-[#1f232c] border border-luxury-border/30 rounded-xl space-y-2 relative">
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(idx)}
                            className="absolute right-3 top-3 text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="text"
                            value={f.question}
                            onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                            placeholder="Question"
                            className="w-full bg-[#161a22] border border-luxury-border/30 rounded px-3 py-1.5 text-xs text-white font-medium pr-8"
                          />
                          <textarea
                            rows={2}
                            value={f.answer}
                            onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                            placeholder="Detailed official answer..."
                            className="w-full bg-[#161a22] border border-luxury-border/30 rounded px-3 py-1.5 text-xs text-gray-300 resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EDITORIAL CONTENT */}
              {activeTab === "content" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold block">
                        Long-Form Dossier
                      </span>
                      <h4 className="font-serif text-sm text-white font-medium">Editorial Markdown & Headings</h4>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">Full Markdown Supported</span>
                  </div>

                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write detailed master plan narrative, community clusters, architecture specs..."
                    rows={16}
                  />
                </div>
              )}

              {/* TAB 5: SEO & META */}
              {activeTab === "seo" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-luxury-border/20 pb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold block">
                        Search Engine Visibility
                      </span>
                      <h4 className="font-serif text-sm text-white font-medium">Meta & Rich Snippet SEO</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMetaTitle(`${title} | Official Launch Prices & Brochure | Luxe Space`);
                        setMetaDescription(description || `Official launch details, 60/40 payment plan, floor plans, and amenities for ${title}.`);
                        setSeoKeywords(tagsText);
                        setCanonicalUrl(`https://luxespace.ae/projects/${slug}`);
                        triggerAlert("success", "Auto-suggested SEO meta tags applied.");
                      }}
                      className="px-3 py-1 rounded-lg bg-luxury-gold/15 text-luxury-gold hover:bg-luxury-gold/25 border border-luxury-gold/30 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Auto-Suggest SEO
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Canonical URL
                      </label>
                      <input
                        type="text"
                        value={canonicalUrl}
                        onChange={(e) => setCanonicalUrl(e.target.value)}
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        SEO Keywords (comma separated)
                      </label>
                      <input
                        type="text"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Drawer Footer Actions */}
            <div className="h-16 px-8 border-t border-luxury-border/20 flex items-center justify-between shrink-0 bg-[#161a22]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="text-xs text-gray-400 cursor-pointer"
              >
                Discard
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
                className="text-xs font-semibold uppercase tracking-wider py-2.5 px-6 cursor-pointer shadow-lg"
              >
                {isSaving ? "Saving..." : (editingProject ? "Update Project Dossier" : "Publish Project Launch")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
