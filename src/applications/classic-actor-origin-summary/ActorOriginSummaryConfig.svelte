<script lang="ts">
  import type { ActorOriginSummaryContext } from './ActorOriginSummaryConfigFormApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';

  interface Props {
    sheet: any;
    context: CoarseReactivityProvider<ActorOriginSummaryContext | undefined>;
  }

  let { sheet, context: _context }: Props = $props();

  let context = $derived(_context.data);

  let appId = $derived(sheet.document.id);

  const localize = FoundryAdapter.localize;
</script>

{#if context}
  <section class="flex-column">
    {#if context.isCharacter}
      <div class="form-group">
        <label for="background-edit-{appId}"
          >{localize('DND5E.Background')}</label
        >
        <div class="form-fields">
          {#if context.canEditBackground}
            <TextInputQuadrone
              id="background-edit-{appId}"
              document={sheet.document}
              field="system.details.background"
              placeholder={localize('DND5E.Background')}
              value={context.background}
            />
          {:else}
            <span>{context.background}</span>
          {/if}
        </div>
      </div>
      <div class="form-group">
        <label for="pc-alignment-edit-{appId}"
          >{localize('DND5E.Alignment')}</label
        >
        <div class="form-fields">
          <TextInputQuadrone
            id="alignment-edit-{appId}"
            document={sheet.document}
            field="system.details.alignment"
            placeholder={localize('DND5E.Alignment')}
            value={context.alignment}
          />
        </div>
      </div>
    {:else if context.isNpc}
      <div class="environment form-group">
        <label for="environment-edit-{appId}"
          >{localize('TIDY5E.Environment')}</label
        >
        <div class="form-fields">
          <TextInputQuadrone
            id="environment-edit-{appId}"
            document={sheet.document}
            field="system.details.environment"
            placeholder={localize('TIDY5E.Environment')}
            value={context.environment}
          />
        </div>
      </div>
      <div class="form-group">
        <label for="alignment-edit-{appId}">{localize('DND5E.Alignment')}</label
        >
        <div class="form-fields">
          <TextInputQuadrone
            id="alignment-edit-{appId}"
            document={sheet.document}
            field="system.details.alignment"
            placeholder={localize('DND5E.Alignment')}
            value={context.alignment}
          />
        </div>
      </div>
    {:else if context.isVehicle}
      <div class="form-group">
        <label for="dimensions-edit-{appId}"
          >{localize('DND5E.Dimensions')}</label
        >
        <div class="form-fields">
          <TextInputQuadrone
            id="dimensions-edit-{appId}"
            document={sheet.document}
            field="system.traits.dimensions"
            placeholder={localize('DND5E.Dimensions')}
            value={context.dimensions}
          />
        </div>
      </div>
    {/if}
  </section>
{/if}
