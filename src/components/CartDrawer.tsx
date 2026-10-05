import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCart, selectTotal } from "../store/cart";
import { buildWhatsAppUrl, type OrderForm } from "../lib/whatsapp";
import { money } from "../lib/format";

const field =
  "w-full rounded-xl border border-line bg-card px-4 py-3 text-base text-ink placeholder:text-muted";

export default function CartDrawer() {
  const { items, open, setOpen, setQty, clear } = useCart();
  const total = useCart(selectTotal);
  const [form, setForm] = useState<OrderForm>({
    name: "",
    mode: "retiro",
    address: "",
    notes: "",
  });
  const [error, setError] = useState("");

  if (!open) return null;

  const send = () => {
    if (!form.name.trim()) return setError("Ingresá tu nombre.");
    if (form.mode === "envio" && !form.address.trim())
      return setError("Ingresá la dirección de entrega.");
    setError("");
    window.open(buildWhatsAppUrl(items, form, total), "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-stretch sm:justify-end"
      onClick={() => setOpen(false)}
    >
      <aside
        role="dialog"
        aria-label="Tu pedido"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full flex-col rounded-t-3xl border-t-4 border-brand bg-bg sm:max-h-none sm:max-w-md sm:rounded-none sm:border-l-4 sm:border-t-0"
      >
        <header className="flex items-center justify-between px-5 pb-2 pt-5">
          <h2 className="font-display text-3xl uppercase text-brand">
            Tu pedido
          </h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-card"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <p className="text-muted">
              Todavía no agregaste nada. Elegí algo del menú.
            </p>
          ) : (
            <>
              <ul className="space-y-2">
                {items.map((i) => (
                  <li
                    key={i.key}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold leading-tight">{i.name}</p>
                      <p className="text-sm leading-tight text-muted">
                        {[i.variant, i.options].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-1 font-display text-lg text-brand">
                        {money(i.price * i.qty)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQty(i.key, i.qty - 1)}
                        aria-label="Quitar uno"
                        className="grid h-8 w-8 place-items-center rounded-full border border-line"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-5 text-center font-bold">{i.qty}</span>
                      <button
                        onClick={() => setQty(i.key, i.qty + 1)}
                        aria-label="Agregar uno"
                        className="grid h-8 w-8 place-items-center rounded-full bg-brand text-bg"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <input
                  className={field}
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-1 rounded-full border border-line bg-card p-1">
                  {(["retiro", "envio"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setForm({ ...form, mode: m })}
                      className={`rounded-full py-2 text-sm font-bold ${form.mode === m ? "bg-brand text-bg" : ""}`}
                    >
                      {m === "retiro"
                        ? "Retiro en el local"
                        : "Envío a domicilio"}
                    </button>
                  ))}
                </div>
                {form.mode === "envio" && (
                  <input
                    className={field}
                    placeholder="Dirección de entrega"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                )}
                <textarea
                  className={field}
                  rows={2}
                  placeholder="Aclaraciones (opcional)"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <footer className="space-y-2 border-t border-line px-5 pb-5 pt-4">
            {error && (
              <p role="alert" className="text-sm font-bold text-red-400">
                {error}
              </p>
            )}
            <div className="flex items-baseline justify-between">
              <span className="font-bold">Total</span>
              <span className="font-display text-3xl text-brand">
                {money(total)}
              </span>
            </div>
            <button
              onClick={send}
              className="w-full rounded-full bg-brand py-3.5 text-lg font-bold text-bg active:scale-[0.98]"
            >
              Enviar pedido por WhatsApp
            </button>
            <button
              onClick={clear}
              className="w-full py-1 text-sm text-muted underline"
            >
              Vaciar pedido
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
