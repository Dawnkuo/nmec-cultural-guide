// Compatibility entry point: never silently test only the old NMEC export.
await import('./qa-catalog.mjs');
await import('./qa-full-site.mjs');
