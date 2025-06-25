import { getAndDecryptLinks } from '$lib/server/serverUtils';

export async function GET() {
	try {
		const data = await getAndDecryptLinks();
		return new Response(data.results.map((result) => result.raw_config).join('\n'), {
			headers: { 'Content-Type': 'text/plain' }
		});
	} catch (error) {
		console.error(error);
		return new Response(null, { status: 500 });
	}
}
