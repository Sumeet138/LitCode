/**
 * Reset Question Collection Script
 * 
 * This script deletes and recreates the question collection with the updated schema
 * that supports an array of tags instead of a single tag string.
 * 
 * Run this from Appwrite Console or manually delete the 'questions' collection
 * and restart your dev server to auto-recreate it.
 */

// Manual Steps to Fix:
// 
// Option 1: Via Appwrite Console (Recommended)
// ============================================
// 1. Open your Appwrite Console (usually http://localhost/console or your cloud URL)
// 2. Navigate to: Databases → [Your Database] → questions collection
// 3. Click on the "Settings" tab
// 4. Scroll down and click "Delete Collection"
// 5. Confirm deletion
// 6. Restart your dev server (npm run dev)
// 7. The middleware will automatically recreate the collection with the new schema
//
// Option 2: Update Attribute Manually
// ====================================
// 1. Open Appwrite Console → Databases → questions collection → Attributes
// 2. Delete the "tags" attribute
// 3. Click "Create Attribute" → String
// 4. Set:
//    - Key: tags
//    - Size: 50
//    - Required: Yes
//    - Array: Yes ← This is the important change!
// 5. Save
//
// After either option, you should be able to create questions with multiple tags!

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Question Collection Reset Instructions                      ║
╚══════════════════════════════════════════════════════════════╝

📝 The 'tags' attribute needs to be changed from:
   ❌ Single string → ✅ Array of strings

🔧 Follow these steps:

1. Open your Appwrite Console
2. Go to: Databases → questions collection
3. Settings → Delete Collection
4. Restart dev server (it will auto-recreate with new schema)

OR manually update the tags attribute to be an array.

Then try creating a question with tags again!
`)
