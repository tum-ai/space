import dotenv from "dotenv";


dotenv.config()
const cdn_url = "http://localhost:9990/certification"

export const TEMPLATES : any = [
    "test",
    "membership",
];

export const TEMPLATE_FILES : any = {
    "test": "templates/certificates/certificate_test.html",
    "membership": "templates/certificates/certificate_base.html",
};


export const TEMPLATE_DICTS: any = {
    "test": {
        "CDN_URL": cdn_url,
    },
    "membership": {
        "CDN_URL": cdn_url,
        "CONTRIB_1": "",
        "CONTRIB_2": "",
        "CONTRIB_3": "",
        "SIGNER_TITLE1": "",
        "SIGNER_TITLE2": "",
        "SIGNER_TITLE3": "",
        "SIGNER_INFO": "",
        "SIGNED_ON": "",
        "NAME": "",
        "LASTNAME": "",
        "DEPARTMENT": "",
        "TITLE": "",
        "DATENOW": "",
        "DATEJOINED": "",
        "PRONOUNPOS": "",
    }
}
