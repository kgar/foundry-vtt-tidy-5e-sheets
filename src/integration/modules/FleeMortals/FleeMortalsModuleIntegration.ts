import type { Tidy5eSheetsApi } from 'src/api';
import type { ModuleIntegrationBase } from '../../integration-classes';
import { CONSTANTS } from 'src/constants';

export class FleeMortalsModuleIntegration implements ModuleIntegrationBase {
  get moduleId(): string {
    return 'mcdm-flee-mortals-where-evil-lives';
  }

  init(api: Tidy5eSheetsApi): void {
    import('./FleeMortals.less');
    api.config.actorTraits.registerActorTraits([
      {
        title: 'MCDMFMWEL.DemonSoulsFlag.SheetLabel',
        iconClass: 'fa-solid fa-skull',
        enabled: (params) => params.context.actor.getFlag('dnd5e', 'demonSouls'),
        pills: (params) => {
          const numSouls = params.data.actor.getFlag(this.moduleId, 'demonSoulCount') ?? 0;
          const soulFormula = params.data.actor.getFlag(this.moduleId, 'demonSoulFormula') ?? '';
          const pills = [{
            label: '',
            content: `<input type='number' class='demon-soul-count uninput' data-name='flags.${this.moduleId}.demonSoulCount' value='${numSouls}' min='0' step='1'${params.app.isEditable ? '' : ' disabled'}>`
          }];
          if (params.app.sheetMode === CONSTANTS.SHEET_MODE_EDIT) {
            pills.push({
              label: game.i18n.localize('DND5E.Formula'),
              content: `<input type='text' class='demon-soul-formula' data-name='flags.${this.moduleId}.demonSoulFormula' value='${soulFormula}'${params.app.isEditable ? '' : ' disabled'}>`
            });
          }
          return pills;
        }
      }, {
        title: 'TODO CREATURE ROLE',
        enabled: (params) => params.context.actor.type === 'npc' && (params.app.sheetMode === CONSTANTS.SHEET_MODE_EDIT),
        pills: (params) => {
          const currRole = params.data.actor.getFlag(this.moduleId, 'role');
          const selectConfig = {
            options: Object.entries(CONFIG.MCDM.creatureRoles).reduce((acc, [id, role]) => {
              acc.push({
                ...role,
                value: id
              });
              return acc;
            }),
            name: `flags.${this.moduleId}.role`,
            blank: '',
            sort: true,
            value: currRole,
            classes: ["creature-role"]
          };
          const currReference = CONFIG.MCDM.creatureRoles[currRole]?.reference;
          if (currReference) {
            selectConfig.dataset = {
              tooltip: `<section class='loading' data-uuid='${currReference}'><i class='fa-solid fa-spinner fa-spin-pulse'></i></section>`,
              tooltipDirection: 'UP'
            };
          }
          return [{label: "", content: foundry.applications.fields.createSelectInput(selectConfig).outerHTML}];
        }
      }
    ]);
    const onChangeCount = async (event: Event) => {
      const actor = await fromUuid(event.currentTarget?.form?.dataset.documentUuid);
      if (!actor) return;
      const newValue = dnd5e.utils.parseInputDelta(event.currentTarget, actor);
      actor.update({
        [`flags.${this.moduleId}.demonSoulCount`]: Math.max(0, newValue ?? 0)
      });
    }
    const onFocusCount = (event: Event) => {
      event.currentTarget?.select();
    }
    const onChangeFormula = async (event: Event) => {
      const actor = await fromUuid(event.currentTarget?.form?.dataset.documentUuid);
      if (!actor) return;
      actor.update({
        [`flags.${this.moduleId}.demonSoulFormula`]: event.currentTarget?.value ?? ''
      });
    }
    const onClickFormula = async (event: Event) => {
      const actor = await fromUuid(event.currentTarget?.closest('form.actor.tidy5e-sheet')?.dataset.documentUuid);
      if (!actor) return;
      const formula = actor.getFlag(this.moduleId, 'demonSoulFormula') ?? '0';
      const roll = await Roll.create(formula, actor.getRollData()).evaluate();
      actor.update({ [`flags.${this.moduleId}.demonSoulCount`]: roll.total });
    }
    Hooks.on('renderTidy5eActorSheetQuadroneBase2', (app: any, html: HTMLFormElement) => {
      html.querySelectorAll<HTMLInputElement>(`[data-name='flags.${this.moduleId}.demonSoulCount']`).forEach(el => {
        el.removeEventListener('change', onChangeCount);
        el.addEventListener('change', onChangeCount);
        el.removeEventListener('focus', onFocusCount);
        el.addEventListener('focus', onFocusCount)
      });
      html.querySelectorAll<HTMLInputElement>(`[data-name='flags.${this.moduleId}.demonSoulFormula']`).forEach(el => {
        el.removeEventListener('change', onChangeFormula);
        el.addEventListener('change', onChangeFormula);
        el.nextElementSibling?.removeEventListener('click', onClickFormula);
        el.nextElementSibling?.addEventListener('click', onClickFormula);
      });
      const existingElem = html.querySelector('.actor-subtitle .creature-role');
      if (existingElem) {
        existingElem.nextElementSibling?.remove();
        existingElem.remove();
      }
      const creatureRole = app.actor.getFlag(this.moduleId, 'role');
      if (creatureRole) {
        const targetElem = html.querySelector('.actor-subtitle .creature-type');
        if (!targetElem) return;
        const dividerElem = document.createElement('div');
        dividerElem.classList.add('divider-dot');
        targetElem.insertAdjacentElement('afterend', dividerElem);
        const template = document.createElement('template');
        const {label, reference} = CONFIG.MCDM.creatureRoles[creatureRole] ?? {};
        template.innerHTML = `
          <span class='creature-role'>
            <span class='font-label-medium color-text-gold'>${label ?? creatureRole}</span>
          </span>
        `.trim();
        const roleElem = dividerElem.insertAdjacentElement('afterend', template.content.children[0]);
        if (reference) {
          roleElem!.dataset.tooltip = `<section class='loading' data-uuid='${reference}'><i class='fa-solid fa-spinner fa-spin-pulse'></i></section>`,
          roleElem!.dataset.tooltipDirection = 'UP';
        }
      }
    });
  }
}