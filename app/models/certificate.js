import { makeAutoObservable } from 'mobx';

export class CertificateModel {
	root;
	editorCertificate = {};

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	updateEditorCertificate(changes) {
		this.editorCertificate = { ...this.editorCertificate, ...changes };
	}

	async generateCertificate() {
		const response = await this.root.POST(
			'/certificate/membership/',
			this.editorCertificate
		);
		if (response.status >= 200 && response.status < 300) {
			let fileName = `tumai-certificate-${this.editorCertificate['NAME']}-${this.editorCertificate['LASTNAME']}.pdf`;
			download(response.data, fileName, response.headers['content-type']);
		}
	}
}
