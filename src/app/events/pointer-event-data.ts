/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { Camera, Face, Intersection, Object3D, Vector2, Vector3 } from 'three';

export class BaseEventData {
	object: Object3D;
}

export enum MouseButton {
	LEFT = 0,
	MIDDLE = 1,
	RIGHT = 2
}

export class PointerMoveData {
	point: Vector3;
}

export class PointerEventData extends BaseEventData {

	distance: number;
	distanceToRay?: number;
	point: Vector3;
	index?: number;
	face?: Face | null;
	faceIndex?: number;
	uv?: Vector2;
	button: MouseButton;
	intersections?: Intersection[];
	approxCameraDistance?: number;
	camera?: Camera;
	mouse?: Vector2;
	mouseEvent?: MouseEvent;

	constructor ( partialData: Partial<PointerEventData> = {} ) {
		super();
		this.distance = partialData.distance || 0;
		this.distanceToRay = partialData.distanceToRay;
		this.point = partialData.point;
		this.index = partialData.index;
		this.face = partialData.face;
		this.faceIndex = partialData.faceIndex;
		this.uv = partialData.uv;
		this.button = partialData.button;
		this.intersections = partialData.intersections || [];
		this.approxCameraDistance = partialData.approxCameraDistance;
		this.camera = partialData.camera;
		this.mouse = partialData.mouse;
		this.mouseEvent = partialData.mouseEvent;
	}
}

