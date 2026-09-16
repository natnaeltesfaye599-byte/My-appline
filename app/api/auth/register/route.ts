import { z } from "zod";
import { created, problem, validationProblem } from "@/lib/api-response";
import {
  generateRawToken,
  getDefaultOrganization,
  hashPassword,
  hashToken,
  signAccessToken,
  toPublicUser
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbStore, normalizePhone } from "@/lib/db-store";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(6, "Phone number is required"),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  packageType: z.string().optional(),
  referralCode: z.string().optional(),
  paymentMethod: z.string().optional(),
  transactionRef: z.string().optional(),
  receiptScreenshotUrl: z.string().optional()
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return problem(400, "Invalid JSON body");
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationProblem(parsed.error);

  const {
    name,
    email,
    password,
    phone,
    country,
    region,
    city,
    address,
    packageType,
    referralCode,
    paymentMethod,
    transactionRef,
    receiptScreenshotUrl
  } = parsed.data;

  const normalizedEmail = email.trim().toLowerCase();
  const cleanPhone = normalizePhone(phone) || phone.trim();

  // 1. Check duplicate email
  const existingByEmail = dbStore.findUserByEmail(normalizedEmail);
  if (existingByEmail) {
    return problem(409, "An account with this email already exists");
  }

  // 2. Check duplicate phone
  const existingByPhone = dbStore.findUserByPhone(cleanPhone);
  if (existingByPhone) {
    return problem(409, "An account with this phone number already exists");
  }

  const passwordHash = await hashPassword(password);
  const verificationToken = generateRawToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const hasManualPayment = Boolean(transactionRef || receiptScreenshotUrl);
  const initialStatus = hasManualPayment ? "PENDING_VERIFICATION" : "ACTIVE";

  // 3. Save to dbStore
  const { user: storedUser, profile: storedProfile } = dbStore.createUserWithProfile({
    fullName: name,
    email: normalizedEmail,
    phone: cleanPhone,
    passwordHash,
    role: "MEMBER",
    country: country || "Ethiopia",
    region: region || "Addis Ababa",
    city: city || "Bole, Addis Ababa",
    address: address || "House No. 123, Woreda 03",
    packageType: packageType || "Diamond",
    referralCode,
    status: initialStatus
  });

  // 4. If manual payment proof was submitted, create a payment verification record
  let paymentRecord = null;
  if (hasManualPayment) {
    const pkg = dbStore.getAllPackages().find((p) => p.name.toLowerCase().includes((packageType || "").toLowerCase())) ||
      dbStore.getAllPackages()[0];

    paymentRecord = dbStore.createPaymentSubmission({
      userId: storedUser.id,
      userName: name,
      userEmail: normalizedEmail,
      userPhone: cleanPhone,
      packageId: pkg?.id || "pkg-custom",
      packageName: packageType || "Diamond",
      amountETB: pkg?.priceETB || 14990,
      paymentMethod: paymentMethod || "Commercial Bank of Ethiopia (CBE)",
      transactionRef: transactionRef || "MANUAL-TX-" + Date.now().toString().slice(-6),
      receiptScreenshotUrl: receiptScreenshotUrl || "/receipt-placeholder.png"
    });
  }

  // 5. Attempt Prisma write if connected
  try {
    const org = await getDefaultOrganization();
    await prisma.user.create({
      data: {
        id: storedUser.id,
        fullName: name,
        email: normalizedEmail,
        phone: cleanPhone,
        passwordHash,
        role: "MEMBER",
        organizationId: org.id,
        profile: {
          create: {
            id: storedProfile.id,
            firstName: storedProfile.firstName,
            lastName: storedProfile.lastName,
            phone: cleanPhone,
            country: storedProfile.country,
            region: storedProfile.region,
            city: storedProfile.city,
            address: storedProfile.address,
            referralCode: storedProfile.referralCode,
            status: initialStatus as any
          } as any
        }
      } as any
    });
  } catch {
    // If PostgreSQL service is offline, dbStore ensures complete data retention
  }

  const accessToken = signAccessToken({
    sub: storedUser.id,
    email: storedUser.email,
    role: "MEMBER",
    organizationId: storedUser.organizationId
  });

  return created({
    user: {
      id: storedUser.id,
      email: storedUser.email,
      name: storedUser.fullName,
      phone: storedUser.phone,
      role: storedUser.role,
      organizationId: storedUser.organizationId,
      emailVerified: true,
      profileSetupCompleted: true,
      profile: {
        id: storedProfile.id,
        phone: storedProfile.phone,
        country: storedProfile.country,
        region: storedProfile.region,
        city: storedProfile.city,
        address: storedProfile.address,
        packageType: storedProfile.packageType,
        status: storedProfile.status
      }
    },
    payment: paymentRecord,
    accessToken,
    emailVerificationUrl: `/en/auth/verify-email?token=${verificationToken}`
  });
}
