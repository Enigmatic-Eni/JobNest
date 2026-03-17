const axios = require("axios");
const Job = require("../models/job");
const companies = require("../config/companies");

const scrapeGreenhouse = async (companySlug) => {
  try {
    const res = await axios.get(
      `https://boards-api.greenhouse.io/v1/boards/${companySlug}/jobs`,
      { timeout: 10000 },
    );

    const jobs = res.data?.jobs || [];

    const formatted = jobs
      .filter((job) => job.title && job.absolute_url)
      .map((job) => ({
        title: job.title,
        company: companySlug.charAt(0).toUpperCase() + companySlug.slice(1),
        companySlug,
        location: job.location?.name || "Not specified",
        description: job.content || "",
        applyUrl: job.absolute_url,
        source: "greenhouse",
        externalId: String(job.id)
    }));

    return formatted;
  } catch (error) {
    console.error(`Greenhouse failed [${companySlug}]: ${error.message}`);
    return [];
  }
};

const scrapeArbeitnow = async () => {
    try {

        const allJobs = []

        const pagesToFetch = 5;

        for (let page = 1; page <= pagesToFetch; page++){
            const res = await axios.get(
                 `https://www.arbeitnow.com/api/job-board-api?page=${page}`,
        { timeout: 10000 }
            );
           const jobs = res.data?.data || []

           if(jobs.length === 0) break;

           const formatted = jobs.filter(job => job.title && job.url).map((job) =>({
            title: job.title,
            company: job.company_name || "Unknown",
            companySlug: job.company_name?.toLowerCase().replace(/\s+/g, "-") || "unknown",
            location: job.location || "Remote",
            description: job.description || "",
            applyUrl: job.url,
            source: "arbeitnow",
            externalId: String(job.slug)
           }));
           allJobs.push(...formatted);

           await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log(`Arbeitnow: fetched ${allJobs.length} jobs`);
        return allJobs;
    } catch (error) {
         console.error(`Arbeitnow failed: ${error.message}`);
    return [];
    }
}

const scrapeRemotive = async () =>{
    try {
        const res = await axios.get(
             "https://remotive.com/api/remote-jobs",
      { timeout: 15000 }
        );

        const jobs = res.data?.jobs || [];

        const formatted = jobs
      .filter(job => job.title && job.url)
      .map((job) => ({
        title: job.title,
        company: job.company_name || "Unknown",
        companySlug: job.company_name?.toLowerCase().replace(/\s+/g, "-") || "unknown",
        location: job.candidate_required_location || "Remote",
        description: job.description || "",
        applyUrl: job.url,
        source: "remotive",
        externalId: String(job.id)
      }));

    console.log(`Remotive: fetched ${formatted.length} jobs`);
    return formatted;
    } catch (error) {
        console.error(`Remotive failed: ${error.message}`);
    return [];
    }
}

const saveJobs = async (jobs, sourceName) => {
    let saved = 0;
    let skipped = 0;

    for(const job of jobs){
        try {
            await Job.findOneAndUpdate(
                {externalId: job.externalId,
                    source: job.source
                },
                job,
                {upsert: true, new: true}
            );
            saved++;
        } catch (error) {
            skipped++
        }
    }
    console.log(`[${sourceName}] Saved: ${saved}, Skipped: ${skipped}`);
    return {saved, skipped};
};

const runScraper = async () =>{
    console.log("====== Scraper started:", new Date().toISOString(), "======");
    
    let totalSaved = 0;
    let totalSkipped = 0;

// --- Greenhouse (per company) ---
  for (const slug of companies.greenhouse) {
    const jobs = await scrapeGreenhouse(slug);
    const { saved, skipped } = await saveJobs(jobs, `Greenhouse:${slug}`);
    totalSaved += saved;
    totalSkipped += skipped;
  }


  // --- Aggregators (bulk fetch) ---
  const arbeitnowJobs = await scrapeArbeitnow();
  const { saved: a1, skipped: s1 } = await saveJobs(arbeitnowJobs, "Arbeitnow");
  totalSaved += a1;
  totalSkipped += s1;

  const remotiveJobs = await scrapeRemotive();
  const { saved: a2, skipped: s2 } = await saveJobs(remotiveJobs, "Remotive");
  totalSaved += a2;
  totalSkipped += s2;



  console.log("====== Scraper finished ======");
  console.log(`Total saved: ${totalSaved} | Total skipped: ${totalSkipped}`);
};

module.exports = { runScraper };

