import express, {Express, Request, Response} from "express";
import dotenv from 'dotenv'
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import instantiate_template from "./instantiate_template";
import {TEMPLATE_DICTS, TEMPLATE_FILES, TEMPLATES} from "./templates";
const bodyParser = require('body-parser');

dotenv.config()
const port = process.env.PORT ?? 3009

const server: Express = express()
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// adding Helmet to enhance your Rest API's security
server.use(helmet());

// enabling CORS for all requests
server.use(cors());

// adding morgan to log HTTP requests
server.use(morgan('combined'));

server.use(bodyParser.json());

// serve static files / assets for certificate rendering
server.use('/static', express.static('templates/certificates'))

function errorResponse (res: Response, statusCode: number, message: string): Response {
    console.log("error response", message)
    return res.status(400).json({ error: message })
}


server.get('/', (req: Request, res: Response) => {
    res.status(200).json({"status": "success"});
})

server.post('/create-certificate/:template', async (req: Request, res: Response) => {
    const json_body = req.body;

    console.log("Received request: ", json_body)

    var fields: { [key: string]: string } = {};
    for (const key in json_body) {
        fields[key] = json_body[key]
    }

    const template = req.params.template ?? "";
    if (!TEMPLATES.includes(template)) {
        return errorResponse(res, 400, 'invalid template!')
    }

    let template_dict: any = {};

    // Field extraction
    for (const key in TEMPLATE_DICTS[template]) {
        template_dict["#{" + key + "}"] = TEMPLATE_DICTS[template][key];
        if (TEMPLATE_DICTS[template][key].length > 0) continue;
        template_dict["#{" + key + "}"] = fields[key] ?? ''

    }

    for (const key in template_dict) {
        if(("" + template_dict[key]).length <= 0) {
            return errorResponse(res, 400, key + ' is missing in template replacers!')
        }
    }

    const templateFilePath: string = TEMPLATE_FILES[template]
    const resultPdfBuffer = await instantiate_template(templateFilePath, template_dict);

    // [build response] ===============
    res.status(201).type('pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=tumai-certificate.pdf')
    res.send(resultPdfBuffer)
    // res.json({ message: 'success' })
    //= =================================
})



export default server.listen(port, () => {
    console.log(`[server]: running at port ${port}`)
})
