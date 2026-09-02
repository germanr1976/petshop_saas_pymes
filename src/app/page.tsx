import { listProductsByTenant } from '@/services/products/product-service';

type ProductSummary = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number | string;
};

export default async function HomePage() {
  const products = (await listProductsByTenant('tenant-demo')) as unknown as ProductSummary[];

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              SaaS Pet Shops
            </p>
            <h1 className="mt-2 text-3xl font-bold">Panel administrativo</h1>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Productos</p>
            <p className="mt-2 text-3xl font-bold">{products.length}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Tenants</p>
            <p className="mt-2 text-3xl font-bold">1</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Stock total</p>
            <p className="mt-2 text-3xl font-bold">{products.reduce<number>((sum, product) => sum + product.stock, 0)}</p>
          </div>
        </section>

        <section className="mt-10 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-xl font-semibold">Productos del tenant</h2>

          <div className="space-y-3">
            {products.length === 0 ? (
              <p className="text-slate-500">No hay productos aún.</p>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(product.price).toFixed(2)}</p>
                    <p className="text-sm text-slate-500">Stock: {product.stock}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
