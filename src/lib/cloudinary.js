// Cloudinary delivery helpers.
//
// Only the cloud name is needed on the client - image delivery URLs are public
// and require no API key or secret. Set VITE_CLOUDINARY_CLOUD_NAME in .env.local.
//
// Optionally set VITE_CLOUDINARY_GALLERY_TAG to have the gallery pull its photo
// list from Cloudinary automatically (see README notes in GallerySection). When
// unset, the gallery falls back to the static list in content/copy.json.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const CLOUDINARY_GALLERY_TAG = import.meta.env.VITE_CLOUDINARY_GALLERY_TAG;

/**
 * Build an optimized delivery URL for a Cloudinary image.
 *
 * @param {string} publicId  e.g. "wedding-gallery/couple-01" (folder + name, no extension)
 * @param {{ width?: number, height?: number, crop?: string }} [opts]
 */
export function cloudinaryUrl(publicId, { width = 500, height = 640, crop = 'fill' } = {}) {
  if (!CLOUD_NAME) {
    console.warn('Missing VITE_CLOUDINARY_CLOUD_NAME - gallery images will not load.');
    return '';
  }

  const transforms = [
    `c_${crop}`,
    `w_${width}`,
    `h_${height}`,
    'g_auto', // smart crop toward faces / subject
    'f_auto', // best format for the browser (AVIF / WebP)
    'q_auto', // automatic quality
    'dpr_auto', // retina-aware
  ].join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${encodeURI(publicId)}`;
}

/**
 * Fetch the list of image public IDs tagged with `tag`.
 *
 * Requires the "Resource list" delivery type to be enabled for the account
 * (Cloudinary Console -> Settings -> Security -> "Restricted media types" ->
 * allow "Resource list"). Images must be tagged with `tag`.
 */
export async function fetchGalleryByTag(tag) {
  if (!CLOUD_NAME || !tag) return [];

  const res = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`);
  if (!res.ok) {
    throw new Error(`Cloudinary list request failed (${res.status}). Is the "Resource list" delivery type enabled?`);
  }

  const data = await res.json();
  return (data.resources || [])
    .sort((a, b) => (a.public_id > b.public_id ? 1 : -1))
    .map((r) => r.public_id);
}
