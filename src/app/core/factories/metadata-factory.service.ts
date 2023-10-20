/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { Injectable } from '@angular/core';
import { AssetDatabase } from 'app/core/asset/asset-database';
import { FileUtils } from 'app/core/io/file-utils';
import { FileService } from 'app/core/io/file.service';
import { TvRoadMarking } from 'app/modules/tv-map/services/tv-marking.service';
import { RoadStyle } from 'app/services/road-style.service';
import { SnackBar } from 'app/services/snack-bar.service';
import { FileNode } from 'app/views/editor/project-browser/file-node.model';
import * as THREE from 'three';
import { RepeatWrapping, Texture, TextureLoader, UVMapping, Vector3 } from 'three';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';
import { Metadata, MetaImporter } from '../models/metadata.model';
import { AppService } from '../services/app.service';

@Injectable( {
	providedIn: 'root'
} )
export class MetadataFactory {


	private static get fileService (): FileService {

		return AppService.file;

	}

	static saveMetadataFile ( file: FileNode | string, metadata: Metadata ): void {

		try {

			let path = null;

			if ( typeof ( file ) === 'string' ) path = file;

			if ( typeof ( file ) === 'object' ) path = file.path;

			if ( !path.includes( '.meta' ) ) path = path + '.meta';

			this.fileService.fs.writeFileSync( path, JSON.stringify( metadata, null, 2 ) );

		} catch ( error ) {

			console.error( 'Error in writing .meta file', error );

			SnackBar.error( 'Error in writing .meta file. Please Reimport the asset.', '', 5000 );
		}

	}

	static createMetadataFormPath ( destinationPath: string ) {

		const filename = FileUtils.getFilenameFromPath( destinationPath );

		const extension = FileService.getExtension( destinationPath );

		return this.createMetadata( filename, extension, destinationPath );

	}


	static createMetadata ( fileName: string, ext: string, path: string, gguid?: string ): Metadata {

		const extension = ext || FileService.getExtension( path );

		const guid = gguid || THREE.MathUtils.generateUUID();

		let metadata: Metadata;

		switch ( extension ) {

			case 'scene':
				metadata = this.createSceneMetadata( fileName, guid, path );
				break;

			case 'obj':
				metadata = this.createModelMetadata( fileName, guid, path );
				break;

			case 'fbx':
				metadata = this.createModelMetadata( fileName, guid, path );
				break;

			case 'gltf':
				metadata = this.createModelMetadata( fileName, guid, path );
				break;

			case 'glb':
				metadata = this.createModelMetadata( fileName, guid, path );
				break;

			case 'xodr':
				metadata = this.createOpenDriveMetadata( fileName, guid, path );
				break;

			case 'xosc':
				metadata = this.createOpenScenarioMetadata( fileName, guid, path );
				break;

			case 'png':
				metadata = this.createTextureMetaInternal( guid, path, 'png' );
				break;

			case 'jpg':
				metadata = this.createTextureMetaInternal( guid, path, 'jpg' );
				break;

			case 'jpeg':
				metadata = this.createTextureMetaInternal( guid, path, 'jpeg' );
				break;

			case 'svg':
				metadata = this.createTextureMetaInternal( guid, path, 'svg' );
				break;

			case 'tga':
				metadata = this.createTextureMetaInternal( guid, path, 'tga' );
				break;

			case 'material':
				metadata = this.createMaterialMetadata( fileName, guid, path );
				break;

			case 'geometry':
				metadata = this.createGeometryMetadata( fileName, guid, path );
				break;

			case 'prefab':
				metadata = this.createPrefabMetadata( fileName, guid, path );
				break;

			case 'sign':
				metadata = this.createSignMetadata( fileName, guid, path );
				break;

			case TvRoadMarking.extension:
				metadata = this.createRoadMarkingMetadata( fileName, guid, path );
				break;

			case RoadStyle.extension:
				metadata = this.createRoadStyleMetadata( fileName, guid, path );
				break;

			case 'entity':
				metadata = this.createEntityMetadata( fileName, guid, path );
				break;

		}

		// if ( metadata ) this.saveMetadataFile( path, metadata );

		if ( metadata ) AssetDatabase.setMetadata( guid, metadata );

		return metadata;
	}

