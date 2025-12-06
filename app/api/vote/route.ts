export async function POST(req: Request) {
  const body = await req.json();

  await fetch(process.env.NEXT_PUBLIC_API_GATEWAY_URL + '/vote', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  return Response.json({ ok: true });
}
