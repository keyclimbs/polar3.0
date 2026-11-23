# Polar AccessLink v3 capability audit

## Approved hosts

- `https://flow.polar.com` — OAuth authorization
- `https://polarremote.com` — OAuth token exchange
- `https://www.polaraccesslink.com` — resource APIs and user registration

## Endpoints

| Endpoint | Purpose | Availability / limitation |
|---|---|---|
| `POST /v3/users` | Register an authenticated Polar user | HTTP 409 means already registered |
| `GET /v3/users/nightly-recharge` | Available nightly recharge transactions | Recent server-side data; no guaranteed history |
| `GET /v3/users/nightly-recharge/{date}` | ANS and sleep charge details | Device/account dependent |
| `GET /v3/users/sleep` | Available sleep records | 30-second epoch data may be incomplete |
| `GET /v3/users/sleep/{date}` | Sleep stages and interruptions | Device/account dependent |
| `GET /v3/users/continuous-heart-rate/{date}` | Daily five-minute optical HR samples | Optical signal; not ECG quality |
| `GET /v3/exercises` | Exercise identifiers | Pagination/cursor details depend on API response |
| `GET /v3/exercises/{id}/samples` | Exercise samples | Sport and device dependent |
| `GET /v3/exercises/{id}/heart-rate-zones` | Zone durations | Returned units require exercise-level normalization |

## Manual data

Polar Flow CSV and RR-interval exports are accepted conceptually for local imports. Raw account JSON archive imports provide a separate ingestion path. Imports must preserve original provenance and must never be interpreted as a clinical diagnosis.

## Security and storage

OAuth access tokens do not expire and are not refreshable by Polar. Store only encrypted AES-256-GCM token payloads. Redact authorization headers and tokens from logs. Restrict outbound requests to the approved hosts above.
