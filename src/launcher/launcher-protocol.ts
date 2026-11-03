/**
 * Single source of truth for the launcher diagnostic protocol. No runtime
 * install/self-heal is permitted. A protocol answer is not artifact approval.
 *
 * History:
 * 1 — initial on-PATH launcher.
 * 2 — Bun discovery fixes: no re-exec loop on Bun < 1.2.16 (#4933, #4940) and
 *     Windows checks explicit/known Bun paths before a bounded where.exe
 *     lookup (#4934, #4966).
 * 3 — private explicit-root controlled refusal; no discovery, child or repair.
 */
export const LAUNCHER_PROTOCOL = 3;
