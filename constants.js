const envData = {
    // external rest services check end points
    qa: 'https://ords.beachbody.com:8443/ords/qadash/system/extrestservice/QA/?limit=500',
    uat: 'https://ords.beachbody.com:8443/ords/uatdash/system/extrestservice/UAT/?limit=500',
    masterDataPath: '/app/node/demo_version/madhu/external_rest_health_files',
    cron1: '28 * * * *',
    cron2: '58 * * * *',
    qaFileName: 'qaAPIResponse',
    uatFileName: 'uatAPIResponse',
    coach_office: [
        {
            // qa3 cms details
            url: 'https://cms.qa3.coo.tbbtest.com/meta/health',
            path: '/home/oracle/composite-monitor',
            filename: 'coach_office_qa3_cms'
        },
        {
            // qa3 reports details
            url: 'https://reports.qa3.coo.tbbtest.com/meta/health',
            path: '/home/oracle/composite-monitor',
            filename: 'coach_office_qa3_report'
        },
        {
            // stage cms details
            url: 'https://cms.stage.coo.beachbody.com/meta/health',
            path: '/home/oracle/composite-monitor-uat',
            filename: 'coach_office_uat_cms'
        },
        {
            // stage reports details
            url: 'https://reports.stage.coo.beachbody.com/meta/health',
            path: '/home/oracle/composite-monitor-uat',
            filename: 'coach_office_uat_report'
        }
    ]
}




module.exports.envData = envData;
