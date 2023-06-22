import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { auth } from '/config/firebase';

export class CertificateModel {
	root;
	certificate = {};

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	updateCertificate(changes) {
		this.certificate = { ...this.certificate, ...changes };
	}
}
