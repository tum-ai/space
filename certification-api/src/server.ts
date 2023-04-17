import express, {Express, Request, Response} from "express";
import multiparty from 'multiparty'
import dotenv from 'dotenv'
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import instantiate_template from "./instantiate_template";
import {Buffer} from "buffer";
import {TEMPLATE_DICTS, TEMPLATE_FILES, TEMPLATES} from "./templates";
import * as fs from "fs";

dotenv.config()
const port = process.env.PORT ?? 80
const cdn_url = process.env.CDN_URL ?? "http://space.files:80/certification"

const server: Express = express()
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// adding Helmet to enhance your Rest API's security
server.use(helmet());

// enabling CORS for all requests
server.use(cors());

// adding morgan to log HTTP requests
server.use(morgan('combined'));

function errorResponse (res: Response, statusCode: number, message: string): Response {
    return res.status(400).json({ error: message })
}


server.get('/', (req: Request, res: Response) => {
    res.status(200).json({"status": "success"});
})

server.post('/create-certificate/:template', (req: Request, res: Response) => {
    const form = new multiparty.Form()

    const template = req.params.template ?? "";
    if (!TEMPLATES.includes(template)) {
        return errorResponse(res, 400, 'invalid template!')
    }

    let template_dict: any = {};

    // Parse request form
    form.parse(req, async function (err, fields, files) {
        if (err != null) {
            console.log(err)
            return errorResponse(res, 400, 'malformed request!')
        }

        // Field extraction
        for (const key in TEMPLATE_DICTS[template]) {
            template_dict["#{" + key + "}"] = TEMPLATE_DICTS[template][key];
            if (TEMPLATE_DICTS[template][key].length > 0) continue;
            template_dict["#{" + key + "}"] = fields[key.toLowerCase()] ?? ''

        }

        for (const key in template_dict) {
            if(("" + template_dict[key]).length <= 0) {
                return errorResponse(res, 400, key + ' is missing in template replacers!')
            }
        }

        const templateFilePath: string = TEMPLATE_FILES[template]
        const resultPdfBuffer = await instantiate_template(templateFilePath, template_dict);

        console.log("*** ", template, " ", templateFilePath)

        // // [build response] ===============
        res.status(201).type('pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=tumai-certificate.pdf')
        res.send(resultPdfBuffer)
        // res.json({ message: 'success' })
        // //= =================================
    })
})



export default server.listen(port, () => {
    console.log(`[server]: running at port ${port}`)
})
