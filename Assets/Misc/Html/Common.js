/**
 * @typedef {Object} GameRecord
 * @property {Number} Score
 * @property {Number} Accuracy
 * @property {Number} ChartConstant
 * @property {string} Id
 * @property {Difficulty} Difficulty
 * @property {Status} Status
 * @property {Number} Rks
 */

/**
 * @enum {Difficulty}
 */
const Difficulty = {
    "EZ": 0,
    "HD": 1,
    "IN": 2,
    "AT": 3
}
/**
 * @enum {Status}
 */
const Status = {
    "Bugged": -1,
    "NotFc": 0,
    "Fc": 1,
    "Phi": 2,
    "Vu": 3,
    "S": 4,
    "A": 5,
    "B": 6,
    "C": 7,
    "False": 8
}

var ExampleMode = false;

window.pslReady = false;

const ExistingPSLKeys = [
    "CURRENT_DIRECTORY",
    "PSL_FILES",
    "ASSET_FOLDER",
    "INFO_IMAGE_PATHS",
    "INFO",
    "INFO_MAP_DIFFICULTY",
    "INFO_MAP_ID_NAME",
];

const ExampleIllustration = "./ExampleIllustration.png";

const RecordDifficultyToName = ["EZ", "HD", "IN", "AT"];
const _RankIdToName = ["NotFc", "Fc", "Phi", "Vu", "S", "A", "B", "C", "False"];

async function InitializePSLRender() {
    debugger;

    for (let t in ExistingPSLKeys) {
        t = ExistingPSLKeys[t];
        if (window[t] === undefined) {
            console.warn(`${t} is not present! using example value.`);
            ExampleMode = true;
        }
    }

    if (ExampleMode) {
        let response = await fetch("./Example.js");
        let txt = await response.text();
        eval(txt);
    }
}

/**
 *
 * @param {string} paths
 * @returns {string}
 */
function PathJoin(...paths) {
    let str = "";
    for (let index = 0; index < paths.length - 1; index++) {
        const element = paths[index].trim();

        if (StringIsNullOrEmpty(element)) continue;
        str += element.replaceAll("\\", "/");
        if (str.slice(-1) === "/") continue;
        str += "/";
    }
    const last = paths.slice(-1)[0];
    str += last.replaceAll("\\", "/");
    return str;
}

function StringIsNullOrEmpty(str) {
    if (str)
        return str === "";

    return true;
}

function RankIdToName(id) {
    if (id < 0) return "Bugged";
    return _RankIdToName[id];
}

function GetAvatarFilePath() {
    return window.INFO_IMAGE_PATHS.User.Avatar;
}

function GetUserPrecisionInt() {
    return window.INFO.User.Data.ShowFormat.split("0").length - 1;
}

function FloatToUserPrecisionString(f) {
    return f.toFixed(GetUserPrecisionInt());
}

function GetRks() {
    return window.INFO.User.Rks;
}

function GetRksFormatted() {
    return FloatToUserPrecisionString(GetRks());
}

function GetCMBackgroundFilePath() {
    if (ExampleMode) return "./ExampleChallenge.png";

    return (
        PathJoin(
            window.ASSET_FOLDER,
            "Misc",
            window.INFO.UserProgress.ChallengeModeRank.Rank.toString()
        ) + ".png"
    );
}

function GetCMLevel() {
    return window.INFO.UserProgress.ChallengeModeRank.Level;
}

function GetUserNickName() {
    return window.INFO.UserInfo.NickName;
}

function GetUserBackground() {
    if (ExampleMode) return ExampleIllustration;

    return PathJoin(window.INFO_IMAGE_PATHS.User.BackgroundBasePath, "Illustration.png");
}

function GetUserBackgroundLowRes() {
    if (ExampleMode) return ExampleIllustration;

    return PathJoin(window.INFO_IMAGE_PATHS.User.BackgroundBasePath, "IllustrationLowRes.png");
}

function GetUserBackgroundBlur() {
    if (ExampleMode) return ExampleIllustration;

    return PathJoin(window.INFO_IMAGE_PATHS.User.BackgroundBasePath, "IllustrationBlur.png");
}

function GetLowResIllustrationPath(id) {
    if (ExampleMode) return ExampleIllustration;

    return PathJoin(
        window.ASSET_FOLDER,
        "Tracks",
        id + ".0",
        "IllustrationLowRes.png"
    );
}

function GetIllustrationPath(id) {
    if (ExampleMode) return ExampleIllustration;

    return PathJoin(
        window.ASSET_FOLDER,
        "Tracks",
        id + ".0",
        "Illustration.png"
    );
}

function GetIllustrationBlurPath(id) {
    if (ExampleMode) return ExampleIllustration;

    return PathJoin(
        window.ASSET_FOLDER,
        "Tracks",
        id + ".0",
        "IllustrationBlur.png"
    );
}

function GetRecord(index) {
    return window.INFO.Records[index];
}

function GetRecordCount() {
    return window.INFO.Records.length;
}

function GetRecordLowResIllustrationPath(record) {
    return GetLowResIllustrationPath(record.Id);
}

function GetRecordRankImagePath(record) {
    if (ExampleMode) return "./ExampleRank.png";

    return (
        PathJoin(window.ASSET_FOLDER, "Misc", RankIdToName(record.Status)) +
        ".png"
    );
}

function SetDynamicWidth(w) {
    window.pslToWidth = w;
}

function SetDynamicHeight(h) {
    window.pslToHeight = h;
}

function GetElementXAndY(e) {
    let rect = e.getBoundingClientRect();
    return {
        x: rect.x + globalThis.scrollX,
        y: rect.y + globalThis.scrollY,
        width: rect.width,
        height: rect.height,
    };
}

function GetViewportSize() {
    let vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
    );
    let vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
    );
    return {
        width: vw,
        height: vh,
    };
}

function SetReady(ye) {
    window.pslReady = ye;
}
