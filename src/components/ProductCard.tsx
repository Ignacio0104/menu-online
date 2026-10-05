import { useState } from "react";
import { Plus } from "lucide-react";
import type { Product } from "../data/menu";
import { useCart } from "../store/cart";
import { money } from "../lib/format";

function Pills({
  items,
  value,
  onChange,
  label,
}: {
  items: string[];
  value: number;
  onChange: (i: number) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex flex-wrap gap-1.5"
    >
      {items.map((it, i) => (
        <button
          key={it}
          role="radio"
          aria-checked={value === i}
          onClick={() => onChange(i)}
          className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
            value === i
              ? "border-brand bg-brand text-bg"
              : "border-line text-ink"
          }`}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [variantIdx, setVariantIdx] = useState(0);
  const [chosen, setChosen] = useState<Record<string, string>>(
    Object.fromEntries(
      (product.options ?? []).map((o) => [o.label, o.choices[0]]),
    ),
  );
  const [imgOk, setImgOk] = useState(true);

  const variant = product.variants[variantIdx];
  const optionsText = Object.values(chosen).join(", ");

  const handleAdd = () =>
    add({
      key: [product.id, variant.label, optionsText].join("|"),
      name: product.name,
      variant: product.variants.length > 1 ? variant.label : undefined,
      options: optionsText || undefined,
      price: variant.price,
    });

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card">
      <div className="aspect-[4/3] bg-gradient-to-br from-brand/25 to-transparent">
        {imgOk ? (
          <img
            src={product.image ?? `/img/${product.id}.jpg`}
            alt={product.name}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="grid h-full w-full place-items-center font-display text-6xl text-brand/40"
          >
            {product.name[0]}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div>
          <h3 className="font-bold leading-tight">{product.name}</h3>
          {product.description && (
            <p className="mt-1 line-clamp-3 text-sm leading-snug text-muted">
              {product.description}
            </p>
          )}
        </div>

        {product.variants.length > 4 ? (
          <select
            aria-label="Presentación"
            value={variantIdx}
            onChange={(e) => setVariantIdx(Number(e.target.value))}
            className="w-full rounded-lg border border-line bg-bg px-2 py-2 text-xs font-bold"
          >
            {product.variants.map((vr, i) => (
              <option key={vr.label} value={i}>
                {vr.label}
              </option>
            ))}
          </select>
        ) : (
          product.variants.length > 1 && (
            <Pills
              label="Presentación"
              items={product.variants.map((x) => x.label)}
              value={variantIdx}
              onChange={setVariantIdx}
            />
          )
        )}

        {product.options?.map((o) => (
          <Pills
            key={o.label}
            label={o.label}
            items={o.choices}
            value={o.choices.indexOf(chosen[o.label])}
            onChange={(i) => setChosen({ ...chosen, [o.label]: o.choices[i] })}
          />
        ))}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="font-display text-2xl leading-none text-brand">
            {money(variant.price)}
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 rounded-full bg-brand px-4 py-2 text-sm font-bold text-bg transition-transform active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
