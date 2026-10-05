import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { menu } from "./data/menu";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import { useCart, selectCount, selectTotal } from "./store/cart";
import { money } from "./lib/format";

export default function App() {
  const count = useCart(selectCount);
  const total = useCart(selectTotal);
  const setOpen = useCart((s) => s.setOpen);
  const [active, setActive] = useState(menu[0].id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-20% 0px -70% 0px" },
    );
    menu.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document
      .querySelector(`[data-nav="${active}"]`)
      ?.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: "smooth",
      });
  }, [active]);

  return (
    <>
      <header className="border-t-4 border-brand bg-gradient-to-b from-brand/10 to-transparent px-4 pb-5 pt-5">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl leading-none text-brand">
              Play Mila
            </h1>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Elegí lo que se te antoja, deslizá, mirá las fotos y mandá tu
              pedido por WhatsApp.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label={`Ver pedido, ${count} productos`}
            className="relative mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-card"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-bold text-bg">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <nav className="sticky top-0 z-30 border-y border-line bg-bg/95 backdrop-blur-sm">
        <ul className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          {menu.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                data-nav={c.id}
                className={`block whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${
                  active === c.id
                    ? "border-brand bg-brand text-bg"
                    : "border-line bg-card text-ink"
                }`}
              >
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto max-w-6xl px-4 pb-32">
        {menu.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-16 pt-8">
            <h2 className="font-display text-3xl uppercase leading-none text-brand sm:text-4xl">
              {c.name}
            </h2>
            <div className="mb-4 mt-2 h-px bg-gradient-to-r from-brand to-transparent" />

            {/* Celular: carrusel horizontal. Desde md: grilla. */}
            <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4">
              {c.products.map((p) => (
                <div
                  key={p.id}
                  className="w-[72%] max-w-[270px] shrink-0 snap-start md:w-auto md:max-w-none"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {count > 0 && (
        <button
          onClick={() => setOpen(true)}
          className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between rounded-full bg-brand py-3 pl-6 pr-5 text-bg shadow-xl shadow-black/50 active:scale-[0.98]"
        >
          <span className="font-bold">Ver pedido · {count}</span>
          <span className="font-display text-xl">{money(total)}</span>
        </button>
      )}

      <CartDrawer />
    </>
  );
}
