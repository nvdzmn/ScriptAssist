export function SectionPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <main className="page">
      <header className="section-intro">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
    </main>
  );
}
