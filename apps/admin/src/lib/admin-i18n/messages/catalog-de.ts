import type { AdminMessages } from "../types"

/** Ergänzende Admin-UI-Texte (Deutsch). */
export const catalogDe: Pick<
  AdminMessages,
  | "common"
  | "pages"
  | "blockCategories"
  | "blocks"
  | "blockPalette"
  | "mediaLibrary"
  | "privacyPage"
  | "settingsForm"
  | "settingsDomains"
  | "navigationForm"
  | "createPageForm"
  | "appearance"
  | "featureGridList"
  | "contactFormPreview"
  | "seoForm"
  | "contentTemplates"
  | "blockPreview"
  | "inspectorPanel"
> = {
  common: {
    invalidValue: "Ungültiger Wert.",
    error: "Fehler",
    success: "Gespeichert",
    note: "Hinweis",
    locale: "Sprache",
    variants: "Varianten",
    logical: "Logisch",
    title: "Titel",
    slug: "Slug",
    status: "Status",
    updated: "Aktualisiert",
    addEntry: "Neuen Eintrag hinzufügen",
    shortTitle: "Kurztitel",
    descriptionOrBody: "Beschreibung oder Fließtext",
    breadcrumb: "Brotkrumen-Navigation",
    adminNavigation: "Admin-Navigation",
    hintInfo: "Hinweis",
    hintWarning: "Warnung",
    hintSuccess: "Erfolg",
    hintDanger: "Fehler",
  },
  pages: {
    eyebrow: "Inhalt",
    title: "Seiten",
    description: "CMS-Seiten verwalten",
    localeOverviewTitle: "Sprache & Überblick",
    localeOverviewDescription:
      "Sprache wählen, dann Seiten für diese Sprache anlegen oder bearbeiten.",
    pageListTitle: "Seitenliste",
    pageListDescription: "Alle Seitendatensätze für Sprache {locale}.",
    loadFailed: "Seiten konnten nicht geladen werden. Bitte erneut versuchen.",
    emptyTitle: "Keine Seiten für Sprache {locale}",
    emptyDescription:
      "Es können Varianten in anderen Sprachen existieren. Oben die Sprache wechseln.",
    editorDescription: "Seiteninhalt und Blöcke bearbeiten",
    editorEyebrow: "Seiten-Editor",
    backToPages: "← Zurück zu Seiten",
    pageNotFound: "Seite nicht gefunden",
    pageNotFoundDetail:
      'Keine Seite mit Slug „{slug}" für Sprache „{locale}" gefunden.',
    loadPageFailed: "Seite konnte nicht geladen werden. Bitte erneut versuchen.",
    localeMeta: "Sprache: {locale}",
    tenantMeta: "Mandant: {tenant}",
  },
  blockCategories: {
    Content: "Inhalt",
    Forms: "Formulare",
    "External Media": "Externe Medien",
  },
  blocks: {
    hero: {
      label: "Hero-Bereich",
      fields: {
        headline: "Überschrift",
        subline: "Unterzeile",
        mediaAssetId: "Hero-Bild",
      },
    },
    text: {
      label: "Text",
      fields: { body: "Fließtext" },
    },
    "contact-form": {
      label: "Kontaktformular",
      fields: {
        headline: "Überschrift",
        intro: "Einleitungstext",
        consentLabel: "Einwilligungstext",
        successMessage: "Erfolgsmeldung",
        submitLabel: "Beschriftung Absenden",
        recipientEmail: "Empfänger-E-Mail",
      },
    },
    "external-embed": {
      label: "Externe Einbettung",
      fields: {
        provider: "Anbieter",
        title: "Titel",
        consentText: "Einwilligungstext",
        embedUrl: "Einbettungs-URL",
        buttonLabel: "Schaltflächenbeschriftung",
      },
    },
    cta: {
      label: "Handlungsaufforderung",
      fields: {
        eyebrow: "Dachzeile",
        body: "Fließtext",
        headline: "Überschrift",
        primaryLabel: "Primäre Schaltfläche",
        primaryHref: "URL primäre Schaltfläche",
        secondaryLabel: "Sekundäre Schaltfläche",
        secondaryHref: "URL sekundäre Schaltfläche",
        align: "Ausrichtung",
      },
      select: {
        "align.left": "Links",
        "align.center": "Zentriert",
      },
    },
    "feature-grid": {
      label: "Feature-Raster",
      fields: {
        headline: "Überschrift",
        intro: "Einleitungstext",
        items: "Einträge",
        columns: "Spaltenanzahl",
      },
      select: {
        "columns.2": "2 Spalten",
        "columns.3": "3 Spalten",
        "columns.4": "4 Spalten",
      },
    },
    "image-text": {
      label: "Bild und Text",
      fields: {
        headline: "Überschrift",
        body: "Fließtext",
        imageUrl: "Bild-URL",
        imageAlt: "Alternativtext Bild",
        ctaLabel: "CTA-Schaltfläche",
        ctaHref: "CTA-URL",
        imagePosition: "Bildposition",
      },
      select: {
        "imagePosition.left": "Links",
        "imagePosition.right": "Rechts",
      },
    },
  },
  blockPalette: {
    title: "Block hinzufügen",
    description: "Eine Karte pro Blocktyp — Vorlage oder leerer Block.",
    emptyPreset: "Leerer Block",
    emptyPresetDescription: "Ohne Vorlagen-Startwerte",
    addPreset: "Vorlage hinzufügen",
    addEmpty: "Leeren Block hinzufügen",
    presetsSection: "Vorlagen",
    insertAfterMarked:
      "Der neue Block wird nach der markierten Karte eingefügt (Einfügemarke aktiv).",
    insertAtEndHint: "Der neue Block wird am Ende der Seite eingefügt.",
  },
  mediaLibrary: {
    imagesTitle: "Bilder",
    imagesDescription: "Medien vom Typ Bild",
    videosTitle: "Videos",
    videosDescription: "Medien vom Typ Video",
    documentsTitle: "Dokumente",
    documentsDescription: "Dokumente und Sonstiges",
    libraryTitle: "Bibliothek",
    emptyAssetsTitle: "Keine Medien-Assets",
    emptyAssetsDescription: "Legen Sie ein URL-basiertes Asset über das Formular oben an.",
    pickerDemoTitle: "Picker-Demo",
    pickerDemoDescription: "Entwickler-Vorschau der Medien-Picker-Komponente.",
    uploadAria: "Medien-Asset anlegen",
    saved: "Gespeichert",
    typeImage: "Bild",
    typeVideo: "Video",
    typeDocument: "Dokument",
    fieldTitle: "Titel",
    fieldType: "Typ",
    fieldAlt: "Alternativtext",
    fieldAltDescription: "Für Barrierefreiheit und Screenreader.",
    fieldUrl: "URL",
    fieldUrlDescription:
      "Externe URL oder Pfad zum Asset (z. B. https://… oder /pfad/zur/datei).",
    titlePlaceholder: "Titel des Assets",
    altPlaceholder: "Inhalt kurz beschreiben",
    urlPlaceholder: "https://… oder /pfad/zur/datei",
    libraryDescription:
      "{count} Asset(s) für Mandant {tenant}. Hinweis: In-Memory pro Request — Liste nach dem Anlegen ggf. aktualisieren.",
    formTitle: "Medien-Asset anlegen",
    formDescription:
      "Neues URL-basiertes Medien-Asset zur Bibliothek hinzufügen (kein Datei-Upload).",
    chooseType: "Typ wählen",
    chooseTypeSr: "Asset-Typ",
    creating: "Wird angelegt …",
    createButton: "Medien-Asset anlegen",
    createSuccess:
      'Asset erstellt: „{title}" (persisted={persisted} — In-Memory, nicht dauerhaft).',
    createFailed: "Medien-Asset konnte nicht angelegt werden",
  },
  privacyPage: {
    eyebrow: "Compliance",
    title: "Datenschutz",
    description: "Datenschutz-Scan-Jobs und manuelle Prüfung (Foundation-UI).",
    newScanTitle: "Neuer Scan",
    newScanDescription:
      "Datenschutz-Scan für eine Ziel-URL starten (Foundation, URL-basiert).",
    hintTitle: "Hinweis",
    okTitle: "OK",
    urlPlaceholder: "https://beispiel.de",
    scanCompleteAria: "Scan abgeschlossen",
    noticeTitle: "Hinweis",
    targetUrlLabel: "Ziel-URL",
    creating: "Wird angelegt …",
    createScanButton: "Scan anlegen",
    urlRequired: "Ziel-URL ist erforderlich.",
    createSuccess:
      "Scan in Mock-Modus eingereiht. Es findet noch kein echter Browser-Scan statt.",
    createFailed: "Datenschutz-Scan konnte nicht angelegt werden.",
    unexpectedError: "Unerwarteter Fehler.",
    approvalUpdated: "Freigabe-Status aktualisiert.",
    approvalUpdateFailed: "Freigabe konnte nicht aktualisiert werden.",
    scansHeading: "Datenschutz-Scans",
    emptyScansTitle: "Noch keine Scans",
    emptyScansDescription: "Legen Sie oben einen Scan an, um Ergebnisse zu sehen.",
    scanResultsTitle: "Scan-Ergebnisse",
    urlLabel: "URL",
    statusLabel: "Status",
    findingsLabel: "Fundstellen",
    findingSingular: "Fundstelle",
    findingPlural: "Fundstellen",
    approvalStatusLabel: "Freigabe-Status",
    findingsSectionTitle: "Fundstellen",
    noFindings: "Keine Fundstellen für diesen Scan.",
    createdAt: "Erstellt: {date}",
    footerWarning:
      "Dies ist eine Scanner-Basis: Es werden noch keine echten Browser-Scans ausgeführt. Manuelle Prüfung ist erforderlich; eine Freigabe ersetzt keine Rechtsberatung und garantiert keine Compliance.",
    approval: {
      draft: "Entwurf",
      reviewed: "Geprüft",
      approved: "Freigegeben",
      rejected: "Abgelehnt",
    },
    scanStatus: {
      queued: "Warteschlange",
      running: "Läuft",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      cancelled: "Abgebrochen",
    },
  },
  settingsForm: {
    saveFailed: "Speichern nicht möglich",
    siteIdentityTitle: "Website-Identität",
    siteIdentityDescription: "Öffentlicher Name und Branding-Hinweise.",
    siteName: "Website-Name",
    tagline: "Slogan",
    logoUrl: "Logo-URL",
    contactTitle: "Kontakt",
    contactDescription: "So erreichen Besucher diesen Mandanten.",
    email: "E-Mail",
    phone: "Telefon",
    address1: "Adresszeile 1",
    address2: "Adresszeile 2",
    postal: "Postleitzahl",
    city: "Ort",
    country: "Land",
    businessTitle: "Geschäft",
    businessDescription: "Optionale Hinweise für Besucher.",
    openingHours: "Hinweis Öffnungszeiten",
    appointment: "Hinweis Termine",
    legalTitle: "Rechtliches",
    legalDescription: "Verweise auf rechtliche Seiten per Slug.",
    responsible: "Verantwortliche Person",
    imprintSlug: "Impressum-Slug",
    imprintSlugDescription:
      "Wird im öffentlichen Footer für sprachbezogene Rechtslinks genutzt.",
    privacySlug: "Datenschutz-Slug",
    privacySlugDescription:
      "Wird im öffentlichen Footer für sprachbezogene Rechtslinks genutzt.",
    cookieSlug: "Cookie-Slug",
    socialTitle: "Social-Media-Links",
    socialDescription:
      "Werden im öffentlichen Footer als Textlinks angezeigt (Reihenfolge = Liste).",
    socialLabel: "Beschriftung",
    socialUrl: "URL",
    socialUrlDescription: "https://…, http://… oder /pfad",
    socialValidationError:
      "Social-Media-Links: Jeder Eintrag braucht eine nicht-leere Beschriftung und eine gültige URL (https://, http:// oder /…).",
    saveSuccess: "Einstellungen gespeichert.",
    saveSuccessPersisted:
      "Einstellungen gespeichert und im konfigurierten Datenbank-Adapter dauerhaft persistiert.",
    saveSuccessInMemory:
      "Gespeichert, aber nur im temporären Memory-Store. Noch nicht dauerhaft persistiert.",
    savePersistenceUnavailable:
      "Einstellungen konnten nicht dauerhaft gespeichert werden, da die Datenbank-Persistenz noch nicht verfügbar ist.",
    saveErrorGeneric: "Einstellungen konnten nicht gespeichert werden",
    saving: "Speichern …",
    saveButton: "Einstellungen speichern",
    saveBarAriaLabel: "Speichern und Persistenzstatus",
    saveStatusIdle: "Bereit zum Speichern",
    saveStatusIdleDetail: "Änderungen werden erst nach dem Speichern wirksam.",
    saveStatusUnsaved: "Änderungen noch nicht gespeichert",
    saveStatusUnsavedDetail: "Speichern, um die Einstellungen zu übernehmen.",
    saveStatusSaving: "Wird gespeichert …",
    saveStatusSavingDetail: "Bitte warten, bis der Vorgang abgeschlossen ist.",
    saveStatusPersisted: "Dauerhaft gespeichert",
    saveStatusPersistedDetail: "Die letzte Speicherung wurde im konfigurierten Datenbank-Adapter persistiert.",
    saveStatusMemory: "Temporär gespeichert",
    saveStatusMemoryDetail: "Nur im Memory-Store — noch nicht dauerhaft persistiert.",
    saveStatusUnavailable: "Persistenz aktuell nicht verfügbar",
    saveStatusUnavailableDetail: "Die letzte Speicherung konnte nicht dauerhaft abgelegt werden.",
    themeTokenGuidance:
      "Nur sichere CSS-Farb- und Längenwerte. Ungültige Eingaben werden vor der öffentlichen Ausgabe verworfen.",
    spinnerGuidance:
      "Preset und Geschwindigkeit gelten für öffentliche Ladeanzeigen — die Vorschau nutzt denselben CSS-Vertrag.",
    spinnerPreviewCaption: "Öffentliche Ladeanzeige (Vorschau)",
    socialExternalGuidance:
      "Externe Ziele prüfen: https:// oder http://, relative Pfade mit / — Datenschutz und Zielseiten beachten.",
    persistenceStatusGuidance:
      "Status nach der letzten Speicherung. Details stehen im Tab „System & Runtime“.",
    socialEmpty: "Keine Social-Links konfiguriert.",
    socialEmptyDescription: "Links erscheinen im öffentlichen Footer in der Reihenfolge dieser Liste.",
    remove: "Entfernen",
    addSocialLink: "Social-Media-Link hinzufügen",
    themeTitle: "Theme-Tokens",
    themeDescription:
      "Optionale CSS-Farb- und Radius-Tokens für die öffentliche Website. Werte werden vor der Injection bereinigt.",
    fontTitle: "Eigene Schriften (Prototyp)",
    fontDescription:
      "Lokale WOFF2-Schriften als Data-URL — keine produktive Storage-Strategie.",
    fontPrototypeHint:
      "Lokale Schriften sind aktuell als Prototyp per Data-URL eingebunden. Produktiv sollten sie später über verwaltete Media-/Storage-Assets referenziert werden.",
    fontEmpty: "Noch keine lokalen Schriftarten hinterlegt.",
    fontEmptyDescription: "WOFF2-Dateien werden im Prototyp als Data-URL eingebunden (max. 512 KB).",
    addFont: "Schrift hinzufügen",
    fontFamily: "Schriftfamilienname",
    fontWeight: "Schriftstärke",
    fontStyle: "Schriftstil",
    fontWoff2File: "WOFF2-Datei (max. 512 KB)",
    spinnerTitle: "Lade-Spinner",
    spinnerDescription:
      "Preset und Geschwindigkeit für öffentliche Ladeanzeigen (gleicher Vertrag wie in der Vorschau).",
    spinnerPreset: "Preset",
    spinnerSpeed: "Geschwindigkeit",
    spinnerPreviewTitle: "Spinner-Vorschau",
    spinnerPreviewDescription:
      "Vorschau nutzt denselben bereinigten CSS-Vertrag wie die öffentliche Website.",
    themeTokenInvalid:
      "Ungültiger CSS-Wert. Dieser Wert wird nicht in die öffentliche Ausgabe übernommen.",
    themeTokensSanitizedOnSave:
      "Einige Theme-Werte waren ungültig und wurden nicht für die öffentliche Ausgabe gespeichert. Markierte Felder korrigieren und erneut speichern.",
    fontUploadTooLarge: "Datei ist zu groß (max. 512 KB).",
    fontUploadWrongType: "Nur .woff2-Dateien mit MIME data:font/woff2 werden akzeptiert.",
    fontUploadFailed: "Schriftdatei konnte nicht gelesen werden.",
    fontUploadSuccess: "WOFF2-Datei angehängt (Prototyp-Data-URL).",
  },
  settingsDomains: {
    tabsAriaLabel: "Einstellungsbereiche",
    tabBranding: "Branding",
    tabAppearance: "Erscheinungsbild",
    tabNavigationLayout: "Navigation & Layout",
    tabSocialExternal: "Social & Externe Links",
    tabLegalGovernance: "Rechtliches & Governance",
    tabSystemRuntime: "System & Runtime",
    brandingIntro: "Zentrale Markenwirkung: Name, Schrift und Ladeanzeige.",
    brandingMarkHint: "Logo-URLs und Schriften an die öffentliche Markenführung anpassen.",
    appearanceIntro:
      "Globale Gestaltung der öffentlichen Oberfläche. Unsichere CSS-Werte werden nicht übernommen.",
    navigationLayoutIntro:
      "Globale Struktur- und Layoutoptionen. Seiten- und Blocknavigation bleiben separat steuerbar.",
    socialExternalIntro:
      "Externe Profile und Verlinkungen prüfen. Datenschutz und Ziel-URLs beachten.",
    legalGovernanceIntro: "Rechtliche Angaben und veröffentlichungsrelevante Hinweise.",
    systemRuntimeIntro:
      "Technische Laufzeitinformationen, Persistenzstatus und Prototyp-Grenzen.",
    themePresetTitle: "Theme-Presets",
    themePresetDescription: "Benannte Ausgangspunkte für Farben und Radius (Tokens unten).",
    themePresetNote:
      "Preset-Sammlungen sind noch nicht automatisiert — Tokens vorerst im Abschnitt darunter anpassen.",
    themePresetEmptyTitle: "Aktuell wird das Standard-Theme verwendet.",
    themePresetEmptyDescription:
      "Benannte Presets sind noch nicht angebunden. Farben und Radius unten manuell als Tokens setzen.",
    previewFrameLabel: "Vorschau",
    themePreviewTitle: "Theme-Vorschau",
    themePreviewDescription: "Beispielfläche mit bereinigten Theme-Tokens.",
    themePreviewSampleTitle: "Beispielüberschrift",
    themePreviewSampleBody: "Fließtext nutzt gedämpfte Vordergrund-Tokens, sofern gesetzt.",
    themePreviewSampleButton: "Primäre Aktion",
    themePreviewSampleMuted: "Sekundär",
    navigationMenusTitle: "Menüs & Navigation",
    navigationMenusDescription: "Haupt- und Footer-Menüs werden auf eigenen Seiten gepflegt.",
    navigationMenusNote:
      "Links unten nutzen — Reihenfolge und Ziele bleiben getrennt von diesen Einstellungen.",
    navigationMainLink: "Hauptnavigation",
    navigationFooterLink: "Footer-Navigation",
    consentGovernanceTitle: "Consent & Governance",
    consentGovernanceDescription: "Hinweise zur datenschutzrelevanten Veröffentlichung.",
    consentGovernanceNote:
      "Detaillierte Consent-Konfiguration liegt im Privacy-Bereich; Rechts-Slugs unten speisen Footer-Links.",
    persistenceStatusTitle: "Persistenzstatus",
    persistenceStatusDescription: "Ergebnis des letzten Speicherns (nach jedem Save aktualisiert).",
    persistenceModeLabel: "Modus",
    persistedLabel: "Letztes Save persistiert",
    persistenceMemory: "Memory (Prototyp)",
    persistenceDatabase: "Datenbank",
    persistenceUnavailable: "Nicht verfügbar",
    persistenceUnknown: "Noch nicht gespeichert",
    persistedYes: "Ja — dauerhaft gespeichert",
    persistedNo: "Nein — nicht dauerhaft",
    persistedUnknown: "—",
    fontPrototypeTitle: "Eigene Schriften (Prototyp)",
    fontPrototypeDescription: "Temporäre Data-URL — keine produktive Storage-Strategie.",
    runtimeNotesTitle: "Runtime-Hinweise",
    runtimeNotesDescription: "Grenzen dieser Einstellungsoberfläche.",
    runtimeNoteTenantScope: "Lesen und Schreiben nur mit serverseitig aufgelöstem Mandanten-Scope.",
    runtimeNoteSanitizer:
      "Theme- und Schriftwerte durchlaufen CSS-Sanitizer vor öffentlichem CSS.",
    runtimeNoteNoLowLevel: "Kein JSON-Rohdaten-Editor und keine Low-Level-Adapter-Steuerung.",
  },
  navigationForm: {
    scope: "Bereich",
    label: "Beschriftung",
    type: "Typ",
    page: "Seite",
    href: "Link-URL",
    labelPlaceholder: "Link-Beschriftung",
    hrefPlaceholder: "https://… oder /pfad",
    emptyItemsDescription: "Erstellen Sie einen Eintrag über das Formular oben.",
  },
  createPageForm: {
    titleLabel: "Titel *",
    titlePlaceholder: "Seitentitel eingeben",
    slugLabel: "Slug *",
    slugDescription:
      "Kleinbuchstaben und Bindestriche (Buchstaben, Zahlen, Bindestriche). Sonderzeichen werden normalisiert.",
    slugPlaceholder: "z. B. ueber-uns oder leistungen/beratung",
    templateLabel: "Vorlage",
    templateDescription: "Startvorlage für erste Blöcke wählen.",
    localeLabel: "Sprache",
    localeDescription: "Aktivierte Sprachen aus der Mandanten-Konfiguration.",
    cardTitle: "Neue Seite anlegen",
    cardDescription: "Neue Seite mit den Kompositions-Standardwerten für diesen Mandanten.",
    createdLabel: "Seite erstellt:",
    inMemoryHint: "Hinweis: In-Memory-Daten sind aktuell nicht dauerhaft persistiert.",
    createFailed: "Seite konnte nicht erstellt werden",
    createErrorGeneric: "Seitenerstellung fehlgeschlagen",
    creating: "Wird erstellt …",
    createButton: "Seite anlegen",
    droppedLocalesWarning:
      "Einige Kompositions-Sprachen werden von der Laufzeit nicht unterstützt: {locales}.",
    slugUnsupportedWarning:
      'Der Slug enthält nur ungültige Zeichen; beim Absenden wird „page“ verwendet, sofern Sie keinen gültigen Slug eingeben.',
    starterBlocks: "Start-Blöcke:",
    noTemplateDescription: "Keine Vorlagenbeschreibung verfügbar.",
    compositionDefaults:
      "Kompositions-Standardwerte: Marke {brandId}, Standardvorlage {templateId}, Standardsprache {locale}.",
  },
  appearance: {
    ariaLabel: "Darstellung wählen",
    light: "Hell",
    lightDescription: "Helles Admin-Theme",
    dark: "Dunkel",
    darkDescription: "Dunkles Admin-Theme",
  },
  featureGridList: {
    shortTitlePlaceholder: "Kurztitel",
    bodyPlaceholder: "Beschreibung oder Fließtext",
  },
  contactFormPreview: {
    namePlaceholder: "Ihr Name",
    emailPlaceholder: "ihre@email.de",
    phonePlaceholder: "Ihre Telefonnummer (optional)",
    messagePlaceholder: "Ihre Nachricht",
  },
  seoForm: {
    seoTitle: "SEO-Titel",
    seoDescription: "SEO-Beschreibung",
    canonicalUrl: "Canonical-URL",
    seoImage: "SEO-Bild",
    metaTitlePlaceholder: "Seitentitel für Suchergebnisse",
    metaDescriptionPlaceholder: "Seitenbeschreibung für Suchergebnisse",
    canonicalPlaceholder: "https://beispiel.de/seite oder /relativer/pfad",
    titleHelp: "{count}/60 (empfohlen: 30–60)",
    descriptionHelp: "{count}/160 (empfohlen: 100–160)",
    canonicalHelp: "Optional: bevorzugte URL für diese Seite",
    robotsIndexOn: "✓ Indexieren",
    robotsIndexOff: "✗ Nicht indexieren",
    robotsIndexHelpOn: "Suchmaschinen dürfen diese Seite indexieren",
    robotsIndexHelpOff: "Suchmaschinen sollen diese Seite nicht indexieren",
    tenantIdMissing: "Fehler: Mandanten-ID nicht verfügbar",
  },
  contentTemplates: {
    "empty-page-template": {
      label: "Leere Seite",
      description: "Mit einer leeren Seite starten und Blöcke manuell hinzufügen.",
    },
    "basic-page-template": {
      label: "Basisseite",
      description: "Einfacher Start mit Hero und einem Textabschnitt.",
    },
    "landing-page-template": {
      label: "Landingpage",
      description: "Hero plus zwei strukturierte Textabschnitte für Features und CTA.",
    },
  },
  blockPreview: {
    headline: "Überschrift",
    subline: "Unterzeile",
    body: "Fließtext",
    mediaUrl: "Medien-URL",
    emptyHeadline: "(keine Überschrift)",
    emptyBody: "(kein Fließtext)",
  },
  inspectorPanel: {
    ariaLabel: "Eigenschaften-Bereich",
  },
}
