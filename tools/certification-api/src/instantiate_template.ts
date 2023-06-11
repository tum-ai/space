import html_to_pdf from "html-pdf-node";
import * as fs from "fs";

async function instantiate_template(templateFilePath: string, variable_replacers: { [name: string]: string } ) {
    const html_template = fs.readFileSync(templateFilePath,'utf8');

    let options = {
        format: 'A4',
        printBackground: true,
    };

    let html_template_instance: string = html_template + "";
    for (const key in variable_replacers) {
        while (true) {
            const html_template_instance_new = html_template_instance;
            html_template_instance = html_template_instance.replace(key, variable_replacers[key]);
            if (html_template_instance == html_template_instance_new) break;
        }
    }

    let file = { content: html_template_instance , name: 'example.pdf' };
    let res: any = null;
    await html_to_pdf.generatePdf(file, options, (err, buffer) => {
        if (err != null) console.log(err)
        res = buffer;
        return buffer;
    });
    return res;
}

export default instantiate_template;
