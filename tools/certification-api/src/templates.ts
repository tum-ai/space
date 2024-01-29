import dotenv from "dotenv";


dotenv.config()
const cdn_url = "http://space.files/certification"

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
        "SIGNER_TITLE1": "Hamze Al-Zamkan",
        "SIGNER_TITLE2": "David Podolskyi",
        "SIGNER_TITLE3": "Mariia Bogatyreva",
        "SIGNER_INFO": "TUM.ai President",
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

