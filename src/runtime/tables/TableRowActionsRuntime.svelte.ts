import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
import type { ContainerSection, Item5e } from 'src/types/item.types';
import type {
  ActorSheetQuadroneContext,
  CharacterSheetQuadroneContext,
  InventorySection,
  SpellbookSection,
} from 'src/types/types';
import type { Component } from 'svelte';
import SpellButton from 'src/components/table-quadrone/table-buttons/SpellButton.svelte';
import EquipButton from 'src/components/table-quadrone/table-buttons/EquipButton.svelte';
import BookmarkButton from 'src/components/table-quadrone/table-buttons/BookmarkButton.svelte';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import type { ContainerContentsRowActionsContext } from '../types';

// TODO: Set up a proper runtime where table actions can be fed to specific tab types.

class TableRowActionsRuntime {
  getInventoryRowActions(context: ActorSheetQuadroneContext) {
    type TableAction<TComponent extends Component<any>> = TidyTableAction<
      TComponent,
      Item5e,
      InventorySection
    >;

    let rowActions: TableAction<any>[] = $derived.by(() => {
      let result: TableAction<any>[] = [];

      if (context.owner) {
        if (context.unlocked) {
          result.push({
            component: EditButton,
            props: (doc: any) => ({ doc }),
          } satisfies TableAction<typeof EditButton>);

          result.push({
            component: DeleteButton,
            props: (doc: any) => ({
              doc,
              deleteFn: () => doc.deleteDialog(),
            }),
          } satisfies TableAction<typeof DeleteButton>);
        } else {
          result.push({
            component: EquipButton,
            props: (doc: any) => ({ doc }),
            condition: (args) => 'equipped' in args.data.system,
          } satisfies TableAction<typeof EquipButton>);

          result.push({
            component: BookmarkButton,
            props: (doc: any) => ({ doc }),
          } satisfies TableAction<typeof BookmarkButton>);
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies TableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getFeatureRowActions(context: CharacterSheetQuadroneContext) {
    type TableAction<TComponent extends Component<any>> = TidyTableAction<
      TComponent,
      Item5e,
      SpellbookSection
    >;

    let rowActions: TableAction<any>[] = $derived.by(() => {
      let result: TableAction<any>[] = [];

      if (context.owner) {
        if (context.unlocked) {
          result.push({
            component: EditButton,
            props: (doc: any) => ({ doc }),
          } satisfies TableAction<typeof EditButton>);

          result.push({
            component: DeleteButton,
            props: (doc: any) => ({
              doc,
              deleteFn: () => doc.deleteDialog(),
            }),
          } satisfies TableAction<typeof DeleteButton>);
        } else {
          result.push({
            component: BookmarkButton,
            props: (doc: any) => ({ doc }),
          } satisfies TableAction<typeof BookmarkButton>);
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies TableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getSpellRowActions(context: ActorSheetQuadroneContext) {
    type TableAction<TComponent extends Component<any>> = TidyTableAction<
      TComponent,
      Item5e,
      SpellbookSection
    >;

    let rowActions: TableAction<any>[] = $derived.by(() => {
      let result: TableAction<any>[] = [];

      if (context.owner) {
        if (context.unlocked) {
          result.push({
            component: EditButton,
            props: (doc: any) => ({ doc }),
          } satisfies TableAction<typeof EditButton>);

          result.push({
            component: DeleteButton,
            props: (doc: any) => ({
              doc,
              deleteFn: () => doc.deleteDialog(),
            }),
          } satisfies TableAction<typeof DeleteButton>);
        } else {
          result.push({
            component: SpellButton,
            props: (doc: any) => ({ doc }),
          } satisfies TableAction<typeof SpellButton>);

          result.push({
            component: BookmarkButton,
            props: (doc: any) => ({ doc }),
          } satisfies TableAction<typeof BookmarkButton>);
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies TableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getContainerContentsRowActions(context: ContainerContentsRowActionsContext) {
    type TableAction<TComponent extends Component<any>> = TidyTableAction<
      TComponent,
      Item5e,
      ContainerSection
    >;

    let rowActions: TableAction<any>[] = $derived.by(() => {
      let result: TableAction<any>[] = [];

      if (context.unlocked) {
        result.push({
          component: EditButton,
          props: (doc: any) => ({ doc }),
        } satisfies TableAction<typeof EditButton>);

        result.push({
          component: DeleteButton,
          props: (doc: any) => ({
            doc,
            deleteFn: () => doc.deleteDialog(),
          }),
        } satisfies TableAction<typeof DeleteButton>);
      } else if (context.hasActor) {
        result.push({
          component: BookmarkButton,
          props: (doc: any) => ({ doc }),
        } satisfies TableAction<typeof BookmarkButton>);
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies TableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getActionsRowActions() {}

  getEffectsRowActions() {}
}

const singleton = new TableRowActionsRuntime();

export default singleton;
