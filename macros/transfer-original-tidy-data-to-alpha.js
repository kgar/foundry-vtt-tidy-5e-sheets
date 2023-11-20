/*
 This macro transfers Original Sheet data to the Alpha Sheets.
 */

(async () => {
  const alphaId = 'tidy5e-sheet-kgar';
  const originalId = 'tidy5e-sheet';

  /**
   * Where the data is coming from
   */
  const sourceId = originalId;
  /**
   * Where the data is going
   */
  const targetId = alphaId;
  /**
   * When updating from the original sheets to the alpha sheets,
   * do not include new fields.
   */
  const includeNewFields = false;

  const flagsReference = [
    { alpha: 'age', original: 'age', isNew: false },
    {
      alpha: 'allow-edit',
      original: 'allow-edit',
      isNew: false,
    },
    {
      alpha: 'appearance',
      original: 'appearance',
      isNew: true,
    },
    { alpha: 'bond', original: 'bond', isNew: false },
    {
      alpha: 'classFilter',
      original: 'classFilter',
      isNew: false,
    },
    {
      alpha: 'death.failure',
      original: 'death.failure',
      isNew: false,
    },
    {
      alpha: 'death.success',
      original: 'death.success',
      isNew: false,
    },
    {
      alpha: 'exhaustion',
      original: 'exhaustion',
      isNew: false,
    },
    { alpha: 'eyes', original: 'eyes', isNew: false },
    {
      alpha: 'favorite',
      original: 'favorite',
      isNew: false,
    },
    { alpha: 'flaw', original: 'flaw', isNew: false },
    {
      alpha: 'gender',
      original: 'gender',
      isNew: false,
    },
    { alpha: 'hair', original: 'hair', isNew: false },
    {
      alpha: 'height',
      original: 'height',
      isNew: false,
    },
    {
      alpha: 'ideal',
      original: 'ideal',
      isNew: false,
    },
    {
      alpha: 'inventory-grid',
      original: 'inventory-grid',
      isNew: false,
    },
    {
      alpha: 'maxPreparedSpells',
      original: 'maxPreparedSpells',
      isNew: false,
    },
    {
      alpha: 'motion',
      original: 'motion',
      isNew: true,
    },
    {
      alpha: 'notes.value',
      original: 'notes.value',
      isNew: false,
    },
    {
      alpha: 'notes1.name',
      original: 'notes1.name',
      isNew: false,
    },
    {
      alpha: 'notes1.value',
      original: 'notes1.value',
      isNew: false,
    },
    {
      alpha: 'notes2.name',
      original: 'notes2.name',
      isNew: false,
    },
    {
      alpha: 'notes2.value',
      original: 'notes2.value',
      isNew: false,
    },
    {
      alpha: 'notes3.name',
      original: 'notes3.name',
      isNew: false,
    },
    {
      alpha: 'notes3.value',
      original: 'notes3.value',
      isNew: false,
    },
    {
      alpha: 'notes4.name',
      original: 'notes4.name',
      isNew: false,
    },
    {
      alpha: 'notes4.value',
      original: 'notes4.value',
      isNew: false,
    },
    {
      alpha: 'npcSkillsExpanded',
      original: 'npcSkillsExpanded',
      isNew: false,
    },
    {
      alpha: 'parentClass',
      original: 'parentClass',
      isNew: false,
    },
    {
      alpha: 'playerName',
      original: 'playerName',
      isNew: false,
    },
    {
      alpha: 'showNpcPersonalityInfo',
      original: 'showNpcPersonalityInfo',
      isNew: false,
    },
    { alpha: 'skin', original: 'skin', isNew: false },
    {
      alpha: 'spellbook-grid',
      original: 'spellbook-grid',
      isNew: false,
    },
    {
      alpha: 'trait',
      original: 'trait',
      isNew: false,
    },
    {
      alpha: 'traitsExpanded',
      original: 'traitsExpanded',
      isNew: false,
    },
    {
      alpha: 'weight',
      original: 'weight',
      isNew: false,
    },
  ];

  ui.notifications.info(
    'Migrating original Tidy 5e sheet data to the Alpha sheets. Do not navigate away until this is done.'
  );

  for (let actor of game.actors) {
    try {
      ui.notifications.info(
        `${actor.name}: Transferring Tidy data from ${sourceId} to ${targetId}...`
      );

      await transferFlagData(actor);

      for (let item of actor.items) {
        await transferFlagData(item);
      }

      ui.notifications.info(`${actor.name}: Transfer complete!`);
    } catch (e) {
      ui.notifications.error(
        `${actor.name}: Transfer failed. See devtools console error for more details.`,
        { permanent: true }
      );
      console.error(e);
    }
  }

  async function transferFlagData(document) {
    const theUpdate = flagsReference
      .filter((f) => !f.isNew || f.isNew === includeNewFields)
      .reduce((acc, flag) => {
        const targetFlagProp = getFlagProp(targetId);
        const targetFlag = getFlagDocumentPropName(
          flag[targetFlagProp],
          targetId
        );
        const sourceFlagProp = getFlagProp(sourceId);
        const sourceFlag = getFlagDocumentPropName(
          flag[sourceFlagProp],
          sourceId
        );
        const sourceValue = getProperty(document, sourceFlag);

        if (sourceValue !== undefined) {
          acc[targetFlag] = sourceValue;
        }

        return acc;
      }, {});
    console.info({
      message: 'Data to transfer',
      document,
      theUpdate,
    });
    await document.update(theUpdate);
  }

  function getFlagDocumentPropName(flag, moduleId) {
    return `flags.${moduleId}.${flag}`;
  }

  function getFlagProp(targetId) {
    return targetId === alphaId ? 'alpha' : 'original';
  }
})();
