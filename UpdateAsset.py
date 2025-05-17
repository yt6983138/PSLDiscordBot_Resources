import requests, zipfile, io, os, hashlib, json

illustrationSrc = "https://github.com/7aGiven/Phigros_Resource/archive/refs/heads/illustration.zip"
illustrationLowResSrc = "https://github.com/7aGiven/Phigros_Resource/archive/refs/heads/illustrationLowRes.zip"
illustrationBlurSrc = "https://github.com/7aGiven/Phigros_Resource/archive/refs/heads/illustrationBlur.zip"

avatarSrc = "https://github.com/7aGiven/Phigros_Resource/archive/refs/heads/avatar.zip"

def Main(config):
    illustrationFetched = None

    if (config["FetchIllustration"]):
        print("Fetching illustration")
        illustrationFetched = zipfile.ZipFile(io.BytesIO(requests.get(illustrationSrc).content))
    print("Fetching illustrationLowRes")
    illustrationLowResFetched = zipfile.ZipFile(io.BytesIO(requests.get(illustrationLowResSrc).content))
    print("Fetching illustrationBlur")
    illustrationBlurFetched = zipfile.ZipFile(io.BytesIO(requests.get(illustrationBlurSrc).content))
    print("Fetching avatar")
    avatarFetched = zipfile.ZipFile(io.BytesIO(requests.get(avatarSrc).content))

    avatarMap = {}

    for rawFileName in avatarFetched.namelist():
        index = rawFileName.rfind("/") + 1
        if (index < 1): continue
        fileName = rawFileName[index:]
        if (len(fileName) < 3): continue
        
        with avatarFetched.open(rawFileName) as file:
            buffer = file.read()
            hash = hashlib.sha1(buffer).hexdigest()
            noExtFileName = fileName.replace(".png", "")
            if ("Cipher1" in noExtFileName):
                noExtFileName = "Cipher : /2&//<|0"
            #print("writing %s, hash %s..." % (noExtFileName, hash))
            with open("./Assets/Avatar/%s.png" % hash, "bw") as toWrite: 
                toWrite.write(buffer)
                avatarMap[noExtFileName]= hash

    with open("./Assets/Avatar/AvatarInfo.json", "w") as hash_json:
        hash_json.write(json.dumps(avatarMap))

    for fileName in illustrationLowResFetched.namelist():
        index = fileName.rfind("/") + 1
        if (index < 1): continue
        fileName = fileName[index:]
        toWriteName = fileName.replace(".png", "") + ".0"
        if (len(toWriteName) < 3): continue
        dir = "./Assets/Tracks/%s/" % toWriteName
        os.makedirs(dir, exist_ok=True)
        
        #print("writing %s..." % toWriteName)
        with illustrationLowResFetched.open("Phigros_Resource-illustrationLowRes/" + fileName) as file:
            with open(dir + "IllustrationLowRes.png", "bw") as toWrite: toWrite.write(file.read())
        with illustrationBlurFetched.open("Phigros_Resource-illustrationBlur/" + fileName) as file:
            with open(dir + "IllustrationBlur.png", "bw") as toWrite: toWrite.write(file.read())
        if (illustrationFetched != None):
            with illustrationLowResFetched.open("Phigros_Resource-illustration/" + fileName) as file:
                with open(dir + "Illustration.png", "bw") as toWrite: toWrite.write(file.read())

    # avatars
    

if (__name__ == "__main__"): Main({"FetchIllustration": False})

