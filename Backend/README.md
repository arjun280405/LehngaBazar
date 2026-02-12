# Backend setup - Firebase Google Sign-in

To enable server-side verification of Firebase ID tokens (Google Sign-in), provide Firebase Admin credentials and restart the server.

Steps:

1. In the Firebase Console go to Project Settings → Service Accounts → Generate new private key. Download the JSON file.
2. Save the JSON file into the backend project, e.g. `Backend/config/serviceAccountKey.json` (don't commit this file to source control).
3. Create or update `Backend/.env` with one of:

   - `FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json`

   or

   - `FIREBASE_SERVICE_ACCOUNT=<your JSON content here as a single-line string>` (less recommended)

4. Restart the backend (e.g., `npm run dev`).

Notes:

- During local development cookies are set with `secure=false` and `sameSite=lax` to work on `http://localhost`. In production `secure=true` and `sameSite=none` will be used.
- After setup, Google sign-ins from the frontend will send the ID token to `/api/auth/googlesignin` and the server will verify the token and create/update the corresponding user in MongoDB.

Development fallback (optional):

If you cannot provide a Firebase service account (e.g., quick local dev), you can enable a safe-development bypass:

- Add to `Backend/.env`:

  - `ALLOW_GOOGLE_BYPASS=true`
  - `DEV_GOOGLE_KEY=some-secret-key`

- From the frontend, post to `/api/auth/googlesignin` with JSON body: `{ "email": "dev@example.com", "name": "Dev User", "uid": "dev-uid" }` and include header `x-dev-google-key: some-secret-key`.

This will create or update a user in the database with `authProvider: 'google'` and set a cookie for local testing **only**. Do NOT enable this in production.

If you use the dev bypass, you can set frontend env variables (for Vite) to trigger the fallback automatically after sign-in failure:

- `VITE_ALLOW_GOOGLE_BYPASS=true`
- `VITE_DEV_GOOGLE_KEY=some-secret-key`

The frontend will attempt the dev bypass only when it detects the specific server error about verification and the Vite env variables are set.
