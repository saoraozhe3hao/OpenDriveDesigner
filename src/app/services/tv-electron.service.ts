/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { Injectable } from '@angular/core';

declare const window: any;
declare const versions: any;
declare const command: any;

@Injectable( { providedIn: 'root' } )
export class TvElectronService {

	constructor () {
		if ( this.isElectronApp ) {
			this._electron = window.require( 'electron' );
			this._remote = versions.remote();
		}
	}

	private _electron: typeof window.electron;

	get electron (): typeof window.electron {
		return this._electron;
	}

	private _remote: any;

	get remote (): any {
		return this._remote;
	}

	get isElectronApp (): boolean {
		return !!window.navigator.userAgent.match( /Electron/ );
	}

	get isMacOS (): boolean {
		return this.isElectronApp //&& process.platform === 'darwin';
	}

	get isWindows (): boolean {
		return this.isElectronApp //&& process.platform === 'win32';
	}

	get isLinux (): boolean {
		return this.isElectronApp //&& process.platform === 'linux';
	}

	get isX86 (): boolean {
		return this.isElectronApp //&& process.arch === 'ia32';
	}

	get isX64 (): boolean {
		return this.isElectronApp //&& process.arch === 'x64';
	}

	get isArm (): boolean {
		return this.isElectronApp //&& process.arch === 'arm';
	}

	get desktopCapturer (): any {
		return this.electron ? this.electron.desktopCapturer : null;
	}

	get ipcRenderer (): any {
		return this.electron ? this.electron.ipcRenderer : null;
	}

	get webFrame (): any {
		return this.electron ? this.electron.webFrame : null;
	}

	get clipboard (): any {
		return this.electron ? this.electron.clipboard : null;
	}

	get crashReporter (): any {
		return this.electron ? this.electron.crashReporter : null;
	}

	get process (): any {
		return this.electron ? this.electron.remote.process : null;
	}

	get nativeImage (): any {
		return this.electron ? this.electron.nativeImage : null;
	}

	get screen (): any {
		return this.electron ? this.electron.remote.screen : null;
	}

	get shell (): any {
		return this.electron ? this.electron.shell : null;
	}

	setTitle ( title: string, filePath?: string ) {

		let newTitle = title;

		if ( filePath ) newTitle += ` - ${ filePath }`;

		typeof versions !== 'undefined' && versions.setTitle( newTitle );
	}

	openLink ( link: string ) {

		this.remote.shell.openExternal( link );

	}

	/**
	 * @param exec
	 * @param args
	 * @param out
	 * @param err
	 * @param close
	 * @returns
	 */
	spawn ( exec: string, args: string[], out: Function, err: Function, close: Function ): any {

		return command.spawn( exec, args, out, err, close );

	}


}
