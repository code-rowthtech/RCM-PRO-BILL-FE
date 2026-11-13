# RCM PRO BILL — Administration Frontend

A React administration portal for managing clinics, onboarding information, billing and contracts, subscription plans, staff access, and supporting master data. It also provides doctor/patient overview screens and a dashboard.

The application lives in `admin/`. This repository contains the frontend and existing compiled assets, not the backend API, database, or production clinical/billing services.

> **Source review needed:** `admin/src/cryptoUtils.js` contains an embedded RSA private key, and `admin/src/routes/PrivateRoute.js` contains obfuscated loader code. Review and remove the unsafe loader before running the application, replace the exposed key pair wherever used, and clean tracked source/history before public release. This documentation/ignore-file update does not alter those files. `.gitignore` cannot hide already-committed code or credentials.

## What the website does

The portal provides a central administrative workspace for a clinic platform. An administrator can review clinic records, onboard a clinic through information/billing/contract steps, assign subscription details, manage subordinate clinics and staff users, and maintain options used throughout the system.

The doctor and patient screens provide administrative views of records returned by the backend. This frontend does not itself implement claim submission, insurer connectivity, payment processing, clinical data storage, or a healthcare interoperability server.

## Main modules

| Module | Functionality represented in the source |
| --- | --- |
| Dashboard | Analytics summary and template task/activity widgets. |
| Clinics | List clinics, open details, and create/update onboarding records. |
| Clinic onboarding | Clinic-information, billing, and contract sections with supporting document forms. |
| Contracts | Contract details, generation requests, and standard/template management interfaces. |
| Subscriptions | List, create, and update subscription plans and assign clinic plan information. |
| Doctors and patients | Administrative list views backed by API requests. |
| Roles and staff | Roles, permissions, and sub-user management request flows. |
| Master data | Settings such as plan names, tenure, job titles, clinic types, departments, designations, specialties, locations, and related options. |
| Email changes | OTP-generation, verification, and email-change request flows. |
| Files | Presigned-URL requests and direct file uploads to storage. |

Some pages originate from the Hyper admin template and use sample content or local interface state. A screen, export dependency, or navigation label does not establish a complete backend workflow. Check the corresponding feature API adapter before relying on a particular operation.

## Typical administration workflow

1. Sign in with an account provided by the backend.
2. Open the clinic list and create or select a clinic.
3. Complete clinic information, billing/subscription details, and contract sections.
4. Upload supporting documents where required.
5. Review clinic information and maintain its associated users, subscriptions, and settings.
6. Review doctor/patient lists and available analytics.

Persistence, authorization, email/OTP delivery, contract generation, and document storage depend on the backend and external services. No working backend account is supplied by this repository.

## Routes and navigation

| Route | Screen |
| --- | --- |
| `/account/login` | Main login. |
| `/account/forget-password` | Password recovery. |
| `/account/reset-password/:token` | Password reset. |
| `/dashboard/project` | Dashboard. |
| `/apps/rcm/allclinics` | Clinic list. |
| `/apps/rcm/addclinic` | Clinic onboarding. |
| `/apps/rcm/updateclinic` | Clinic update workspace. |
| `/apps/appointments/list` | Appointment interface. |
| `/apps/doctors/list` | Doctor list. |
| `/apps/patients/list` | Patient list. |
| `/apps/subscriptions/list` | Subscriptions. |
| `/apps/roles/list` | Role/user interface. |
| `/settings/...` | Master-data, permission, and contract settings. |

The complete route tree is in `admin/src/routes/index.js`. Alternate account layouts, error pages, and other template examples are also present. Some routes and menu entries are commented out. The backend must enforce account permissions and record access independently of frontend navigation.

## Technology and architecture

React 17, React Router 6, Redux, Redux Saga, Axios, Bootstrap 5, React Bootstrap, React Hook Form, Yup, Sass, i18next, charting libraries, and rich-text editors. The package also includes PDF/document-generation libraries.

The project uses Create React App through `react-scripts` 4 and contains Flow annotations in JavaScript. The root app loads the Saas theme. Fake-backend initialization is commented out in the current `App.js`; old template credentials should not be treated as working admin credentials.

```text
React page/form -> Redux action -> Saga -> Feature API adapter
    -> Backend API -> Reducer -> Updated UI
```

## Backend configuration

`admin/src/config.js` reads `REACT_APP_API_URL`. Most endpoint constants already include `/api/v1/admin/...`, while the upload helper and some email-change paths concatenate relative API paths. Configure the backend origin with a trailing slash.

Example `admin/.env.local`:

```dotenv
REACT_APP_API_URL=http://localhost:3001/
```

Use the origin of your actual backend. This example deliberately uses a different port from the frontend's default port `3000`.

The config module also references `PUBLIC_KEY` and `PRIVATE_KEY`, but the active crypto helper contains embedded key material. These variables do not establish a complete private environment-based crypto configuration. Browser bundles and Create React App public environment values cannot keep private keys confidential.

