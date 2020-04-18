var CronJob = require('cron').CronJob;
const UserDetails = require('../config/passport').UserDetails;

function deactivateExpiredUsers(){
    today = new Date();
    UserDetails.updateMany({role: "Customer", membershipActive: true, membershipEndDate: {$lt: today}}, {membershipActive: false}).then((obj)=> {
        if (obj.ok){
         console.log("Deactivated " + obj.nModified + " expired users today");   
        } else {
            console.log("Expired user deactivation failed");
        }
    })
}

//10 mins after midnight
const job = new CronJob('10 0 * * *', function() {
    deactivateExpiredUsers();
  }, null, true, 'America/Los_Angeles');

module.exports = {job};