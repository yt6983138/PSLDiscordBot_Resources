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

const ExampleIllustration = "./ExampleIllustration2.png";

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

/**
 * https://github.com/Catrong/phi-plugin/blob/main/model/fCompute.js
 * @param richText {string}
 * @param onlyText {boolean} return text only or html elements
 * @param baseFontSize {number | null} rem, or null to complete ignore it
 * @returns {HTMLParagraphElement | string}
 */
function ConvertUnityRichText(richText, baseFontSize = 16, onlyText = false) {
    richText = richText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const reg = [
        /&lt;color\s*=\s*.*?&gt;(.*?)&lt;\/color&gt;/, // color
        /&lt;size\s*=\s*.*?&gt;(.*?)&lt;\/size&gt;/, // size
        /&lt;i&gt;(.*?)&lt;\/i&gt;/, // italic
        /&lt;b&gt;(.*?)&lt;\/b&gt;/ // bold
    ]

    let hasMatchAny = false;
    while (1) {
        if (richText.match(reg[0])) {
            hasMatchAny = true;
            const txt = richText.match(reg[0])[1];
            const color = richText.match(reg[0])[0].match(/&lt;color\s*=\s*(.*?)&gt;/)[1].replace(/[\s\"]/g, '');
            richText = richText.replace(reg[0], onlyText
                ? txt
                : `<span style="color:${color};${baseFontSize !== null ? `font-size: ${baseFontSize}rem` : ""}" class="UnityConvertedColor">${txt}</span>`);
            continue;
        }

        if (richText.match(reg[2])) {
            hasMatchAny = true;
            let txt = richText.match(reg[2])[1];
            richText = richText.replace(reg[2], onlyText ? txt : `<i>${txt}</i>`);
            continue;
        }

        if (richText.match(reg[3])) {
            hasMatchAny = true;
            let txt = richText.match(reg[3])[1]
            richText = richText.replace(reg[3], onlyText ? txt : `<b>${txt}</b>`);
            continue;
        }
        if (richText.match(reg[1])) {
            hasMatchAny = true;
            const txt = richText.match(reg[1])[1];
            const size = richText.match(reg[1])[0].match(/&lt;size\s*=\s*(.*?)&gt;/)[1];
            let realSize = 0;
            console.debug(size);
            if (size.includes('+') || size.includes('-')) {
                    realSize = baseFontSize + Number(size);
            }
            else if (size.includes('%')) {
                    realSize = Number(size.replaceAll('%', "")) * 0.01 * baseFontSize;
            }
            else if (size.includes('px')) {
                realSize = Number(size.replaceAll('px', ""));
            }
            else {
                console.warn(`Invalid size ${size}`);
            }
            richText = richText.replace(reg[1], onlyText
                ? txt
                : `<span ${baseFontSize !== null ? `style="font-size:${realSize}rem"` : ""} class="UnityConvertedSize">${txt}</span>`);
            continue;
        }
        if (richText.match(/\n\r?/)) {
            richText.replace(/\n\r?/g, '<br>');
        }
        break;
    }
    if (onlyText) {
        richText = richText.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }
    else {
        const element = document.createElement("p");
        if (baseFontSize !== null)
            element.style.fontSize = `${baseFontSize}rem`;
        element.classList.add("UnityConvertedRoot");
        element.innerHTML = richText;
        return element;
    }
    return richText;
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

function GetMoneyFormatted() {
    const moni = INFO.UserProgress.Money;
    let str = "";

    if (moni.PiB > 0) str += `${moni.PiB} PiB, `;
    if (moni.TiB > 0) str += `${moni.TiB} TiB, `;
    if (moni.GiB > 0) str += `${moni.GiB} GiB, `;
    if (moni.MiB > 0) str += `${moni.MiB} MiB, `;
    if (moni.KiB > 0) str += `${moni.KiB} KiB, `;

    if (str.length < 3) return "0 KiB";

    return str.slice(0, -2);
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

/**
 *
 * @param {Date} dateBefore
 * @param {Date} dateAfter
 * @param {number} shouldShowAfter
 * @param {number} digits
 */
function FormatDateOffset(dateBefore, dateAfter, shouldShowAfter = 1, digits = 1) {
    const avgDaysPerMonth = 30.436849916;

    const milliDiff = dateAfter - dateBefore;
    const secDiff = milliDiff / 1000;
    const minDiff = secDiff / 60;
    const hourDiff = minDiff / 60;
    const dayDiff = hourDiff / 24;
    const monthDiff = dayDiff / avgDaysPerMonth;
    const yearDiff = monthDiff / 12;

    if (yearDiff > shouldShowAfter) {
        return `${yearDiff.toFixed(digits)} years`;
    } else if (monthDiff > shouldShowAfter) {
        return `${monthDiff.toFixed(digits)} months`;
    } else if (dayDiff > shouldShowAfter) {
        return `${dayDiff.toFixed(digits)} days`;
    } else if (hourDiff > shouldShowAfter) {
        return `${hourDiff.toFixed(digits)} hours`;
    } else if (minDiff > shouldShowAfter) {
        return `${minDiff.toFixed(digits)} minutes`;
    } else if (secDiff > shouldShowAfter) {
        return `${secDiff.toFixed(digits)} seconds`;
    }
    return `${milliDiff.toFixed(digits)} milliseconds`;
}

/**
 *
 * @param {number} min
 * @param {number} max
 */
function RandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
