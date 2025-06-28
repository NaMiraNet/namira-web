import { getAndDecryptLinks } from '$lib/server/serverUtils';

export async function GET({ url }: { url: URL }) {
	try {
		const data = await getAndDecryptLinks();

		const country = url.searchParams.get('country');
		const protocol = url.searchParams.get('protocol');

		if (country) {
			const countries = country.split(',').map((country) => country.toLowerCase());
			data.results = data.results.filter((result) =>
				countries.includes(result.country_code.toLowerCase())
			);
		}
		if (protocol) {
			const protocols = protocol.split(',').map((protocol) => protocol.toLowerCase());
			data.results = data.results.filter((result) =>
				protocols.includes(result.protocol.toLowerCase())
			);
		}

		return new Response(data.results.map((result) => result.raw_config).join('\n'), {
			headers: { 'Content-Type': 'text/plain' }
		});
	} catch (error) {
		console.error(error);
		return new Response(null, { status: 500 });
	}
}
