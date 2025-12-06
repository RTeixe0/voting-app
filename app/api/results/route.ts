export async function GET() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_GATEWAY_URL + '/results');
  const data = await res.json();

  return Response.json(data);
}
