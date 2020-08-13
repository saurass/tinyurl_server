const TinyUrl = require("../models/tinyurl");
const { check, validationResult } = require("express-validator");
const { ers } = require("./error");
const md5 = require("md5");

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

            let tinyurl = new TinyUrl({hash: tiyurlHash, link: url});
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
    TinyUrl.findOne(
        {"hash": tinyHash},
        (err, tinyUrl) => {
            if(err || !tinyUrl) {
                return ers(res, 404, "No Redirects Found")
            }

            return res.json({"redirect": tinyUrl.link});
        }
    );
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