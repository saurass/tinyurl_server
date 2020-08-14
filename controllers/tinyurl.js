const TinyUrl = require("../models/tinyurl");
const { check, validationResult } = require("express-validator");
const { ers } = require("./error");
const md5 = require("md5");
const cache = require("./cache");

/*
|------------------------------------------------------
|   Create Controller
|------------------------------------------------------
*/
exports.create = (req, res) => {
    // check for entries in routes (please look at tinyurl routes for details)
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error
        })
    }

    this.getTinyUrlSavedInDB(req.body.url, found => {
        if(!found) {
            let url = req.body.url;
            let hash = md5(url);

            let buff = new Buffer(hash);
            let encode = buff.toString('base64');

            let tiyurlHash = encode.substring(0, 7) + encode.charAt(19);

            let saveObj = {};
            saveObj.hash = tiyurlHash;
            saveObj.link = url;
            saveObj.user = req.profile._id;
            saveObj.public = !req.body.public || req.body.public == 1 ? true : false;

            let tinyurl = new TinyUrl(saveObj);
            tinyurl.save();

            return res.json({"tinyurl": tiyurlHash});

        } else {
            res.json({"tinyurl": found.hash});
        }
    })

}

/*
|------------------------------------------------------
|   GetURL Controller
|------------------------------------------------------
*/
exports.getUrl = (req, res) => {
    let tinyHash = req.params.tinyHash;
    
    cache.get(tinyHash).then((tinyu) => {
        if(tinyu == null) {
            console.log("hit DB");
            TinyUrl.findOne(
                {"hash": tinyHash},
                (err, tinyUrl) => {
                    if(err || !tinyUrl) {
                        return ers(res, 404, "No Redirects Found")
                    }
        
                    let cacheObj = {};
                    cacheObj.link = tinyUrl.link;
                    cacheObj.public = tinyUrl.public;
                    cacheObj.user = tinyUrl.public == false ? tinyUrl.user : null;
        
                    if(tinyUrl.public == false) {
                        if(req.profile && req.auth && req.profile._id == req.auth._id) {
                            cache.set(tinyHash, cacheObj);
                            return res.json({"redirect": tinyUrl.link});
                        } else {
                            return ers(res, 403, "Access Denied !");
                        }
                    }
        
                    cache.set(tinyHash, cacheObj);
                    return res.json({"redirect": tinyUrl.link});
                }
            );
        } else {
            console.log("cache hits")
            if(tinyu.public == false) {
                if(req.profile && req.auth && req.profile._id == req.auth._id) {
                    return res.json({"redirect": tinyu.link});
                } else {
                    return ers(res, 403, "Access Denied !");
                }
            }

            return res.json({"redirect": tinyu.link});
        }
    })
    
}

// TODO: Add error handling
exports.getTinyUrlSavedInDB = (url, cb) => {
    TinyUrl.findOne({link: url}, (err, tinyurl) => {
        if(!tinyurl)
            cb(false);
        else
            cb(tinyurl);
    })
}