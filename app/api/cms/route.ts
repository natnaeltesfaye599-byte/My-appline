import { z } from "zod";
import { NextRequest } from "next/server";
import { ok, validationProblem, serverError } from "@/lib/api-response";
import { dbStore } from "@/lib/db-store";

const heroUpdateSchema = z.object({
  badgeText: z.string().optional(),
  announcement: z.string().optional(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  primaryCtaText: z.string().optional(),
  primaryCtaLink: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  stats: z.object({
    activeMembers: z.number().optional(),
    monthlyVolumeETB: z.number().optional(),
    coursesCompleted: z.number().optional(),
    countriesActive: z.number().optional()
  }).optional()
});

const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  role: z.string().min(2),
  story: z.string().min(10),
  initials: z.string().min(1).max(3),
  rating: z.number().min(1).max(5),
  location: z.string().optional()
});

const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(5),
  answer: z.string().min(10),
  category: z.string().min(2),
  order: z.number().int().min(0).optional().default(99)
});

const footerLinkSchema = z.object({
  label: z.string(),
  labelAm: z.string().optional(),
  href: z.string()
});

const socialLinksSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  telegram: z.string().optional(),
  whatsapp: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional()
});

const footerUpdateSchema = z.object({
  brandDescription: z.string().optional(),
  brandDescriptionAmharic: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  telegramChannelOrUser: z.string().optional(),
  officeAddress: z.string().optional(),
  officeAddressAmharic: z.string().optional(),
  workingHours: z.string().optional(),
  workingHoursAmharic: z.string().optional(),
  socialLinks: socialLinksSchema.optional(),
  platformLinks: z.array(footerLinkSchema).optional(),
  companyLinks: z.array(footerLinkSchema).optional(),
  copyrightText: z.string().optional(),
  copyrightTextAmharic: z.string().optional(),
  securityBadgeText: z.string().optional()
});

const cmsUpdateSchema = z.object({
  section: z.enum(["hero", "testimonial", "faq", "footer"]),
  action: z.enum(["update", "create", "delete"]).optional().default("update"),
  hero: heroUpdateSchema.optional(),
  testimonial: testimonialSchema.optional(),
  faq: faqSchema.optional(),
  footer: footerUpdateSchema.optional(),
  deleteId: z.string().optional()
});

export async function GET() {
  try {
    const cms = dbStore.getCmsContent();
    return ok({ cms });
  } catch {
    return serverError("Failed to fetch CMS content");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = cmsUpdateSchema.safeParse(body);
    if (!parsed.success) return validationProblem(parsed.error);

    const { section, action, hero, testimonial, faq, footer, deleteId } = parsed.data;

    if (section === "hero" && hero) {
      const updated = dbStore.updateHero(hero);
      return ok({ hero: updated });
    }

    if (section === "footer" && footer) {
      const updated = dbStore.updateFooter(footer);
      return ok({ footer: updated });
    }

    if (section === "testimonial") {
      if (action === "delete" && deleteId) {
        const deleted = dbStore.deleteTestimonial(deleteId);
        return ok({ deleted, message: "Testimonial removed" });
      }
      if (action === "create" && testimonial) {
        const { id: _id, ...params } = testimonial;
        const created = dbStore.createTestimonial(params);
        return ok({ testimonial: created });
      }
      if (action === "update" && testimonial?.id) {
        const { id, ...updates } = testimonial;
        const updated = dbStore.updateTestimonial(id, updates);
        return ok({ testimonial: updated });
      }
    }

    if (section === "faq") {
      if (action === "delete" && deleteId) {
        const deleted = dbStore.deleteFaq(deleteId);
        return ok({ deleted, message: "FAQ removed" });
      }
      if (action === "create" && faq) {
        const { id: _id, ...params } = faq;
        const created = dbStore.createFaq(params);
        return ok({ faq: created });
      }
      if (action === "update" && faq?.id) {
        const { id, ...updates } = faq;
        const updated = dbStore.updateFaq(id, updates);
        return ok({ faq: updated });
      }
    }

    return validationProblem({ message: "Invalid CMS update payload" } as never);
  } catch {
    return serverError("Failed to update CMS content");
  }
}
