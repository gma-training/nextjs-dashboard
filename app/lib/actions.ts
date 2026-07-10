'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(form: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: form.get("customerId"),
    amount: form.get("amount"),
    status: form.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.error(error); // not good practice in production, but useful now
    return {
      message: "Database error: failed to create invoice"
    }
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, form: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: form.get("customerId"),
    amount: form.get("amount"),
    status: form.get("status"),
  })
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `
  } catch (error) {
    console.error(error); // not good practice in production, but useful now
    return {
      message: "Database error: failed to update invoice"
    }
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}
