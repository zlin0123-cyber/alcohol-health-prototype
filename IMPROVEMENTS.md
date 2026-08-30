# Record flow v2 improvements

This version upgrades the Record flow from a high-fidelity prototype into a more complete local frontend workflow while preserving the existing visual language.

## Implemented in this version

### Record Main
- Added a `?` help button matching the Home help treatment.
- Added the agreed "How to record a drink" bottom-sheet tutorial.
- Existing built-in drink cards are now clickable and open Record Consumption directly.
- My Drinks cards are clickable and also open Record Consumption directly.
- Search and category browsing continue to use the same selectable drink-card flow.

### My Drinks management
- Added Edit for custom drinks.
- Added Delete with confirmation.
- Editing changes the saved drink definition for future use only.
- Deleting removes the drink from My Drinks only.
- Historical consumption records remain unchanged because each record stores its own drink snapshot.

### Add Manually
- `Save & Continue` now saves the new custom drink to My Drinks before opening Record Consumption.
- Returning from Record Consumption to Drink Details retains the entered data.
- If a saved custom drink is changed after returning to Step 1, continuing updates the same My Drink instead of creating a duplicate.
- Scan Label remains visible as a future feature and is not simulated.

### Record Consumption
- Existing library drinks and My Drinks now share the same Record Consumption screen.
- mL / serving / container modes remain functional.
- Estimated standard drinks remain visible before submission.
- Date and time are stored with the consumption record.
- `Record Drink` saves a complete consumption record rather than only a drink definition.

### Result / feedback
- Added a post-record `Drink recorded` feedback screen.
- Shows standard drinks for the individual record.
- Shows daily total against the `/4` guideline reference.
- Shows weekly total against the `/10` guideline reference.
- Weekly aggregation uses a Monday-to-Sunday calendar week containing the recorded date.
- Uses contextual states such as below / approaching / at / above the guideline reference rather than presenting a remaining drinking allowance.
- Includes the message: `The less you drink, the lower your risk of harm.`
- Includes a drinking-and-driving safety reminder.
- Includes links to:
  - Alcohol & Driving
  - Alcohol & Ageing
  - Standard Drinks
  - Australian Alcohol Guidelines
- `Done` returns to Record Main.

### Navigation and persistence
- Bottom-nav Learn always opens Learn Hub.
- Bottom-nav Record always opens Record Main.
- My Drinks and consumption records persist in browser `localStorage`.

## Intentionally still not implemented

These require later product/data/integration work and are not faked in this build:

- Real barcode scanning and product lookup
- Label image recognition / OCR autofill
- A larger external drink/product database with dedicated brand metadata
- Trends visualisation
- Awards/challenges logic
- Backend/cloud sync or multi-device persistence

## Local storage keys

- `alcohol-health.my-drinks.v1`
- `alcohol-health.consumption-records.v1`

## Recommended manual test

1. Open Record and verify the `?` tutorial opens/closes.
2. Click a built-in drink card and verify it opens Record Consumption directly.
3. Change amount/mode and verify Estimated standard drinks update.
4. Record it and verify the Result screen shows This Drink, daily `/4`, and weekly `/10` context.
5. Use each Learn link from the Result screen.
6. Return to Record and use Add Manually.
7. Enter a custom drink and press Save & Continue; then go Back to Details and verify values remain.
8. Complete the record and verify the new drink remains in My Drinks after refresh.
9. In My Drinks, Edit the drink and save changes.
10. Confirm historical consumption records are unaffected by that edit.
11. Delete the My Drink and confirm the deletion dialog; historical consumption data should remain stored.
12. Verify bottom-nav Learn opens Learn Hub and Record opens Record Main from nested screens.

## v2.1 UX refinements

### Preserve Record browsing context on Back
- Record now keeps the current category and search query while the user opens a drink card.
- Returning from Record Consumption restores that category/query instead of resetting to All.
- Returning from Add Manually also preserves the browsing context.
- Using the bottom-navigation Record tab remains a fresh entry and resets Record Main to All with an empty search.
- Completing a record and choosing Done also returns to the default All state.

### Drink-type-aware defaults in Add Manually
- The default reference values now follow the selected drink type:
  - Beer: 4.5% ABV, 375 mL, Can
  - Wine: 13.5% ABV, 750 mL, Bottle
  - Spirits: 40% ABV, 700 mL, Bottle
  - Cider: 4.5% ABV, 375 mL, Can
  - RTD: 5% ABV, 375 mL, Can
  - Other: blank ABV/size, Other container
- These values are only autofill references for Add Manually; users can still enter the actual product values.
- Once a user manually changes ABV, size, or container type, changing Drink type no longer silently overwrites that edited field.
- Edit Drink mode never replaces existing saved values with category defaults.

## Mobile web fixes — v2.2

- Removed the simulated iOS status bar from the deployed React application. The Figma prototype remains unchanged.
- Switched the app shell to the dynamic mobile viewport (`100dvh`) and enabled safe-area handling for iPhone.
- Updated the bottom navigation to respect `safe-area-inset-bottom`.
- Added consistent bottom clearance to scrollable screens so content is not hidden behind the fixed navigation.
- Changed Home from a clipped single-screen layout to a vertically scrollable mobile-web layout. All four Home feature actions can now be reached on shorter Safari viewports without shrinking the design.
- Preserved the Alrecord browser title in `.figma/make/site.json`.
- Date/time picker behaviour was intentionally left unchanged in this pass.

