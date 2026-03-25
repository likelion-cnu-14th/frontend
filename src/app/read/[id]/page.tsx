export default async function Read({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <h2>Read</h2>
      <p>{id}</p>
    </>
  );
}