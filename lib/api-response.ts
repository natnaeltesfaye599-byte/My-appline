import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function problem(status: number, message: string, details?: unknown) {
  return NextResponse.json({ error: { message, details } }, { status });
}

export function validationProblem(error: ZodError | { message: string }) {
  if (error instanceof ZodError) {
    return problem(422, "Validation failed", error.flatten());
  }
  return problem(422, error.message);
}

export function notFound(message = "Resource not found") {
  return problem(404, message);
}

export function serverError(message = "Internal server error") {
  return problem(500, message);
}

