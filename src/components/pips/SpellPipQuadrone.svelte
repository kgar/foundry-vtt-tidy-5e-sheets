<script lang="ts">
  type Props = {
    empty: boolean;
    index: number;
    editable: boolean;
    prop: string;
    temp?: boolean;
  };

  let { empty, index, temp, editable, prop }: Props = $props();
</script>

<a
  class={['pip', 'spell-pip', { temp }]}
  class:inactive={empty}
  class:active={!empty}
  data-action={editable ? 'togglePip' : undefined}
  data-n={index + 1}
  data-prop={prop}
></a>
