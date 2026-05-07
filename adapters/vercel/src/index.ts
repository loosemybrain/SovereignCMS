export type VercelDeploymentHints = {
  /** z. B. Preview-Branch, Projekt-ID — rein optional für SaaS-KMU-Pfad */
  projectId?: string
}

/** Optionaler Deployment-Helfer ohne Laufzeit-Zwang zur Vercel-Plattform. */
export function describeVercelAdapter(_hints: VercelDeploymentHints = {}) {
  return {
    id: "vercel" as const,
    note: "SovereignCMS: Vercel-Adapter ist optional; Gov-Variante bleibt portabel.",
  }
}
