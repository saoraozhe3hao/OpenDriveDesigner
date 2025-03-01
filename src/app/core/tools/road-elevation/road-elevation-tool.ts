/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { IToolWithPoint, SelectPointCommand } from 'app/core/commands/select-point-command';
import { SetInspectorCommand } from 'app/core/commands/set-inspector-command';
import { KeyboardInput } from 'app/core/input';
import { ToolType } from 'app/core/models/tool-types.enum';
import { PickingHelper } from 'app/core/services/picking-helper.service';
import { MouseButton, PointerEventData } from 'app/events/pointer-event-data';
import { ISelectable } from 'app/modules/three-js/objects/i-selectable';
import { RoadElevationNode } from 'app/modules/three-js/objects/road-elevation-node';
import { TvRoad } from 'app/modules/tv-map/models/tv-road.model';
import { CommandHistory } from 'app/services/command-history';
import { DynamicInspectorComponent } from 'app/views/inspectors/dynamic-inspector/dynamic-inspector.component';
import { Vector3 } from 'three';
import { BaseTool } from '../base-tool';
import { CreateElevationNodeCommand } from './create-elevation-node-command';
import { HideElevationNodes, ShowElevationNodes } from './show-elevation-nodes';
import { UpdateElevationNodePosition } from './update-elevation-node-position';

export class RoadElevationTool extends BaseTool implements IToolWithPoint {

	name: string = 'Road Elevation Tool';

	toolType: ToolType = ToolType.RoadElevation;

	road: TvRoad;

	node: RoadElevationNode;

	nodeChanged: boolean = false;

	get nodes () {

		return this.road?.elevationProfile?.elevation.map( e => e.node ) || [];

	}

	init (): void {

		this.setHint( 'use LEFT CLICK to select a road' );

	}

	enable (): void {

		super.enable();

	}

	disable (): void {

		super.disable();

		this.map.getRoads().forEach( road => road.hideElevationNodes() );

	}

	onPointerDown ( e: PointerEventData ): void {

		if ( !e.point || e.button != MouseButton.LEFT ) return;

		if ( KeyboardInput.isShiftKeyDown ) {

			const lane = PickingHelper.checkLaneObjectInteraction( e );

			if ( !lane ) return;

			this.createRoadElevationNode( lane.laneSection.road, e.point );

		} else {

			if ( this.isNodeSelected( e ) ) return;

			if ( this.isRoadSelected( e ) ) return;

			if ( this.road ) this.unselectRoad();

			this.setHint( 'use LEFT CLICK to select a road' );

		}

	}

	public onPointerUp () {

		if ( this.nodeChanged && this.node ) {

			const newPosition = this.node.position.clone();

			const oldPosition = this.pointerDownAt.clone();

			CommandHistory.execute( new UpdateElevationNodePosition( this.node, newPosition, oldPosition ) );

		}

		this.nodeChanged = false;
	}

	public onPointerMoved ( e: PointerEventData ) {

		if ( this.isPointerDown && this.node ) {

			this.nodeChanged = true;

			this.node.updateByPosition( e.point );

		}

	}

	createRoadElevationNode ( road: TvRoad, point: Vector3 ) {

		CommandHistory.execute( new CreateElevationNodeCommand( this, road, point ) );

	}

	selectRoad ( road: TvRoad ): void {

		this.setHint( 'New Road Selected' );

		CommandHistory.execute( new ShowElevationNodes( this, road, this.road ) );

	}

	unselectRoad (): void {

		CommandHistory.execute( new HideElevationNodes( this, this.road, this.node ) );

	}

	selectNode ( node: RoadElevationNode ) {

		const command = new SelectPointCommand( this, node, DynamicInspectorComponent, node );

		CommandHistory.execute( command );

		this.setHint( 'Drag node to modify position. Change properties from inspector' );
	}

	setPoint ( value: ISelectable ): void {

		this.node = value as RoadElevationNode;

	}

	getPoint (): ISelectable {

		return this.node;

	}

	private isRoadSelected ( e: PointerEventData ): boolean {

		const newLane = PickingHelper.checkLaneObjectInteraction( e );

		if ( !newLane ) return false;

		if ( !this.road || this.road?.id !== newLane.roadId ) {

			this.selectRoad( newLane.laneSection.road );

		} else if ( this.road && this.node ) {

			// unselct node because road is selected
			CommandHistory.executeMany(
				new SelectPointCommand( this, null ),
				new SetInspectorCommand( null, null )
			);

		}

		return true;
	}

	private isNodeSelected ( e: PointerEventData ): boolean {

		const node = PickingHelper.checkControlPointInteraction( e, RoadElevationNode.TAG ) as RoadElevationNode;

		if ( !node || !node.parent ) return false;

		if ( !this.node || this.node.uuid !== node.uuid ) {

			this.selectNode( node );

		}

		return true;
	}

}
