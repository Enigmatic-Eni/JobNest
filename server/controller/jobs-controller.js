const Job = require('../models/job');

const getJobs = async (req, res) =>{
    try {
        const{
            keyword,
            location,
            source,
            page =1,
            limit = 20
        } = req.query;

        const filter = {};

        if(keyword){
            filter.$or = [
                {title: {$regex: keyword, $options: "i"}},
                {company: {$regex: keyword, $options: "i"}}
            ];
        }

        if (location){
            filter.location= {$regex: location, $options: "i"};
        }

        if(source){
            filter.source = {$regex: source, $options: 'i'};
        }

        filter.isActive = true;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const skip = (pageNum -1) * limitNum;

        const [jobs, total] = await Promise.all([
             Job.find(filter)
        .sort({ scrapedAt: -1 }) // newest first
        .skip(skip)
        .limit(limitNum)
        .select("-description"), // exclude description from list view
      Job.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
    } catch (error) {
            console.error("Get jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs"
    });
  }
    }

    const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.status(200).json({
      success: true,
      job
    });

  } catch (error) {
    console.error("Get job by id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job"
    });
  }
};

module.exports = { getJobs, getJobById };