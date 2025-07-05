<script lang="ts">
	import { fade } from 'svelte/transition';
	import Navbar from '../../components/navbar.svelte';

	import { page } from '$app/state';
	import type { TestResult } from '$lib/types';
	import MultiSelect from '../../components/multiSelect.svelte';

	type AccordionState = {
		android: boolean;
		ios: boolean;
		pc: boolean;
		links: boolean;
		copied: boolean;
		protocols: string[];
		countries: string[];
	};

	type SubState = {
		accordion: AccordionState;
	};

	const VALID_PROTOCOLS: TestResult['protocol'][] = ['vmess', 'vless', 'trojan', 'ss'];

	const VALID_COUNTRY_CODES: { [countryName: string]: string } = {
		افغانستان: 'af',
		آلبانی: 'al',
		الجزایر: 'dz',
		'ساموآی آمریکا': 'as',
		آندورا: 'ad',
		آنگولا: 'ao',
		آنگویلا: 'ai',
		جنوبگان: 'aq',
		'آنتیگوا و باربودا': 'ag',
		آرژانتین: 'ar',
		ارمنستان: 'am',
		آروبا: 'aw',
		استرالیا: 'au',
		اتریش: 'at',
		'جمهوری آذربایجان': 'az',
		باهاما: 'bs',
		بحرین: 'bh',
		بنگلادش: 'bd',
		باربادوس: 'bb',
		بلاروس: 'by',
		بلژیک: 'be',
		بلیز: 'bz',
		بنین: 'bj',
		برمودا: 'bm',
		بوتان: 'bt',
		بولیوی: 'bo',
		'بوسنی و هرزگوین': 'ba',
		بوتسوانا: 'bw',
		برزیل: 'br',
		برونئی: 'bn',
		بلغارستان: 'bg',
		بورکینافاسو: 'bf',
		بوروندی: 'bi',
		کامبوج: 'kh',
		کامرون: 'cm',
		کانادا: 'ca',
		'کیپ ورد': 'cv',
		'جمهوری آفریقای مرکزی': 'cf',
		چاد: 'td',
		شیلی: 'cl',
		چین: 'cn',
		کلمبیا: 'co',
		کومور: 'km',
		کنگو: 'cg',
		'جمهوری دموکراتیک کنگو': 'cd',
		کاستاریکا: 'cr',
		'ساحل عاج': 'ci',
		کرواسی: 'hr',
		کوبا: 'cu',
		قبرس: 'cy',
		'جمهوری چک': 'cz',
		دانمارک: 'dk',
		جیبوتی: 'dj',
		دومینیکا: 'dm',
		'جمهوری دومینیکن': 'do',
		اکوادور: 'ec',
		مصر: 'eg',
		السالوادور: 'sv',
		'گینه استوایی': 'gq',
		اریتره: 'er',
		استونی: 'ee',
		اسواتینی: 'sz',
		اتیوپی: 'et',
		فیجی: 'fj',
		فنلاند: 'fi',
		فرانسه: 'fr',
		گابن: 'ga',
		گامبیا: 'gm',
		گرجستان: 'ge',
		آلمان: 'de',
		غنا: 'gh',
		یونان: 'gr',
		گرنادا: 'gd',
		گواتمالا: 'gt',
		گینه: 'gn',
		'گینه بیسائو': 'gw',
		گویان: 'gy',
		هائیتی: 'ht',
		هندوراس: 'hn',
		مجارستان: 'hu',
		ایسلند: 'is',
		هند: 'in',
		اندونزی: 'id',
		ایران: 'ir',
		عراق: 'iq',
		ایرلند: 'ie',
		اسرائیل: 'il',
		ایتالیا: 'it',
		جامائیکا: 'jm',
		ژاپن: 'jp',
		اردن: 'jo',
		قزاقستان: 'kz',
		کنیا: 'ke',
		کیریباتی: 'ki',
		'کره شمالی': 'kp',
		'کره جنوبی': 'kr',
		کویت: 'kw',
		قرقیزستان: 'kg',
		لائوس: 'la',
		لتونی: 'lv',
		لبنان: 'lb',
		لسوتو: 'ls',
		لیبریا: 'lr',
		لیبی: 'ly',
		لیختن‌اشتاین: 'li',
		لیتوانی: 'lt',
		لوکزامبورگ: 'lu',
		'مقدونیه شمالی': 'mk',
		ماداگاسکار: 'mg',
		مالاوی: 'mw',
		مالزی: 'my',
		مالدیو: 'mv',
		مالی: 'ml',
		مالت: 'mt',
		'جزایر مارشال': 'mh',
		موریتانی: 'mr',
		موریس: 'mu',
		مکزیک: 'mx',
		میکرونزی: 'fm',
		مولداوی: 'md',
		موناکو: 'mc',
		مغولستان: 'mn',
		مونته‌نگرو: 'me',
		مراکش: 'ma',
		موزامبیک: 'mz',
		میانمار: 'mm',
		نامیبیا: 'na',
		نائورو: 'nr',
		نپال: 'np',
		هلند: 'nl',
		نیوزیلند: 'nz',
		نیکاراگوئه: 'ni',
		نیجر: 'ne',
		نیجریه: 'ng',
		نروژ: 'no',
		عمان: 'om',
		پاکستان: 'pk',
		پالائو: 'pw',
		پاناما: 'pa',
		'پاپوآ گینه نو': 'pg',
		پاراگوئه: 'py',
		پرو: 'pe',
		فیلیپین: 'ph',
		لهستان: 'pl',
		پرتغال: 'pt',
		قطر: 'qa',
		رومانی: 'ro',
		روسیه: 'ru',
		رواندا: 'rw',
		'سنت کیتس و نویس': 'kn',
		'سنت لوسیا': 'lc',
		'سنت وینسنت و گرنادین‌ها': 'vc',
		ساموآ: 'ws',
		'سان مارینو': 'sm',
		'سائوتومه و پرینسیپ': 'st',
		'عربستان سعودی': 'sa',
		سنگال: 'sn',
		صربستان: 'rs',
		سیشل: 'sc',
		سیرالئون: 'sl',
		سنگاپور: 'sg',
		اسلواکی: 'sk',
		اسلوونی: 'si',
		'جزایر سلیمان': 'sb',
		سومالی: 'so',
		'آفریقای جنوبی': 'za',
		'سودان جنوبی': 'ss',
		اسپانیا: 'es',
		سری‌لانکا: 'lk',
		سودان: 'sd',
		سورینام: 'sr',
		سوئد: 'se',
		سوئیس: 'ch',
		سوریه: 'sy',
		تایوان: 'tw',
		تاجیکستان: 'tj',
		تانزانیا: 'tz',
		تایلند: 'th',
		'تیمور شرقی': 'tl',
		توگو: 'tg',
		تونگا: 'to',
		'ترینیداد و توباگو': 'tt',
		تونس: 'tn',
		ترکیه: 'tr',
		ترکمنستان: 'tm',
		تووالو: 'tv',
		اوگاندا: 'ug',
		اوکراین: 'ua',
		'امارات متحده عربی': 'ae',
		بریتانیا: 'gb',
		'ایالات متحده آمریکا': 'us',
		اروگوئه: 'uy',
		ازبکستان: 'uz',
		وانواتو: 'vu',
		ونزوئلا: 've',
		ویتنام: 'vn',
		یمن: 'ye',
		زامبیا: 'zm',
		زیمبابوه: 'zw'
	};

	const state = $state<SubState>({
		accordion: {
			android: false,
			ios: false,
			pc: false,
			links: false,
			copied: false,
			protocols: [],
			countries: []
		}
	});
	function btoaUtf8(str: string): string {
		return btoa(unescape(encodeURIComponent(str)));
	}
	const subLink = $derived.by(() => {
		const baseUrl = `${page.url.origin}/api/subscription?sort=1`;
		const params = new URLSearchParams();

		if (state.accordion.protocols.length > 0) {
			params.set('protocol', state.accordion.protocols.join(','));
		}

		if (state.accordion.countries.length > 0) {
			const countryCodes = state.accordion.countries.map((pr) => VALID_COUNTRY_CODES[pr]);
			params.set('country', countryCodes.join(','));
		}

		return `${baseUrl}${params.toString()}`;
	});
