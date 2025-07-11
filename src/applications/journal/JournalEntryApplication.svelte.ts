import { TidyFlags } from 'src/foundry/TidyFlags';
import type { DocumentJournalEntry } from 'src/foundry/TidyFlags.types';
import { DocumentSheetDialog } from 'src/applications-quadrone/DocumentSheetDialog.svelte';
import { CONSTANTS } from 'src/constants';
import type { DocumentSheetApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import JournalEntry from './JournalEntry.svelte';
import { applyTitleToWindow } from 'src/utils/applications.svelte';

export type JournalMode = 'edit' | 'view';

export class JournalEntryApplication extends DocumentSheetDialog<
  DocumentSheetApplicationConfiguration,
  DocumentJournalEntry | undefined
>() {
  _journalId: string = '';
  _mode: JournalMode;

  constructor(
    journalId: string,
    mode: JournalMode,
    options: DocumentSheetApplicationConfiguration
  ) {
    options.id = `tidy-journal-entry-{id}-${journalId}`;
    super(options);

    this._journalId = journalId;
    this._mode = mode;
  }

  static DEFAULT_OPTIONS: Partial<DocumentSheetApplicationConfiguration> = {
    classes: [CONSTANTS.MODULE_ID, 'sheet', 'quadrone', 'tidy-journal-entry'],
    tag: 'form',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      contentClasses: ['flexcol', 'flex1'],
    },
    position: {
      width: 600,
      height: 600,
    },
    actions: {},
    submitOnClose: true,
  };

  get title() {
    const title = TidyFlags.documentJournal.get(this.document)[this._journalId]
      ?.title;

    return [super.title, title].filterJoin(' - ');
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    const component = mount(JournalEntry, {
      target: node,
      props: {
        entry: this._context,
        app: this,
        mode: this._mode,
      },
    });

    return component;
  }

  async _prepareContext() {
    // keep the window title up-to-date
    applyTitleToWindow(this.title, this.element);

    return TidyFlags.documentJournal.get(this.document)[this._journalId];
  }
}
