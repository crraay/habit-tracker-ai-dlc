# Requirements Analysis Questions

Intent capture already locked the package: IANA timezone on every user, UTC backfill for existing rows, API `today` in that zone, track/statistics (and check-in date identity) use API `today` not `new Date()`, settings to view/change timezone, history dates do not rewrite, listed backend tests, `docs/domain.md` unchanged. These questions cover only gaps that still block testable requirements.

## Q1. How do new accounts get a timezone after the UTC backfill exists?

Existing rows backfill to `UTC` (migration default, not a product timezone). That does not say what happens when someone registers after the column is required.

A. Same as backfill: new accounts persist with `UTC` until the user changes it (field visible, not hidden)
B. Registration/signup requires the user to pick a valid IANA timezone; no default
C. The API infers a timezone from the request (for example `Date` / `Accept-Language`); the user can still change it
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A. Same as backfill: new accounts persist with `UTC` until the user changes it (field visible, not hidden)

## Q2. Where does the user view and change their IANA timezone?

The package needs a place to show the current zone and save a new one, including when it is still the UTC backfill. Invalid save must surface the API error.

A. A Settings screen (new route/nav item) with timezone view + change
B. On the existing Track screen (inline control, no new route)
C. On login/profile only (no dedicated Settings route)
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A. A Settings screen (new route/nav item) with timezone view + change

## Q3. After a successful timezone save, when do Track and Statistics use the new `today`?

Today in the new zone can differ from the old zone at the same instant. The datepicker is currently initialized once.

A. Immediately: refetch timezone+today and refresh Track/Statistics/datepicker without a full page reload
B. After the next full page load or re-login; in-session screens may keep the old `today` until then
C. Not yet defined
D. Not applicable
E. None
X. Other (please specify)

[Answer]: B. After the next full page load or re-login; in-session screens may keep the old `today` until then

## Consolidated Summary Confirmation

- New accounts persist with `UTC` until the user changes it; the field stays visible, not hidden
- Timezone view and change live on a Settings screen (new route/nav item)
- After a successful timezone save, Track and Statistics may keep the old `today` until the next full page load or re-login
- On Track, API `today` is only the default selected date and the datepicker max/today bound; mark/unmark send the user-selected local date
- Backend timezone/today tests are FR5 / FR5.2 (not FR6)

Does this all look correct before I generate the requirements artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
