import { auth } from '@/auth';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const image = request.body;
  if (image) {
    const blob = await put(name ?? 'image', image, {
      access: 'public',
      addRandomSuffix: true,
    });

    return new Response(blob.url, { status: 200 });
  } else {
    return new Response('No image provided', { status: 400 });
  }
}
