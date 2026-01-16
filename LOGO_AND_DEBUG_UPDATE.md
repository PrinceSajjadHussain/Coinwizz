# Logo Update & Bubble Debug Implementation

## Date: January 13, 2026

---

## Changes Made

### 1. Logo Implementation - `assets/img/icon.jpeg`

All pages now use the CoinWizz icon logo from `assets/img/icon.jpeg` instead of the old SVG logo.

#### Files Updated:

**index.html (Homepage/Cryptobubbles)**
- ✅ Added favicon: `<link rel="icon" type="image/jpeg" href="assets/img/icon.jpeg">`
- ✅ Replaced main header logo (line ~4133)
- ✅ Replaced auth gate logo (line ~3797)
- 🎨 Added border-radius for rounded corners

**top100.html (Top 100 Charts)**
- ✅ Added favicon: `<link rel="icon" type="image/jpeg" href="assets/img/icon.jpeg">`
- ✅ Replaced text logo with icon + text combo (line ~1741)
- 🎨 Logo displayed next to "COINWIZZ" text
- 🎨 Added border-radius for rounded corners

**dashboard.html (Member Dashboard)**
- ✅ Added favicon: `<link rel="icon" type="image/jpeg" href="assets/img/icon.jpeg">`
- ✅ Replaced SVG logo with icon (line ~303)
- 🎨 Added border-radius for rounded corners

---

### 2. Debug Logging for Subscription Limits

Added comprehensive console logging to debug why bubbles might not be showing according to the plan.

#### index.html - Bubble Display Logging

**getUserCoinLimit() Function:**
```javascript
console.log('[COIN LIMIT] No user logged in, returning 15 coins');
// or
console.log(`[COIN LIMIT] User plan: ${plan}, Coin limit: ${limit}`);
```

**initBubbles() Function:**
```javascript
console.log(`[INIT BUBBLES] Creating bubbles for ${coinLimit} coins out of ${data.length} available`);
console.log(`[INIT BUBBLES] Created ${bubbles.length} bubbles for main canvas`);
```

#### top100.html - Audio Button Logging

**getUserAudioLimit() Function:**
```javascript
console.log('[AUDIO LIMIT] No user logged in, returning 3 audio buttons');
// or
console.log(`[AUDIO LIMIT] User plan: ${plan}, Audio limit: ${limit}`);
```

---

## How to Test

### Visual Changes (Logo)

1. Open any page (index.html, top100.html, dashboard.html)
2. Check browser tab - should see CoinWizz icon as favicon
3. Check header - should see CoinWizz icon logo (rounded corners)
4. On index.html auth gate - should see larger CoinWizz icon

### Debug Logging (Bubbles)

**For Free Users (Not Logged In):**
1. Open browser console (F12)
2. Load index.html
3. Look for console messages:
   ```
   [COIN LIMIT] No user logged in, returning 15 coins
   [INIT BUBBLES] Creating bubbles for 15 coins out of 100 available
   [INIT BUBBLES] Created 15 bubbles for main canvas
   ```
4. You should see exactly **15 bubbles** on the screen

**For Rallye25 Subscribers:**
1. Log in with account that has `plan: "rallye25"`
2. Check console:
   ```
   [COIN LIMIT] User plan: rallye25, Coin limit: 25
   [INIT BUBBLES] Creating bubbles for 25 coins out of 100 available
   [INIT BUBBLES] Created 25 bubbles for main canvas
   ```
3. You should see exactly **25 bubbles** on the screen

**For Rallye50 Subscribers:**
1. Log in with account that has `plan: "rallye50"`
2. Check console:
   ```
   [COIN LIMIT] User plan: rallye50, Coin limit: 50
   [INIT BUBBLES] Creating bubbles for 50 coins out of 100 available
   [INIT BUBBLES] Created 50 bubbles for main canvas
   ```
3. You should see exactly **50 bubbles** on the screen

**For Elite/Rallye100 Subscribers:**
1. Log in with account that has `plan: "rallye100"` or `plan: "elite"`
2. Check console:
   ```
   [COIN LIMIT] User plan: rallye100, Coin limit: 100
   [INIT BUBBLES] Creating bubbles for 100 coins out of 100 available
   [INIT BUBBLES] Created 100 bubbles for main canvas
   ```
