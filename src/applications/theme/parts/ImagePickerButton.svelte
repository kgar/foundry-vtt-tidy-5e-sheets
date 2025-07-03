<script lang="ts">
  interface Props {
    current: string;
    onimagepicked?: (image: string) => any;
  }

  let { current, onimagepicked }: Props = $props();

  function pickImage(
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    current: string,
  ) {
    const rect = event.currentTarget.getBoundingClientRect();

    const fp = new foundry.applications.apps.FilePicker({
      type: 'image',
      current: current,
      callback: (path: string) => {
        onimagepicked?.(path ?? '');
      },
      top: rect.top + 40,
      left: rect.left + 10,
    });

    fp.browse();
  }
</script>

<button
  type="button"
  class="button button-icon-only"
  onclick={(ev) => pickImage(ev, current)}
>
  <i class="fa-solid fa-search"></i>
</button>
