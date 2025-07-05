<script lang="ts">
	let {
		options = [],
		selected = $bindable([]),
		placeholder = 'انتخاب...',
		class: className = ''
	}: {
		options: string[];
		selected: string[];
		placeholder: string;
		class: string;
	} = $props();

	let search = $state('');
	let isOpen = $state(false);
	let highlightedIndex = $state(-1);

	function toggleOption(option: string) {
		if (selected.includes(option)) {
			selected = selected.filter((o) => o !== option);
		} else {
			selected.push(option);
		}
		console.log(selected);
		search = '';
		highlightedIndex = -1;
	}

	function removeOption(option: string) {
		selected = selected.filter((o) => o !== option);
	}

	function isSelected(option: string) {
		return selected.includes(option);
	}

	const filteredOptions = $derived(
		options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()))
	);

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Backspace' && search === '' && selected.length > 0) {
			selected.pop();
		} else if (event.key === 'ArrowDown') {
			highlightedIndex = (highlightedIndex + 1) % filteredOptions.length;
			event.preventDefault();
		} else if (event.key === 'ArrowUp') {
			highlightedIndex = (highlightedIndex - 1 + filteredOptions.length) % filteredOptions.length;
			event.preventDefault();
		} else if (event.key === 'Enter' && filteredOptions[highlightedIndex]) {
			toggleOption(filteredOptions[highlightedIndex]);
			event.preventDefault();
		} else if (event.key === 'Escape') {
			isOpen = false;
			event.preventDefault();
		}
	}
</script>

<div class={['relative w-full', className]}>
	<!-- Input -->
	<div
		class="flex min-h-[2rem] cursor-text flex-wrap items-center gap-2 rounded-md border border-gray-300 px-2 py-2 text-sm shadow-sm focus-within:ring-1 focus-within:ring-blue-500"
		on:click={() => (isOpen = true)}
	>
		{#each selected.filter((s) => s.toLowerCase().includes(search.toLowerCase())) as item (item)}
			<span
				class="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
			>
				{item}
				<button
					type="button"
					on:click|stopPropagation={() => removeOption(item)}
					class="text-blue-500 hover:text-red-500"
				>
					×
				</button>
			</span>
		{/each}
		<input
			type="text"
			bind:value={search}
			on:keydown={handleKeyDown}
			class="flex-1 border-none p-0 text-sm focus:outline-none"
			placeholder={selected.length === 0 ? placeholder : ''}
		/>
		<button
			type="button"
			class=" text-white"
			on:click|stopPropagation={() => {
				isOpen = !isOpen;
			}}
			title="close"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6 transform transition-transform duration-300"
				class:rotate-180={isOpen}
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75 12 8.25l7.5 7.5">
				</path></svg
			></button
		>
	</div>

	<!-- Dropdown -->
	{#if isOpen}
		<div
			class={[
				'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200',
				className
			]}
		>
			{#each filteredOptions as option, index (option)}
				<div
					class="cursor-pointer px-3 py-2 text-sm"
					class:selected={isSelected(option)}
					class:highlighted={index === highlightedIndex}
					on:click={() => toggleOption(option)}
				>
					<input type="checkbox" checked={isSelected(option)} class="mr-2" readonly />
					{option}
				</div>
			{/each}
			{#if filteredOptions.length === 0}
				<div class="px-3 py-2 text-sm text-gray-500">No results</div>
			{/if}
		</div>
	{/if}
</div>
