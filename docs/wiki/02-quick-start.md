# 02 Quick start

## Demo, the path a new engineer should run

1. Clone the repository.
2. From `app/`, remove a leftover `node_modules` symlink if one is present, then `npm ci`.
3. `npm run build`, then `npm run dev`.
4. Open `http://127.0.0.1:18191/`.
5. Confirm Chat is the first view, the appearance is light, and the dataset is marked synthetic.
6. Choose **We missed our production goal.** or type `Run my plant review.`
7. Read the answer. Open **Evidence and investigation** on that reply.
8. Press **New conversation** when you want a clean thread.

The provider stays disconnected. That is expected. Do not paste a key into Chat.

## Reset

**New conversation** clears the thread and the current referent. Saved earlier conversations stay in browser storage until you remove the profile or the demo state directory. Do not delete fixture JSON to reset a session.

## Tests

From `app/`: `npm test` and `npm run build`. Create `evidence/` at the repository root if a historical proof tries to write there and fails.

## If something fails

Use the troubleshooting table in the repository README. Pricing expiry and a missing live capability are fail-closed results, not reasons to switch the demo onto synthetic data in secret.
