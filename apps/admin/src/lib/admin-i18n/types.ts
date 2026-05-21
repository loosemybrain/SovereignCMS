export type AdminUiLocale = "de" | "en"

export const ADMIN_UI_LOCALE_COOKIE = "admin-ui-locale"

export const DEFAULT_ADMIN_UI_LOCALE: AdminUiLocale = "en"

export type BlockTypeMessages = {
  label: string
  fields: Record<string, string>
  select?: Record<string, string>
}

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
    validationReviewFields: string
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
      capabilityHints: {
        externalMedia: string
        form: string
        previewSensitive: string
      }
      editorSurfaceHints: {
        externalMedia: string
        form: string
        media: string
        accessibility: string
        governance: string
        preview: string
      }
      governanceContractHints: {
        externalMedia: string
        forms: string
        consent: string
        legalReview: string
        mediaAltText: string
        previewSafety: string
        accessibility: string
        links: string
        editorialQuality: string
        navigation: string
      }
      previewIsolationHints: {
        externalPlaceholder: string
        formDisabled: string
        mediaSafe: string
        navigationSafe: string
        contentOnly: string
      }
      runtimeValidationHints: {
        missingMediaAltText: string
        externalMediaRequiresConsent: string
        formRequiresPrivacyReview: string
        navigationTargetReview: string
        previewIsolationRequired: string
        governanceReviewRequired: string
        unknownBlockType: string
      }
      inspectorCompositionHints: {
        content: string
        design: string
        media: string
        actions: string
        layout: string
        form: string
        navigation: string
        accessibility: string
        governance: string
        preview: string
      }
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
  common: {
    invalidValue: string
    error: string
    success: string
    note: string
    locale: string
    variants: string
    logical: string
    title: string
    slug: string
    status: string
    updated: string
    addEntry: string
    shortTitle: string
    descriptionOrBody: string
    breadcrumb: string
    adminNavigation: string
    hintInfo: string
    hintWarning: string
    hintSuccess: string
    hintDanger: string
  }
  pages: {
    eyebrow: string
    title: string
    description: string
    localeOverviewTitle: string
    localeOverviewDescription: string
    pageListTitle: string
    pageListDescription: string
    loadFailed: string
    emptyTitle: string
    emptyDescription: string
    editorDescription: string
    editorEyebrow: string
    backToPages: string
    pageNotFound: string
    pageNotFoundDetail: string
    loadPageFailed: string
    localeMeta: string
    tenantMeta: string
  }
  blockCategories: {
    Content: string
    Forms: string
    "External Media": string
  }
  blocks: {
    hero: BlockTypeMessages
    text: BlockTypeMessages
    "contact-form": BlockTypeMessages
    "external-embed": BlockTypeMessages
    cta: BlockTypeMessages
    "feature-grid": BlockTypeMessages
    "image-text": BlockTypeMessages
  }
  blockPalette: {
    title: string
    description: string
    emptyPreset: string
    emptyPresetDescription: string
    addPreset: string
    addEmpty: string
    presetsSection: string
    insertAfterMarked: string
    insertAtEndHint: string
  }
  mediaLibrary: {
    imagesTitle: string
    imagesDescription: string
    videosTitle: string
    videosDescription: string
    documentsTitle: string
    documentsDescription: string
    libraryTitle: string
    emptyAssetsTitle: string
    emptyAssetsDescription: string
    pickerDemoTitle: string
    pickerDemoDescription: string
    uploadAria: string
    saved: string
    typeImage: string
    typeVideo: string
    typeDocument: string
    fieldTitle: string
    fieldType: string
    fieldAlt: string
    fieldAltDescription: string
    fieldUrl: string
    fieldUrlDescription: string
    titlePlaceholder: string
    altPlaceholder: string
    urlPlaceholder: string
    libraryDescription: string
    formTitle: string
    formDescription: string
    chooseType: string
    chooseTypeSr: string
    creating: string
    createButton: string
    createSuccess: string
    createFailed: string
  }
  privacyPage: {
    title: string
    description: string
    eyebrow: string
    newScanTitle: string
    newScanDescription: string
    hintTitle: string
    okTitle: string
    urlPlaceholder: string
    scanCompleteAria: string
    noticeTitle: string
    targetUrlLabel: string
    creating: string
    createScanButton: string
    urlRequired: string
    createSuccess: string
    createFailed: string
    unexpectedError: string
    approvalUpdated: string
    approvalUpdateFailed: string
    scansHeading: string
    emptyScansTitle: string
    emptyScansDescription: string
    scanResultsTitle: string
    urlLabel: string
    statusLabel: string
    findingsLabel: string
    findingSingular: string
    findingPlural: string
    approvalStatusLabel: string
    findingsSectionTitle: string
    noFindings: string
    createdAt: string
    footerWarning: string
    approval: {
      draft: string
      reviewed: string
      approved: string
      rejected: string
    }
    scanStatus: {
      queued: string
      running: string
      completed: string
      failed: string
      cancelled: string
    }
  }
  settingsForm: {
    saveFailed: string
    siteIdentityTitle: string
    siteIdentityDescription: string
    siteName: string
    tagline: string
    logoUrl: string
    contactTitle: string
    contactDescription: string
    email: string
    phone: string
    address1: string
    address2: string
    postal: string
    city: string
    country: string
    businessTitle: string
    businessDescription: string
    openingHours: string
    appointment: string
    legalTitle: string
    legalDescription: string
    responsible: string
    imprintSlug: string
    imprintSlugDescription: string
    privacySlug: string
    privacySlugDescription: string
    cookieSlug: string
    socialTitle: string
    socialDescription: string
    socialLabel: string
    socialUrl: string
    socialUrlDescription: string
    socialValidationError: string
    saveSuccess: string
    saveSuccessPersisted: string
    saveSuccessInMemory: string
    savePersistenceUnavailable: string
    saveErrorGeneric: string
    saving: string
    saveButton: string
    socialEmpty: string
    remove: string
    addSocialLink: string
    themeTitle: string
    themeDescription: string
    fontTitle: string
    fontDescription: string
    fontPrototypeHint: string
    fontEmpty: string
    addFont: string
    fontFamily: string
    fontWeight: string
    fontStyle: string
    fontWoff2File: string
    spinnerTitle: string
    spinnerDescription: string
    spinnerPreset: string
    spinnerSpeed: string
    spinnerPreviewTitle: string
    spinnerPreviewDescription: string
    themeTokenInvalid: string
    themeTokensSanitizedOnSave: string
    fontUploadTooLarge: string
    fontUploadWrongType: string
    fontUploadFailed: string
    fontUploadSuccess: string
  }
  navigationForm: {
    scope: string
    label: string
    type: string
    page: string
    href: string
    labelPlaceholder: string
    hrefPlaceholder: string
    emptyItemsDescription: string
  }
  createPageForm: {
    titleLabel: string
    titlePlaceholder: string
    slugLabel: string
    slugDescription: string
    slugPlaceholder: string
    templateLabel: string
    templateDescription: string
    localeLabel: string
    localeDescription: string
    cardTitle: string
    cardDescription: string
    createdLabel: string
    inMemoryHint: string
    createFailed: string
    createErrorGeneric: string
    creating: string
    createButton: string
    droppedLocalesWarning: string
    slugUnsupportedWarning: string
    starterBlocks: string
    noTemplateDescription: string
    compositionDefaults: string
  }
  appearance: {
    ariaLabel: string
    light: string
    lightDescription: string
    dark: string
    darkDescription: string
  }
  featureGridList: {
    shortTitlePlaceholder: string
    bodyPlaceholder: string
  }
  contactFormPreview: {
    namePlaceholder: string
    emailPlaceholder: string
    phonePlaceholder: string
    messagePlaceholder: string
  }
  seoForm: {
    seoTitle: string
    seoDescription: string
    canonicalUrl: string
    seoImage: string
    metaTitlePlaceholder: string
    metaDescriptionPlaceholder: string
    canonicalPlaceholder: string
    titleHelp: string
    descriptionHelp: string
    canonicalHelp: string
    robotsIndexOn: string
    robotsIndexOff: string
    robotsIndexHelpOn: string
    robotsIndexHelpOff: string
    tenantIdMissing: string
  }
  contentTemplates: {
    "empty-page-template": { label: string; description: string }
    "basic-page-template": { label: string; description: string }
    "landing-page-template": { label: string; description: string }
  }
  blockPreview: {
    headline: string
    subline: string
    body: string
    mediaUrl: string
    emptyHeadline: string
    emptyBody: string
  }
  inspectorPanel: {
    ariaLabel: string
  }
}
