-- Luxespace Properties Database Migration
-- Version: 1.0 (Initial Schema Setup)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

---------------------------------------------------------
-- 1. Profiles (Linked to Supabase Auth)
---------------------------------------------------------
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('super_admin', 'admin', 'agent', 'editor', 'client')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 2. Role-Based Access Control (RBAC) System
---------------------------------------------------------
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- e.g. 'properties:create', 'leads:read'
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE public.user_roles (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

---------------------------------------------------------
-- 3. developers (Sobha, Emaar, DAMAC, etc.)
---------------------------------------------------------
CREATE TABLE public.developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    founded_year INTEGER,
    website TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 4. Communities (Palm Jumeirah, Dubai Marina, etc.)
---------------------------------------------------------
CREATE TABLE public.communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    banner_url TEXT,
    coordinates JSONB, -- For mapping { lat: 25.1, lng: 55.1 }
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 5. Agents (Real estate specialists)
---------------------------------------------------------
CREATE TABLE public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL, -- e.g. "Senior Advisor"
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    avatar_url TEXT,
    languages TEXT[] NOT NULL DEFAULT '{}',
    specialization TEXT[] NOT NULL DEFAULT '{}',
    experience_years INTEGER CHECK (experience_years >= 0),
    bio TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 6. Properties
---------------------------------------------------------
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0), -- Price in AED
    price_usd NUMERIC CHECK (price_usd >= 0),
    type TEXT NOT NULL CHECK (type IN ('apartment', 'villa', 'penthouse', 'townhouse', 'mansion')),
    status TEXT NOT NULL CHECK (status IN ('buy', 'rent', 'off-plan', 'sold', 'rented')),
    completion_status TEXT NOT NULL CHECK (completion_status IN ('ready', 'off-plan', 'under-construction')),
    handover_date TEXT, -- e.g. "Q4 2027"
    bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
    bathrooms NUMERIC NOT NULL CHECK (bathrooms >= 0),
    area_sqft NUMERIC NOT NULL CHECK (area_sqft >= 0),
    location TEXT NOT NULL,
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE RESTRICT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    images TEXT[] NOT NULL DEFAULT '{}',
    videos TEXT[] NOT NULL DEFAULT '{}',
    amenities TEXT[] NOT NULL DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 7. Leads (CRM)
---------------------------------------------------------
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    source TEXT NOT NULL, -- e.g. 'whatsapp', 'property_detail'
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'lost', 'won')),
    property_interest_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 8. Appointments
---------------------------------------------------------
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('in-person', 'virtual', 'phone_call')),
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 9. Testimonials
---------------------------------------------------------
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_title TEXT, -- e.g. "CEO, Alpha Corp"
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    avatar_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 10. Blogs (Editorial Content)
---------------------------------------------------------
CREATE TABLE public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    published_at TIMESTAMPTZ,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 11. Media Library Tracking
---------------------------------------------------------
CREATE TABLE public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    size INTEGER NOT NULL CHECK (size >= 0),
    mime_type TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- 12. System Settings (Dynamic configuration)
---------------------------------------------------------
CREATE TABLE public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------
-- Helper Functions & Triggers
---------------------------------------------------------

-- 1. Automate updated_at column timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER trigger_update_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_update_developers BEFORE UPDATE ON public.developers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_update_communities BEFORE UPDATE ON public.communities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_update_agents BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_update_properties BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_update_leads BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_update_appointments BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_update_blogs BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_update_system_settings BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Sync Auth Users to Profiles Table
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Client Member'),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url',
        'client'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync auth users on creation
CREATE OR REPLACE TRIGGER trigger_sync_auth_user
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

---------------------------------------------------------
-- Row-Level Security (RLS) Configurations
---------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user has admin/agent status
CREATE OR REPLACE FUNCTION public.is_admin_or_agent()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'agent')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for public reading, admin/agent writing

-- 1. Profiles
CREATE POLICY "Public profile view" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users edit own profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL USING (public.is_admin_or_agent());

-- 2. Developers, Communities, Agents, Properties, Testimonials
CREATE POLICY "Public select devs" ON public.developers FOR SELECT USING (true);
CREATE POLICY "Admin write devs" ON public.developers FOR ALL USING (public.is_admin_or_agent());

CREATE POLICY "Public select communities" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Admin write communities" ON public.communities FOR ALL USING (public.is_admin_or_agent());

CREATE POLICY "Public select agents" ON public.agents FOR SELECT USING (true);
CREATE POLICY "Admin write agents" ON public.agents FOR ALL USING (public.is_admin_or_agent());

CREATE POLICY "Public select properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Admin write properties" ON public.properties FOR ALL USING (public.is_admin_or_agent());

CREATE POLICY "Public select testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admin write testimonials" ON public.testimonials FOR ALL USING (public.is_admin_or_agent());

-- 3. Blogs (only published visible to public, all visible to author/admin)
CREATE POLICY "Public select published blogs" ON public.blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Admin select blogs" ON public.blogs FOR SELECT USING (public.is_admin_or_agent());
CREATE POLICY "Admin manage blogs" ON public.blogs FOR ALL USING (public.is_admin_or_agent());

-- 4. Leads & Appointments (Admins/agents see all; clients see their own by email/uid match)
CREATE POLICY "Admins manage leads" ON public.leads FOR ALL USING (public.is_admin_or_agent());
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage appointments" ON public.appointments FOR ALL USING (public.is_admin_or_agent());

-- 5. System settings and RBAC
CREATE POLICY "Public select settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON public.system_settings FOR ALL USING (public.is_admin_or_agent());

CREATE POLICY "Admin select roles" ON public.roles FOR SELECT USING (public.is_admin_or_agent());
CREATE POLICY "Admin manage roles" ON public.roles FOR ALL USING (public.is_admin_or_agent());

---------------------------------------------------------
-- Indices for Query Optimizations
---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_properties_community ON public.properties(community_id);
CREATE INDEX IF NOT EXISTS idx_properties_developer ON public.properties(developer_id);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON public.properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(is_featured) WHERE is_featured = TRUE;

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(is_published) WHERE is_published = TRUE;
