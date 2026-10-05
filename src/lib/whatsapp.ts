import type { CartItem } from "../store/cart";
import { money } from "./format";

const WHATSAPP_NUMBER = "5491151476452"; // 54 + 9 + 11 51476452

export type OrderForm = {
  name: string;
  mode: "envio" | "retiro";
  address: string;
  notes: string;
};

export function buildWhatsAppUrl(
  items: CartItem[],
  form: OrderForm,
  total: number,
) {
  const lines = items.map((i) => {
    const detail = [i.variant, i.options].filter(Boolean).join(" · ");
    return `• ${i.qty}x ${i.name}${detail ? ` (${detail})` : ""} — ${money(i.price * i.qty)}`;
  });

  const text = [
    "*Nuevo pedido - Restaurant*",
    "",
    ...lines,
    "",
    `*Total: ${money(total)}*`,
    "",
    `Nombre: ${form.name}`,
    form.mode === "envio" ? `Envío a: ${form.address}` : "Retira en el local",
    form.notes ? `Aclaraciones: ${form.notes}` : "",
  ]
    .filter((l, idx, arr) => l !== "" || arr[idx - 1] !== "")
    .join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
