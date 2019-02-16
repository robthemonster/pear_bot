let fs = require('fs');
let aws = require('aws-sdk');
aws.config.update({region: 'us-east-2'});
let db = new aws.DynamoDB({apiVersion: '2019-02-16'});

async function putIntoTable(tableName, item) {
    return db.putItem({TableName: tableName, Item: item}, (error, data) => {
        if (error) {
            console.error(error);
        } else {
            response = data;
        }
    }).promise().catch(error => console.error(error));
}

class PearTree {

    parseJson(treeJson) {
        this.ageInDays = treeJson.ageInDays;
        this.minutesThisDay = treeJson.minutesThisDay;
        this.minutesSinceWatered = treeJson.minutesSinceWatered;
        this.pears = treeJson.pears;
        this.channelPlantedIn = treeJson.channelPlantedIn;
    }

    constructor(plantedBy, channelPlantedIn) {
        this.userID = plantedBy;
        this.ageInDays = 0;
        this.minutesThisDay = 0;
        this.minutesSinceWatered = 0;
        this.pears = 0;
        this.channelPlantedIn = channelPlantedIn;
    }
    parseItem(item) {
        this.userID = item.userID.S;
        this.ageInDays = parseInt(item.ageInDays.S);
        this.minutesThisDay = parseInt(item.minutesThisDay.S);
        this.minutesSinceWatered = parseInt(item.minutesSinceWatered.S);
        this.channelPlantedIn = item.channelPlantedIn.S;
        this.pears = parseInt(item.pears.S);
    }

    toItem() {
        return {
            userID: {'S': this.userID.toString()},
            ageInDays: {'S': this.ageInDays.toString()},
            minutesThisDay: {'S': this.minutesThisDay.toString()},
            minutesSinceWatered: {'S': this.minutesSinceWatered.toString()},
            pears: {'S': this.pears.toString()},
            channelPlantedIn: {'S': this.channelPlantedIn.toString()}
        };
    }

}

let pearCounts = require('./pear_counts.json');
let trees = require('./trees.json');
let subscribed = require('./subscribed.json');

console.log(subscribed);
for (let userID in pearCounts) {
    putIntoTable('pear_counts', {userID: {'S':userID},pearsHarvested: {'N': pearCounts[userID].toString()}});
}

for (let channelID in subscribed){
    putIntoTable('subscriptions', {channelID: {'S':subscribed[channelID].toString()}});
}

for (let userID in trees) {
    let tree = new PearTree();
    tree.parseJson(trees[userID]);
    tree.userID = userID;
    putIntoTable('trees', tree.toItem());
}