	static createRoadMarkingMetadata ( name: string, guid: string, path: string ): Metadata {

		return {
			guid: guid,
			importer: MetaImporter.ROAD_MARKING,
			data: {},
			path: path,
		};

	}

	static createRoadStyleMetadata ( name: string, guid: string, path: string ): Metadata {

		return {
			guid: guid,
			importer: RoadStyle.importer,
			data: {},
			path: path,
		};

	}

	static createEntityMetadata ( name: string, guid: string, path: string ): Metadata {

		return {
			guid: guid,
			importer: MetaImporter.ENTITY,
			data: {},
			path: path,
		};

	}

	static createFolderMetadata ( path: string ): Metadata {

		const guid = THREE.MathUtils.generateUUID();

		const metadata = { guid: guid, isFolder: true, path: path, importer: null, data: null };

		// this.saveMetadataFile( path, metadata );

		AssetDatabase.setMetadata( guid, metadata );

		return metadata;
	}

	static createSceneMetadata ( name: string, guid: string, path: string ) {

		return {
			guid: guid,
			importer: MetaImporter.SCENE,
			data: {},
			path: path
		};

	}

	static createModelMetadata ( name: string, guid: string, path: string ) {

		return {
			guid: guid,
			importer: MetaImporter.MODEL,
			data: { name: name, rotationVariance: new Vector3( 0, 0, 0 ), scaleVariance: new Vector3( 0, 0, 0 ) },
			path: path
		};

	}

	static createOpenDriveMetadata ( name: string, guid: string, path: string ) {

		return {
			guid: guid,
			importer: MetaImporter.OPENDRIVE,
			data: {},
			path: path
		};

	}

	static createOpenScenarioMetadata ( name: string, guid: string, path: string ) {

		return {
			guid: guid,
			importer: MetaImporter.OPENSCENARIO,
			data: {},
			path: path
		};

	}

	static createTextureMetadata ( guid: string, path: string, texture: Texture ) {

		const image = texture.image;

		// unset image to avoid write image data in json
		// this will reduce the size of the json file and
		// saves time
		texture.image = null;

		const data = texture.toJSON( undefined );

		// set image again
		texture.image = image;

		// const version = data.metadata.version || 4.5;

		data[ 'metadata' ] = null;

		return {
			guid: guid,
			version: 4.5,
			type: 'Texture',
			importer: MetaImporter.TEXTURE,
			data: data,
			path: path
		};

	}

	static createMaterialMetadata ( name: string, guid: string, path: string ) {

		return {
			guid: guid,
			importer: MetaImporter.MATERIAL,
			data: {},
			path: path,
		};

	}

	static createGeometryMetadata ( name: string, guid: string, path: string ) {

		return {
			guid: guid,
			importer: MetaImporter.GEOMETRY,
			data: {},
			path: path,
		};

	}

	static createPrefabMetadata ( name: string, guid: string, path: string ) {

		return {
			guid: guid,
			importer: MetaImporter.PREFAB,
			data: {},
			path: path,
		};

	}

	static createSignMetadata ( name: string, guid: string, path: string ) {

		return {
			guid: guid,
			importer: MetaImporter.SIGN,
			data: {},
			path: path,
		};

	}

	static loadTexture ( path: string ): Texture {

		try {

			const texture = new TextureLoader().load( `./assets/default-project/${ path }` );

			texture.wrapS = RepeatWrapping;
			texture.wrapT = RepeatWrapping;
			texture.mapping = UVMapping;
			texture.repeat.set( 1, 1 );

			return texture;

		} catch ( error ) {

			SnackBar.error( error );

			return null;

		}
	}

	static loadTGATexture ( path: string ): Texture {

		try {

			const texture = new TGALoader().load( path );

			texture.wrapS = RepeatWrapping;
			texture.wrapT = RepeatWrapping;
			texture.mapping = UVMapping;
			texture.repeat.set( 1, 1 );

			return texture;

		} catch ( error ) {

			SnackBar.error( error );

			return null;

		}
	}

	private static createTextureMetaInternal ( guid: string, path: string, extension: string ): Metadata {

		let texture: Texture;

		if ( extension == 'tga' ) {

			texture = this.loadTGATexture( path );

		} else {

			texture = this.loadTexture( path );

		}

		const metadata = this.createTextureMetadata( guid, path, texture );

		AssetDatabase.setInstance( metadata.guid, texture );

		return metadata;
	}
}
