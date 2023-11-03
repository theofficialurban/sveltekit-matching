<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';

	export let data: PageData;

	$: d = data.data;
</script>

<div>
	<Card.Root>
		<Card.Content class="bg-black p-4">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">🃏 Game # ID</Table.Head>
						<Table.Head class="w-[300px]">Date</Table.Head>
						<Table.Head class="w-[100px]">Level</Table.Head>
						<Table.Head>👤 User</Table.Head>
						<Table.Head>💯 Score</Table.Head>
						<Table.Head>⏳ Time</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body class="text-md font-bold">
					{#each d as row (row.id)}
						<Table.Row>
							<Table.Cell>#{row.id}</Table.Cell>
							<Table.Cell>{row.created_at}</Table.Cell>
							<Table.Cell class="text-lg w-[150px]"
								>Level: <span
									class="text-2xl"
									style={`
								
								background: -webkit-linear-gradient(${row.level.color.from}, ${row.level.color.to});
								-webkit-background-clip: text;
								-webkit-text-fill-color: transparent;
								`}>{row.level['lvl#']}</span
								></Table.Cell
							>
							<Table.Cell><span class="text-xl userGrad">{row.username}</span></Table.Cell>
							<Table.Cell>{row.score}</Table.Cell>
							<Table.Cell>{Math.ceil(row.time ?? 0)} seconds</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>

<style>
	.userGrad {
		@apply bg-gradient-to-r text-transparent bg-clip-text from-[#68e3f9] via-[#f55a9b] to-[#4f4ed7];
	}
	.lvlGrad {
	}
</style>
