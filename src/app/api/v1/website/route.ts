export async function GET() {
  return Response.json({
    status: 200,
    json: {
      title: null,
      description: null,
    },
  })
}
