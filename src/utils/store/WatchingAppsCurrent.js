const watchingAppsKey = "watching-apps";

function addToListWatchingApps(app) {
    let oldObject = JSON.parse(getListWatchingApps());
    if (oldObject ) {
        if(!!oldObject.find((item)=>item.app_id === app.app_id)){
            return;
        }
        while (oldObject.length >= 20) {
            oldObject.shift();
        }
        const listObject = oldObject;
        listObject.push(app);
        localStorage.setItem(watchingAppsKey + "-object", JSON.stringify(listObject));
    } else {
        const newObject = [];
        newObject.push(app);
        localStorage.removeItem(watchingAppsKey + "-object");
        localStorage.setItem(watchingAppsKey + "-object", JSON.stringify(newObject));
    }
}

function getListWatchingApps() {
    return localStorage.getItem(watchingAppsKey + "-object");
}

let WatchingAppsCurrent = {
    addToListWatchingApps: addToListWatchingApps,
    getListWatchingApps: getListWatchingApps,

};
export default WatchingAppsCurrent;
