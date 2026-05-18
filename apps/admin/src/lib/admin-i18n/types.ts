export type AdminUiLocale = "de" | "en"

export const ADMIN_UI_LOCALE_COOKIE = "admin-ui-locale"

export const DEFAULT_ADMIN_UI_LOCALE: AdminUiLocale = "en"

export type AdminMessages = {
  shell: {
    workspace: string
    tenant: string
    runtime: string
    topbarView: string
    nav: {
      dashboard: string
      pages: string
      navigation: string
      footerNavigation: string
      media: string
      settings: string
      privacy: string
    }
    db: string
    storage: string
    auth: string
  }
  locale: {
    contentLanguage: string
    uiLanguage: string
  }
  dashboard: {
    eyebrow: string
    title: string
    description: string
    pagesLink: string
    workspaceTitle: string
    workspaceDescription: string
    metricsTitle: string
    metricsDescription: string
    tenantId: string
    pagesCurrentLocale: string
    pagesInLocale: string
    pageVariants: string
    pageVariantsDescription: string
    logicalPages: string
    logicalPagesDescription: string
    blocks: string
    blocksDescription: string
    database: string
    databaseDescription: string
    runtimeConfigTitle: string
    runtimeConfigDescription: string
    defaultLocale: string
    supportedLocales: string
  }
  editor: {
    skipToInspector: string
    regionBlocks: string
    regionInspector: string
    inspectorTitle: string
    inspectorSubtitle: string
    contextTitle: string
    contextDescription: string
    contextTenant: string
    contextSource: string
    contextDbAdapter: string
    blocksSection: string
    emptyBlocksTitle: string
    emptyBlocksDescription: string
    publishSection: string
    publishHint: string
    draftAndSave: string
    pageStatus: string
    saveHint: string
    save: string
    saving: string
    saveAria: string
    savingAria: string
    saveRunning: string
    saveFailed: string
    unsavedChanges: string
    lastSaved: string
    notSavedYet: string
    statusAfterSave: string
    pageStatusLabel: string
    statusTransitionFailed: string
    blockSelected: string
    blockAdded: string
    blockMovedUp: string
    blockMovedDown: string
    blockRemoved: string
    saved: string
    insertAfter: string
    selectBlockAria: string
    removeBlock: string
    moveUp: string
    moveDown: string
    selected: string
    order: string
    selectedLabel: string
    notSelectedSr: string
    blockSelectAria: string
    blockInsertAfterAria: string
    blockMoveUpAria: string
    blockMoveDownAria: string
    blockDeleteAria: string
    orientation: {
      blockPosition: string
      contextHeaderAria: string
      noExcerpt: string
      emptyInspectorTitle: string
      emptyInspectorDescription: string
      emptyBlocksPanelTitle: string
      emptyBlocksPanelDescription: string
      emptyPresetsTitle: string
      emptyPresetsDescription: string
      stickyContextAria: string
    }
    workspace: {
      livePreview: string
      deviceToolbarAria: string
      deviceDesktop: string
      deviceTablet: string
      deviceMobile: string
      tabInspector: string
      tabBlocks: string
      tabPresets: string
      tabGovernance: string
      rightPanelAria: string
      panelTabsAria: string
      inspectorEmptyPreview: string
      insertAtEnd: string
      insertAfterActive: string
      clearInsertPosition: string
      noPresets: string
    }
  }
  contentStatus: {
    draft: string
    published: string
    archived: string
    publish: string
    archive: string
    restoreDraft: string
  }
  inspector: {
    noBlockSelected: string
    noBlockSelectedHint: string
    blockInfo: string
    blockProperties: string
    seo: string
    seoPageDescription: string
    seoUnavailable: string
    governanceTitle: string
    governanceDescription: string
    noFieldsForType: string
    debugBlock: string
    debugSeo: string
    debugHint: string
    type: string
    position: string
    visibility: string
    sections: {
      content: string
      media: string
      actions: string
      layout: string
      advanced: string
    }
  }
  mediaPreview: {
    externalNotLoaded: string
    placeholder: string
    noImage: string
    invalidUrl: string
  }
  settings: {
    eyebrow: string
    title: string
    description: string
  }
  navigation: {
    eyebrow: string
    title: string
    description: string
    localeSection: string
    localeSectionDescription: string
    entries: string
    entriesDescription: string
  }
  footerNavigation: {
    eyebrow: string
    title: string
    description: string
  }
  media: {
    eyebrow: string
    title: string
    description: string
  }
  publishGovernance: {
    panelAria: string
    sectionTitle: string
    sectionDescription: string
    readyTitle: string
    readyWithNotesTitle: string
    reviewTitle: string
    nonBlockingHint: string
    noCriticalCalm: string
    emptyTitle: string
    emptyDescription: string
    focusBlock: string
    selectedBlockSection: string
    selectedBlockSummary: string
    pageLevelSection: string
    otherBlocksSection: string
    criticalCount: string
    warningCount: string
    infoCount: string
    toolbarReady: string
    toolbarReview: string
    toolbarReadyShort: string
    toolbarReviewShort: string
    severityLabels: {
      critical: string
      warning: string
      info: string
    }
    categories: {
      accessibility: string
      media: string
      content: string
      navigation: string
      seo: string
      editorial: string
    }
  }
}
