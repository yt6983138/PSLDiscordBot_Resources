import requests, zipfile, io, os

illustrationSrc = "https://github.com/7aGiven/Phigros_Resource/archive/refs/heads/illustration.zip"
illustrationLowResSrc = "https://github.com/7aGiven/Phigros_Resource/archive/refs/heads/illustrationLowRes.zip"
illustrationBlurSrc = "https://github.com/7aGiven/Phigros_Resource/archive/refs/heads/illustrationBlur.zip"

def Main(config):
    illustrationFetched = None

    if (config["FetchIllustration"]):
        print("Fetching illustration")
        illustrationFetched = zipfile.ZipFile(io.BytesIO(requests.get(illustrationSrc).content))
    print("Fetching illustrationLowRes")
    illustrationLowResFetched = zipfile.ZipFile(io.BytesIO(requests.get(illustrationLowResSrc).content))
    print("Fetching illustrationBlur")
    illustrationBlurFetched = zipfile.ZipFile(io.BytesIO(requests.get(illustrationBlurSrc).content))

    for fileName in illustrationLowResFetched.namelist():
        index = fileName.rfind("/") + 1
        if (index < 1): continue
        fileName = fileName[index:]
        toWriteName = fileName.replace(".png", "") + ".0"
        if (len(toWriteName) < 3): continue
        dir = "./Assets/Tracks/%s/" % toWriteName
        os.makedirs(dir, exist_ok=True)
        
        print("writing %s..." % toWriteName)
        with illustrationLowResFetched.open("Phigros_Resource-illustrationLowRes/" + fileName) as file:
            with open(dir + "IllustrationLowRes.png", "bw") as toWrite: toWrite.write(file.read())
        with illustrationBlurFetched.open("Phigros_Resource-illustrationBlur/" + fileName) as file:
            with open(dir + "IllustrationBlur.png", "bw") as toWrite: toWrite.write(file.read())
        if (illustrationFetched != None):
            with illustrationLowResFetched.open("Phigros_Resource-illustration/" + fileName) as file:
                with open(dir + "Illustration.png", "bw") as toWrite: toWrite.write(file.read())

if (__name__ == "__main__"): Main({"FetchIllustration": False})

