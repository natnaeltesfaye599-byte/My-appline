import { z } from "zod";
import { created, ok, validationProblem } from "@/lib/api-response";

const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  trainerId: z.string()
});

export async function GET() {
  return ok({
    courses: [
      {
        id: "course_001",
        title: "Leadership Fundamentals",
        lessons: 12,
        students: 149,
        completionRate: 78,
        status: "PUBLISHED"
      }
    ]
  });
}

export async function POST(request: Request) {
  const parsed = courseSchema.safeParse(await request.json());
  if (!parsed.success) return validationProblem(parsed.error);

  return created({ id: crypto.randomUUID(), status: "DRAFT", ...parsed.data });
}
