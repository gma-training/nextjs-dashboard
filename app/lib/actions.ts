'use server';

export async function createInvoice(form: FormData) {
  const attributes = {
    customerId: form.get("customerId"),
    amount: form.get("amount"),
    status: form.get("status"),
  }
  console.log(attributes);
}
