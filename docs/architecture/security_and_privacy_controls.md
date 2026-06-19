# Security and privacy controls

## Privacy defaults
- Photos remain local by default.
- User must explicitly opt into cloud sync or AI upload.
- AI job images should have a short TTL.
- Never log image pixels, file names that reveal personal details, or EXIF location.

## Asset controls
- Premium assets delivered via signed URLs.
- LUT checksum validated after download.
- Marketplace uploads parsed and previewed in isolated workers.

## Data controls
- Row Level Security on user-owned data.
- Admin audit logs for moderation and entitlement changes.
- Webhook signature verification.
- Least-privilege service keys.
