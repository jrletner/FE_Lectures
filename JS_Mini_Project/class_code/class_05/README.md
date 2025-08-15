# Campus Club Manager — Class 5 (Completed)
**Lesson:** DOM Rendering Patterns  
**Goal:** Add **Add Member** UI using **event delegation** and re-render from state.

## What Changed from Class 4
- Each club card now shows a **Members** section with a list and an inline **Add Member** form.
- Click handlers use **event delegation** on the card container (`#club-info`), so newly rendered buttons work without re-binding.
- Simple status messages show validation results for member add attempts.
- Kept the **Create Club** form from previous classes.

## Try in Console
```js
// Add a member the "old" way:
clubs[0].addMember("Riley");
renderClubs();
```
