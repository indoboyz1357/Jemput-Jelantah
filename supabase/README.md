# Supabase Storage Setup

This application requires two storage buckets in Supabase:

## Required Buckets:

1. **pickup-proofs** - For storing pickup proof images
2. **payment-proofs** - For storing payment proof images

## Setup Instructions:

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create the following buckets:
   - `pickup-proofs` (public bucket)
   - `payment-proofs` (public bucket)

## Bucket Policies:

Both buckets should be configured as public buckets to allow image viewing in the application.

## Image Processing:

- Images are automatically compressed to 300px max width
- Images are converted to WebP format for optimal file size
- All images are optimized for mobile viewing