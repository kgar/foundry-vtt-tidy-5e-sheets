import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { Inventory } from 'src/features/sections/Inventory';
import type { Item5e } from 'src/types/item.types';
import type {
  ActorInventoryTypes,
  ActorSheetQuadroneContext,
  InventorySection,
} from 'src/types/types';
import { SheetSections } from 'src/features/sections/SheetSections';
import { CONSTANTS } from 'src/constants';
import SectionActions from 'src/features/sections/SectionActions';

export class ActorInventoryPreparer {
  context: ActorSheetQuadroneContext;
  inventoryTypes: string[];
  inventory: ActorInventoryTypes;
  inventoryRowActions: TidyTableAction<any, any, InventorySection>[];

  constructor(context: ActorSheetQuadroneContext) {
    this.context = context;
    this.inventoryTypes = Inventory.getInventoryTypes();
    this.inventoryRowActions = TableRowActionsRuntime.getInventoryRowActions(
      context,
      { hasActionsTab: true },
    );
    this.inventory = Inventory.getDefaultInventorySections({
      rowActions: this.inventoryRowActions,
    });
  }

  isEligible(item: Item5e) {
    return this.inventoryTypes.includes(item.type);
  }

  processItem(item: Item5e) {
    if (!this.isEligible(item)) {
      return;
    }

    Inventory.applyInventoryItemToSection(
      this.inventory,
      item,
      this.inventoryTypes,
      {
        canCreate: true,
        rowActions: this.inventoryRowActions,
      },
    );
  }

  toSections(): InventorySection[] {
    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      this.context.actor,
      CONSTANTS.TAB_ACTOR_INVENTORY,
    ).forEach((s) => {
      this.inventory[s] ??= Inventory.createInventorySection(
        s,
        this.inventoryTypes,
        {
          canCreate: true,
          rowActions: this.inventoryRowActions,
        },
      );
    });

    const sections = Object.values(this.inventory);

    sections.forEach((section) => {
      section.sectionActions = SectionActions.getStandardItemHeaderActions(
        this.context.actor,
        this.context.actor.isOwner,
        this.context.unlocked,
        section,
      );
    });

    return sections;
  }
}