| API area | Representative frontend paths |
| --- | --- |
| Authentication | `/api/v1/admin/users/signIn`, `/api/v1/admin/users/forgotPassword`, `/api/v1/admin/users/resetPassword` |
| Clinics | `/api/v1/admin/clinics`, `/api/v1/admin/clinic/byId`, `/api/v1/admin/users/create`, `/api/v1/admin/users/edit` |
| Clinic subscriptions | `/api/v1/admin/users/addSubscriptionPlan` |
| Sub-clinics | `/api/v1/admin/sub-clinics` |
| Contracts | `/api/v1/admin/getContractDetails`, `/api/v1/admin/generateContract`, template-management endpoints. |
| Doctor/patient lists | `/api/v1/admin/getAllDoctors`, `/api/v1/admin/getAllPatients` |
| Analytics | `/api/v1/admin/analytics` |
| Subscription plans | `/api/v1/admin/subscription/all`, `/api/v1/admin/subscription/add`, `/api/v1/admin/subscription/update` |
| Master data | `/api/v1/admin/masterdata` and related retrieval/edit endpoints. |
| Roles and staff | `/api/v1/admin/roles/...`, `/api/v1/admin/sub-users/...` |
| Uploads | `/api/v1/admin/s3/get-presigned-url`, followed by a direct file `PUT`. |

See `admin/src/helpers/api/apiEndpoints.js` and `admin/src/redux/` for exact paths, request bodies, and response handling. Backend CORS and storage permissions must permit the deployed frontend's origin.

## Development setup

Complete the source review noted above before running this checkout. These commands describe the intended setup after that review; this documentation update did not execute installation or application code.

The package does not declare a Node engine range. Use Node.js/npm compatible with this legacy Create React App stack. On modern Node versions, OpenSSL compatibility mode may be required.

From the repository root:

```bash
cd admin
npm install --legacy-peer-deps
```

Create `admin/.env.local` with your backend origin, then start the frontend from `admin/`:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

Open `http://localhost:3000/account/login`. Authentication and live data require the compatible backend, its encryption/response contract, and a provisioned account.

## Commands

Run these commands inside `admin/`:

| Command | Purpose |
| --- | --- |
| `npm start` | Start the development server. |
| `npm run build` | Generate production assets in `admin/build/`. |
| `npm test -- --watchAll=false` | Run Jest without watch mode. |
| `npm run flow` | Run the configured Flow checker. |
| `npm run format` | Format JavaScript source; modifies files. |
| `npm run eject` | Eject Create React App configuration; not needed for routine work. |

For modern Node versions, the production build may require:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

The repository includes a tracked `admin/build/` directory. Those files may reflect an older build; source changes are not reflected until rebuilding. Deploy the generated contents through a static host with an `index.html` fallback for application routes.

The existing GitHub Actions workflow uses a self-hosted runner but only checks out the repository and changes directory in an isolated step. It does not define a complete build/deploy pipeline. No Dockerfile or Compose configuration is provided in this checkout.

## Project structure

```text
admin/
├── src/components/      # Shared forms, modals, navigation, and widgets
├── src/constants/       # Layout and menu definitions
├── src/helpers/         # API core, endpoint map, auth, upload, utilities
├── src/layouts/         # Application layouts
├── src/pages/           # Account, dashboard, clinics, settings, and lists
├── src/redux/           # Feature actions, reducers, sagas, and API adapters
├── src/routes/          # Browser routes and session guard
├── src/config.js        # API/environment configuration
├── src/cryptoUtils.js   # Existing crypto code requiring sensitive-source cleanup
├── public/              # HTML shell and static assets
├── build/               # Existing compiled assets; currently tracked
└── package.json         # Dependencies and commands
.github/workflows/       # Existing runner workflow
```

## Ignore rules and public-repository preparation

The root `.gitignore` now excludes dependencies, builds, test output, environment variants, private keys/certificates, common credential files, private integrations, local uploads/exports, backups, database dumps, logs, and editor/OS files. Existing local-automation exclusions and the nested application's lockfile policy are preserved. Sanitized `.env.example` and `.env.sample` files remain eligible for tracking.

Ignore rules apply to future untracked additions. Existing compiled assets, source maps, OS files, key-containing source, and previous commits remain in Git. In particular, source maps can include original application code. Do not assume that adding `build/` or a secret pattern to `.gitignore` removes existing exposure.

Required imported source modules have not been added to ignore rules. Hiding such modules would not remove their history and could make a fresh checkout incomplete. A separate source and history cleanup is needed before public release; no application code, tracked files, credentials, or repository visibility were changed by this update.

Keep real clinic records, contracts, uploaded documents, account credentials, and exports outside tracked source. Review redistribution rights for third-party template assets and editor/document dependencies before publishing.

## Troubleshooting

- **Commands fail at repository root:** The application package is in `admin/`; run npm commands there.
- **Login or lists fail:** Check the configured API origin, backend availability, credentials, and encryption/response contract.
- **Uploads or email-change requests use the wrong URL:** Include the trailing slash on the backend origin and inspect the final request URL.
- **A document or contract action does not work:** Confirm the corresponding backend endpoint and any required storage/template configuration.
- **`ERR_OSSL_EVP_UNSUPPORTED`:** Use the compatibility-mode commands shown above with this older toolchain.
- **Refreshing a nested route returns 404:** Configure the static host's fallback to `index.html`.
- **Ignored files remain visible in Git:** They are already tracked or present in earlier commits and require separate cleanup.
