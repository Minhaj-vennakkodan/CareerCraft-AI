const mockDb = require('../database/mockDb');
const Analytics = require('../models/Analytics');
const Resume = require('../models/Resume');
const Portfolio = require('../models/Portfolio');

const logDownload = async (req, res) => {
  const { resumeId } = req.body;
  if (!resumeId) {
    return res.status(400).json({ success: false, message: 'Resume ID is required' });
  }

  try {
    const logData = {
      userId: req.user._id,
      targetId: resumeId,
      targetType: 'resume',
      actionType: 'download',
      source: 'direct',
      visitorIp: req.ip || '',
      visitorAgent: req.headers['user-agent'] || ''
    };

    if (global.isMockDb) {
      mockDb.insert('analytics', logData);
    } else {
      await Analytics.create(logData);
    }
    res.json({ success: true, message: 'Download logged successfully' });
  } catch (error) {
    console.error('Log download error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    let totalResumes = 0;
    let totalPortfolios = 0;
    let resumeViews = 0;
    let portfolioViews = 0;
    let downloads = 0;
    let recentActivity = [];

    if (global.isMockDb) {
      const resumes = mockDb.find('resumes', { userId: req.user._id });
      const portfolios = mockDb.find('portfolios', { userId: req.user._id });
      const logs = mockDb.find('analytics', { userId: req.user._id });

      totalResumes = resumes.length;
      totalPortfolios = portfolios.length;

      logs.forEach(log => {
        if (log.actionType === 'download') {
          downloads++;
        } else if (log.actionType === 'view') {
          if (log.targetType === 'resume') resumeViews++;
          if (log.targetType === 'portfolio') portfolioViews++;
        }
      });

      // Combine logs into recent activity list
      recentActivity = logs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(log => ({
          id: log._id,
          type: log.actionType,
          target: log.targetType,
          source: log.source,
          time: log.createdAt
        }));
    } else {
      totalResumes = await Resume.countDocuments({ userId: req.user._id });
      totalPortfolios = await Portfolio.countDocuments({ userId: req.user._id });

      const portfolioIds = (await Portfolio.find({ userId: req.user._id }).select('_id')).map(p => p._id);
      const resumeIds = (await Resume.find({ userId: req.user._id }).select('_id')).map(r => r._id);

      downloads = await Analytics.countDocuments({
        userId: req.user._id,
        actionType: 'download'
      });

      portfolioViews = await Analytics.countDocuments({
        targetId: { $in: portfolioIds },
        actionType: 'view',
        targetType: 'portfolio'
      });

      resumeViews = await Analytics.countDocuments({
        targetId: { $in: resumeIds },
        actionType: 'view',
        targetType: 'resume'
      });

      const recentLogs = await Analytics.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5);

      recentActivity = recentLogs.map(log => ({
        id: log._id,
        type: log.actionType,
        target: log.targetType,
        source: log.source,
        time: log.createdAt
      }));
    }

    res.json({
      success: true,
      data: {
        totalResumes,
        totalPortfolios,
        resumeViews,
        portfolioViews,
        downloads,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getChartData = async (req, res) => {
  try {
    let viewsData = [];
    let sourcesData = [];

    // Helper: generate last 7 days keys
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
    }

    if (global.isMockDb) {
      const logs = mockDb.find('analytics', { userId: req.user._id });

      // Daily counts
      viewsData = last7Days.map(dateStr => {
        let views = 0;
        let downloads = 0;
        logs.forEach(log => {
          if (log.createdAt.startsWith(dateStr)) {
            if (log.actionType === 'view') views++;
            if (log.actionType === 'download') downloads++;
          }
        });
        return { name: dateStr.substring(5), views, downloads };
      });

      // Traffic sources counts
      const sourceCount = {};
      logs.forEach(log => {
        if (log.actionType === 'view') {
          sourceCount[log.source] = (sourceCount[log.source] || 0) + 1;
        }
      });
      sourcesData = Object.keys(sourceCount).map(name => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: sourceCount[name]
      }));
    } else {
      const portfolioIds = (await Portfolio.find({ userId: req.user._id }).select('_id')).map(p => p._id);
      const resumeIds = (await Resume.find({ userId: req.user._id }).select('_id')).map(r => r._id);
      const allTargetIds = [...portfolioIds, ...resumeIds];

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const logs = await Analytics.find({
        $or: [
          { userId: req.user._id },
          { targetId: { $in: allTargetIds } }
        ],
        createdAt: { $gte: sevenDaysAgo }
      });

      viewsData = last7Days.map(dateStr => {
        let views = 0;
        let downloads = 0;
        logs.forEach(log => {
          const logDate = new Date(log.createdAt).toISOString().slice(0, 10);
          if (logDate === dateStr) {
            if (log.actionType === 'view') views++;
            if (log.actionType === 'download') downloads++;
          }
        });
        return { name: dateStr.substring(5), views, downloads };
      });

      const sourceAggregation = await Analytics.aggregate([
        {
          $match: {
            $or: [
              { userId: req.user._id },
              { targetId: { $in: allTargetIds } }
            ],
            actionType: 'view'
          }
        },
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 }
          }
        }
      ]);

      sourcesData = sourceAggregation.map(item => ({
        name: (item._id || 'direct').charAt(0).toUpperCase() + (item._id || 'direct').slice(1),
        value: item.count
      }));
    }

    if (sourcesData.length === 0) {
      sourcesData = [
        { name: 'Direct', value: 0 },
        { name: 'LinkedIn', value: 0 },
        { name: 'GitHub', value: 0 },
        { name: 'Search Engine', value: 0 }
      ];
    }

    res.json({
      success: true,
      data: {
        viewsOverTime: viewsData,
        trafficSources: sourcesData
      }
    });
  } catch (error) {
    console.error('Get charts error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { logDownload, getDashboardStats, getChartData };
