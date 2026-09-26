import type { CmsPartDSource } from "./types";

const CATALOG_URL = "https://data.cms.gov/data.json";
const DATASET_TITLE = "Monthly Prescription Drug Plan Formulary and Pharmacy Network Information";

type CmsCatalog = {
  dataset?: Array<{
    title?: string;
    modified?: string;
    distribution?: Array<{ mediaType?: string; downloadURL?: string; title?: string; modified?: string }>;
  }>;
};

export async function getLatestCmsPartDSource(): Promise<CmsPartDSource> {
  const response = await fetch(CATALOG_URL, { next: { revalidate: 60 * 60 * 12 } });
  if (!response.ok) throw new Error(`CMS catalog request failed with ${response.status}`);

  const catalog = (await response.json()) as CmsCatalog;
  const dataset = catalog.dataset?.find((entry) => entry.title === DATASET_TITLE);
  const distribution = dataset?.distribution?.find((entry) => entry.mediaType === "application/zip" && entry.downloadURL);

  if (!dataset || !distribution?.downloadURL) throw new Error("Current CMS Part D formulary file was not found in the CMS catalog.");

  return {
    title: distribution.title || DATASET_TITLE,
    publishedAt: distribution.modified || dataset.modified || new Date().toISOString(),
    downloadUrl: distribution.downloadURL,
    source: "CMS Part D monthly formulary and pharmacy network file",
  };
}
