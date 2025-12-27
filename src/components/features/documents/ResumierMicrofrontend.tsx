export function ResumierMicrofrontend() {
  const resumierUrl = import.meta.env.VITE_RESUMIER_URL as string | undefined;

  if (!resumierUrl) {
    return (
      <div className="flex h-full min-h-[60vh] w-full items-center justify-center p-8">
        <div className="max-w-xl text-center text-sm text-muted-foreground">
          <h1 className="mb-2 text-lg font-semibold text-foreground">Resumier microfrontend</h1>
          <p>
            Set <code className="rounded bg-muted px-1 py-0.5">VITE_RESUMIER_URL</code> to
            load the Resumier microfrontend in the documents page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <iframe
        title="Resumier microfrontend"
        src={resumierUrl}
        className="h-full min-h-[80vh] w-full border-0"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
