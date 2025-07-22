import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
import type { ContainerSection, Item5e } from 'src/types/item.types';
import type {
  ActorSheetQuadroneContext,
  CharacterSheetQuadroneContext,
  InventorySection,
  SpellbookSection,
  TidySectionBase,
} from 'src/types/types';
import type { Component } from 'svelte';
import SpellButton from 'src/components/table-quadrone/table-buttons/SpellButton.svelte';
import EquipButton from 'src/components/table-quadrone/table-buttons/EquipButton.svelte';
import ActionsTabToggleButton from 'src/components/table-quadrone/table-buttons/ActionsTabToggleButton.svelte';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import type { ContainerContentsRowActionsContext } from '../types';
import ChooseAButton from 'src/components/table-quadrone/table-buttons/ChooseAButton.svelte';
import OpenActivityButton from 'src/components/table-quadrone/table-buttons/OpenActivityButton.svelte';

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
            props: (args) => ({ doc: args.data }),
          } satisfies TableAction<typeof EditButton>);

          result.push({
            component: DeleteButton,
            props: (args) => ({
              doc: args.data,
              deleteFn: () => args.data.deleteDialog(),
            }),
          } satisfies TableAction<typeof DeleteButton>);
        } else {
          result.push({
            component: EquipButton,
            props: (args) => ({ doc: args.data }),
            condition: (args) => 'equipped' in args.data.system,
          } satisfies TableAction<typeof EquipButton>);

          result.push({
            component: ActionsTabToggleButton,
            props: (args) => ({ doc: args.data }),
          } satisfies TableAction<typeof ActionsTabToggleButton>);
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
            props: (args) => ({ doc: args.data }),
          } satisfies TableAction<typeof EditButton>);

          result.push({
            component: DeleteButton,
            props: (args) => ({
              doc: args.data,
              deleteFn: () => args.data.deleteDialog(),
            }),
          } satisfies TableAction<typeof DeleteButton>);
        } else {
          result.push({
            component: ActionsTabToggleButton,
            props: (args) => ({ doc: args.data }),
          } satisfies TableAction<typeof ActionsTabToggleButton>);
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
            props: (args) => ({ doc: args.data }),
          } satisfies TableAction<typeof EditButton>);

          result.push({
            component: ChooseAButton,
            props: (args) => ({
              doc: args.data,
              buttons: [
                {
                  component: DeleteButton,
                  props: {
                    doc: args.data,
                    deleteFn: () => args.data.deleteDialog(),
                  },
                  condition: (doc: any) => !doc.system.linkedActivity,
                },
                {
                  component: OpenActivityButton,
                  props: {
                    doc: args.data,
                  },
                  condition: (doc: any) => !!doc.system.linkedActivity,
                },
              ],
            }),
          } satisfies TableAction<typeof ChooseAButton>);
        } else {
          result.push({
            component: SpellButton,
            props: (args) => ({ doc: args.data }),
          } satisfies TableAction<typeof SpellButton>);

          result.push({
            component: ActionsTabToggleButton,
            props: (args) => ({ doc: args.data }),
          } satisfies TableAction<typeof ActionsTabToggleButton>);
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
          props: (args) => ({ doc: args.data }),
        } satisfies TableAction<typeof EditButton>);

        result.push({
          component: DeleteButton,
          props: (args) => ({
            doc: args.data,
            deleteFn: () => args.data.deleteDialog(),
          }),
        } satisfies TableAction<typeof DeleteButton>);
      } else if (context.hasActor) {
        result.push({
          component: ActionsTabToggleButton,
          props: (args) => ({ doc: args.data }),
        } satisfies TableAction<typeof ActionsTabToggleButton>);
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

  getActionsRowActions(owner: boolean, unlocked: boolean) {
    type TableAction<TComponent extends Component<any>> = TidyTableAction<
      TComponent,
      Item5e,
      SpellbookSection
    >;

    let rowActions: TableAction<any>[] = $derived.by(() => {
      let result: TableAction<any>[] = [];

      if (owner) {
        if (unlocked) {
          result.push({
            component: EditButton,
            props: (args) => ({ doc: args.data }),
          } satisfies TableAction<typeof EditButton>);

          result.push({
            component: DeleteButton,
            props: (args) => ({
              doc: args.data,
              deleteFn: () => args.data.deleteDialog(),
            }),
          } satisfies TableAction<typeof DeleteButton>);
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

  getEffectsRowActions() {}

  getActivityRowActions(owner: boolean, unlocked: boolean) {
    type TableAction<TComponent extends Component<any>> = TidyTableAction<
      TComponent,
      Item5e,
      TidySectionBase
    >;

    let rowActions: TableAction<any>[] = $derived.by(() => {
      let result: TableAction<any>[] = [];

      if (owner) {
        if (unlocked) {
          result.push({
            component: EditButton,
            props: (args) => ({ doc: args.data }),
          } satisfies TableAction<typeof EditButton>);

          result.push({
            component: DeleteButton,
            props: (args) => ({
              doc: args.data,
              deleteFn: () => args.data.deleteDialog(),
            }),
          } satisfies TableAction<typeof DeleteButton>);
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
}

const singleton = new TableRowActionsRuntime();

export default singleton;
