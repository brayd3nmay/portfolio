export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-24">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-neutral-600">Sorry, the page you’re looking for doesn’t exist.</p>
      <p className="mt-4">
        <a className="underline" href="/">Go back home</a>
      </p>
    </main>
  );
}

