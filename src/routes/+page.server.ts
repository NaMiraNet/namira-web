import type { PageServerLoad } from './$types';
import axios from 'axios';
import { getAndDecryptLinks } from '$lib/server/serverUtils';

export const load: PageServerLoad = async () => {
	try {
		const jobResult = await getAndDecryptLinks();
		return { data: jobResult, error: null };
	} catch (err: unknown) {
		console.error(err);
		let message = 'خطای غیر منتظره. لطفا مجدد تلاش کنید.';
		if (axios.isAxiosError(err)) {
			if (err.response?.status === 404) {
				message = 'لیست دریافت نشد. اتصال خود را به اینترنت بررسی کنید.';
			} else {
				message = 'پاسخی از سرور دریافت نشد.';
			}
		}
		return { results: null, error: message };
	}
};
