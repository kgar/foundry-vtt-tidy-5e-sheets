<script lang="ts">
  export let items: any[];
  export let searchCriteria: string = '';

  $: filteredItems = items.filter(
    (x: any) =>
      searchCriteria.trim() === '' ||
      x.name.toLowerCase().includes(searchCriteria.toLowerCase())
  );
</script>

<slot {filteredItems} />
