<script lang="ts">
  let counter = 0;

  function incrementCounter() {
    counter++;
  }
</script>

TODO:  
- [ ] Receive/Represent Actor Data
- [ ] Use localization to get textual fields
- [ ] Provide separate components for the various tabs of content
- [ ] Provide the most basic layout
- [ ] Apply initial style offering
- [ ] Scrap this todo list and think some more

<button on:click={incrementCounter}>Clicked {counter} times!</button>