3. You should see exactly **100 bubbles** on the screen

---

## Troubleshooting

### Issue: Bubbles Not Showing Correct Amount

**Check the console logs:**

1. **If you see:**
   ```
   [COIN LIMIT] No user logged in, returning 15 coins
   ```
   But you ARE logged in → Check localStorage:
   - Open console
   - Type: `localStorage.getItem('cryptoUser')`
   - Verify `loggedIn: true` and correct `plan` value

2. **If you see:**
   ```
   [COIN LIMIT] User plan: free, Coin limit: 15
   ```
   But you have a paid plan → The plan value is wrong:
   - Check: `JSON.parse(localStorage.getItem('cryptoUser')).plan`
   - Should be: `"rallye25"`, `"rallye50"`, `"rallye100"`, or `"elite"`
   - NOT: `"free"` or empty

3. **If bubbles are created but not visible:**
   - Check: `[INIT BUBBLES] Created X bubbles`
   - If it says created but you don't see them → Canvas rendering issue
   - Try refreshing the page
   - Check if canvas element exists in DOM

### Issue: Logo Not Showing

**Check file path:**
- Logo file should be at: `crypto-screener/dist/assets/img/icon.jpeg`
- If 404 error → Move the icon.jpeg file to correct location

---

## Expected Console Output Examples

### Free User on index.html:
```
[COIN LIMIT] No user logged in, returning 15 coins
[INIT] Creating bubbles with data...
[INIT BUBBLES] Creating bubbles for 15 coins out of 100 available
[INIT BUBBLES] Created 15 bubbles for main canvas
[INIT] Bubbles initialized: 15
```

### Rallye25 User on index.html:
```
[COIN LIMIT] User plan: rallye25, Coin limit: 25
[INIT] Creating bubbles with data...
[INIT BUBBLES] Creating bubbles for 25 coins out of 100 available
[INIT BUBBLES] Created 25 bubbles for main canvas
[INIT] Bubbles initialized: 25
```

### Free User on top100.html:
```
[AUDIO LIMIT] No user logged in, returning 3 audio buttons
```
(Then only first 3 rows should have active audio buttons)

### Rallye50 User on top100.html:
```
[AUDIO LIMIT] User plan: rallye50, Audio limit: 50
```
(Then first 50 rows should have active audio buttons)

---

## File Locations

### Logo File:
- **Path:** `crypto-screener/dist/assets/img/icon.jpeg`
- **Type:** JPEG image
- **Usage:** Favicon + Header logos

### Modified Files:
1. `crypto-screener/dist/index.html`
   - Lines ~1-8: Favicon added
   - Lines ~3797: Auth gate logo
   - Lines ~4133: Header logo
   - Lines ~4453-4465: getUserCoinLimit() with logging
   - Lines ~6821-6831: initBubbles() with logging

2. `crypto-screener/dist/top100.html`
   - Lines ~1-7: Favicon added
   - Lines ~1741-1744: Header logo
   - Lines ~2045-2061: getUserAudioLimit() with logging

3. `crypto-screener/dist/dashboard.html`
   - Lines ~1-7: Favicon added
   - Lines ~303: Header logo

---

## Next Steps

1. **Test with actual users:**
   - Free user → Should see 15 bubbles
   - Paid users → Should see 25/50/100 bubbles based on plan

2. **Monitor console logs:**
   - Check if limits are being calculated correctly
   - Verify plan values are correct

3. **If issues persist:**
   - Share console log output
   - Check localStorage content
   - Verify PayPal integration is setting plan correctly

---

## Summary

✅ **Logo updated** on all 3 main pages (index, top100, dashboard)
✅ **Favicon added** to all 3 pages
✅ **Debug logging** added for troubleshooting subscription limits
✅ **Console messages** clearly show:
   - What plan the user has
   - How many coins/buttons should be shown
   - How many were actually created

The debug logs will help identify exactly where the issue is if bubbles aren't displaying correctly!
