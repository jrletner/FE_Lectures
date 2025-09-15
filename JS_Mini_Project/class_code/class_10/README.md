# Campus Club Manager — Class 10 (Completed)

Break room, 10:13 AM.

- Codi: How are you feeling about saving data?
- Garrett: I don’t want to lose changes on refresh—and I’d like import/export.
- Codi: I’ll add explicit model serialization, auto‑save to localStorage after mutations, load on startup, and simple Import/Export/Reset flows in the toolbar.

## Codi’s user stories

- As a visitor, my changes persist across reloads via localStorage.
- As a visitor, I can export JSON and import it later to restore my data.
- As a developer, models round‑trip with `toPlain()`/`fromPlain()` so behavior is preserved.
- As a developer, Reset clears storage and returns to a safe default seed.