</script>

<Navbar></Navbar>

<div class="mb-16 flex w-screen justify-center">
	<div class="w-full max-w-4xl px-4 py-12">
		<div class="text-center">
			<div class="flex flex-row items-center justify-center gap-6">
				<img src="/logo.jpeg" class="size-16 rounded-full sm:size-18 lg:size-20" alt="" />
				<h1 class="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">نامیرا نت</h1>
			</div>
			<br />
			<h1 class="text-lg font-semibold text-white sm:text-xl lg:text-2xl">لینک اشتراک</h1>
		</div>
		<br />
		<div class="mb-24 flex flex-col gap-4 rounded-lg bg-white p-4 text-justify leading-7">
			<p class="text-center text-lg font-bold">تنظیمات خود را انتخاب کنید</p>

			<MultiSelect
				options={Object.keys(VALID_COUNTRY_CODES)}
				bind:selected={state.accordion.countries}
				placeholder="کشورها را انتخاب کنید"
				class="z-20 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500"
			/>
			<MultiSelect
				options={VALID_PROTOCOLS}
				bind:selected={state.accordion.protocols}
				placeholder="پروتکل‌ها را انتخاب کنید"
				class="rounded-lg bg-gradient-to-br from-sky-400 to-blue-500"
			/>

			<h1 class="text-center text-lg font-bold">پلتفرم خود را انتخاب کنید</h1>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex w-full flex-col rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 p-2 text-white"
				onclick={() => {
					state.accordion.android = !state.accordion.android;
				}}
			>
				<div class="flex w-full flex-row items-center justify-between">
					<div class="flex flex-row items-center justify-center gap-2">
						<img src="/android.svg" alt="Android Logo" class="h-7" />
						<p class="text-lg font-semibold">اندروید</p>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6 transform transition-transform duration-300"
						class:rotate-180={state.accordion.android}
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75 12 8.25l7.5 7.5">
						</path></svg
					>
				</div>
				{#if state.accordion.android}
					<div class="mt-3 flex flex-col items-center gap-2 p-2">
						<p class="font-bold">برنامه خود را انتخاب کنید</p>
						<a
							href={`v2rayng://install-config?url=${subLink}`}
							class="w-full rounded-lg bg-white py-2 text-center text-gray-700">افزودن به V2rayNG</a
						>
						<a
							href={`sn://subscription?url=${subLink}`}
							class="w-full rounded-lg bg-white py-2 text-center text-gray-700">افزودن به Nekobox</a
						>
					</div>
				{/if}
			</div>

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex w-full flex-col rounded-lg bg-gradient-to-br from-indigo-300 via-purple-400 to-pink-300 p-2 text-white"
				onclick={() => {
					state.accordion.ios = !state.accordion.ios;
				}}
			>
				<div class="flex w-full flex-row items-center justify-between">
					<div class="flex flex-row items-center justify-center gap-2">
						<img src="/apple.svg" alt="Android Logo" class="h-7" />
						<p class="text-lg font-semibold">آیفون <span class="lang-en">(iOS)</span></p>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6 transform transition-transform duration-300"
						class:rotate-180={state.accordion.ios}
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75 12 8.25l7.5 7.5">
						</path></svg
					>
				</div>
				{#if state.accordion.ios}
					<div class="mt-3 flex flex-col items-center gap-2 p-2">
						<p class="font-bold">برنامه خود را انتخاب کنید</p>
						<a
							href={`streisand://import/${subLink}`}
							class="w-full rounded-lg bg-white py-2 text-center text-gray-700"
							>افزودن به Streisand</a
						>
						<a
							href={`sub://${btoaUtf8(subLink ?? '')}`}
							class="w-full rounded-lg bg-white py-2 text-center text-gray-700"
							>افزودن به Shadowrocket</a
						>
					</div>
				{/if}
			</div>

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex w-full flex-col rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 p-2 text-white"
				onclick={() => {
					state.accordion.pc = !state.accordion.pc;
				}}
			>
				<div class="flex w-full flex-row items-center justify-between">
					<div class="flex flex-row items-center justify-center gap-2">
						<img src="/pc.svg" alt="Android Logo" class="h-7" />
						<p class="text-lg font-semibold">مک/ویندوز/لینوکس</p>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6 transform transition-transform duration-300"
						class:rotate-180={state.accordion.pc}
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75 12 8.25l7.5 7.5">
						</path></svg
					>
				</div>
				{#if state.accordion.pc}
					<div class="w-full p-4 pb-2">
						<button
							dir="ltr"
							class="flex w-full flex-row items-center justify-between gap-2 rounded-lg bg-gray-100 p-2 text-gray-700"
							class:border-green-300={state.accordion.copied}
							class:text-green-700={state.accordion.copied}
							class:bg-green-100={state.accordion.copied}
							onclick={async (event: MouseEvent) => {
								event.stopPropagation();
								state.accordion.copied = true;
								try {
									await navigator.clipboard.writeText(subLink ?? '');
									setTimeout(() => (state.accordion.copied = false), 5000);
								} catch (err) {
									console.error('Failed to copy:', err);
								}
							}}
						>
							{#if state.accordion.copied}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-4"
									in:fade
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-4"
									in:fade
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
									/>
								</svg>{/if}

							{#if state.accordion.copied}
								<p>کپی شد</p>
							{:else}
								<p>کپی کردن لینک اشتراک</p>
							{/if}
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
