# Changelog

Versions follow the `MAJOR.MINOR.YYYYMM` scheme, where `YYYYMM` is the year and month of the bundled postal code data. Monthly data-only releases are not listed here; this file records library behavior changes.

## Unreleased

### Changed

- Web entries (`jpostcode/web` and the CDN script): `find()` now distinguishes "no matching address" from fetch failures.
  - HTTP 404 (no data file for the given upper 3 digits) returns an empty array, as before. The 404 result is now cached, so the same upper 3 digits are not re-fetched.
  - Any other failure (network error, HTTP 5xx, etc.) now rejects the returned Promise. Previously all failures returned an empty array and logged to `console.error`, making network errors indistinguishable from "address not found".
