/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';
import { SetToolCommand } from 'app/core/commands/set-tool-command';
import { ToolFactory } from 'app/core/factories/tool-factory';
import { ToolType } from 'app/core/models/tool-types.enum';
import { CommandHistory } from 'app/services/command-history';
import { BaseTool } from '../../../core/tools/base-tool';
import { ToolManager } from '../../../core/tools/tool-manager';
import { ThreeService } from '../../../modules/three-js/three.service';
import { SetInspectorCommand } from 'app/core/commands/set-inspector-command';
import { SceneService } from 'app/core/services/scene.service';
import { EnvironmentInspectorComponent } from 'app/views/inspectors/environment-inspector/environment-inspector.component';
import { ScenarioEnvironment } from 'app/modules/scenario/models/actions/scenario-environment';

class IToolMenu {
	id: string;
	label: string;
	class?: string = 'toolbar-button';
	toolType: ToolType;
	action: string;
	icon: string;
	title?: string;
	description?: string;
	descriptionHtml?: string;
	track: string;
	tooltip: string;
	click: Function;
	enabled?: boolean = true;
}

@Component( {
	selector: 'app-tool-bar',
	templateUrl: './tool-bar.component.html',
	styleUrls: [ './tool-bar.component.css' ],
} )
export class ToolBarComponent implements OnInit {

	currentTool: BaseTool;

	ToolType = ToolType;

	selectedTool: any;

	@ViewChild( 'popover', { static: false } ) popover: SatPopover;

	private tools: IToolMenu[] = [
		{
			id: 'showPointerTool',
			label: 'Pointer',
			class: 'toolbar-button border-right',
			toolType: ToolType.Pointer,
			action: 'pointer-tool',
			icon: 'mouse',
			title: 'POINTER-TITLE',
			description: 'POINTER-DESCRIPTION',
			track: 'menu',
			tooltip: 'POINTER-TITLE',
			click: () => this.setToolType( ToolType.Pointer ),
			enabled: true,
		},
		{
			id: 'showRoadTool',
			label: 'Road',
			class: 'toolbar-button',
			toolType: ToolType.Road,
			action: 'road-plan-tool',
			icon: 'timeline',
			title: 'ROAD-GEOMETRY-TITLE',
			description: 'ROAD-GEOMETRY-DESCRIPTION',
			track: 'button',
			tooltip: 'ROAD-GEOMETRY-TITLE',
			click: () => this.setToolType( ToolType.Road ),
			enabled: true,
		},
		{
			id: 'showRoadCircleTool',
			label: 'Circle',
			class: 'toolbar-button',
			toolType: ToolType.RoadCircle,
			action: 'road-circle-tool',
			icon: 'trip_origin',
			title: 'ROAD-CIRCLE-TITLE',
			description: 'ROAD-CIRCLE-DESCRIPTION',
			track: 'button',
			tooltip: 'ROAD-CIRCLE-TITLE',
			click: () => this.setToolType( ToolType.RoadCircle ),
			enabled: true,
		},
		{
			id: 'showRoadElevationTool',
			label: 'Elevation',
			class: 'toolbar-button border-right',
			toolType: ToolType.RoadElevation,
			action: 'road-Elevation-tool',
			icon: 'height',
			title: 'ROAD-Elevation-TITLE',
			description: 'ROAD-Elevation-DESCRIPTION',
			track: 'button',
			tooltip: 'Road Elevation Tool',
			click: () => this.setToolType( ToolType.RoadElevation ),
			enabled: true,
		},
		{
			id: 'showLaneTool',
			label: 'Lane',
			class: 'toolbar-button',
			toolType: ToolType.Lane,
			action: 'lane-tool',
			icon: 'swap_horiz',
			title: 'LANE-TOOL-TITLE',
			description: 'LANE-TOOL-DESCRIPTION',
			track: 'button',
			tooltip: 'LANE-TOOL-TITLE',
			click: () => this.setToolType( ToolType.Lane ),
			enabled: true,
		},
		{
			id: 'showLaneWidthTool',
			label: 'LaneWidth',
			class: 'toolbar-button',
			toolType: ToolType.LaneWidth,
			action: 'lane-width-tool',
			icon: 'format_line_spacing',
			title: 'LANE-WIDTH-TOOL-TITLE',
			description: 'LANE-WIDTH-TOOL-DESCRIPTION',
			track: 'button',
			tooltip: 'LANE-WIDTH-TOOL-TITLE',
			click: () => this.setToolType( ToolType.LaneWidth ),
			enabled: true,
		},
		{
			id: 'showLaneOffsetTool',
			label: 'LaneOffset',
			class: 'toolbar-button',
			toolType: ToolType.LaneOffset,
			action: 'lane-offset-tool',
			icon: 'vertical_align_center',
			track: 'button',
			tooltip: 'LANE-OFFSET-TITLE',
			title: 'LANE-OFFSET-TITLE',
			description: 'LANE-OFFSET-DESCRIPTION',
			descriptionHtml: '<br/><br/> <img src="assets/Lane-Offset-Tool.gif"/>',
			click: () => this.setToolType( ToolType.LaneOffset ),
			enabled: true,
		},
		{
			id: 'showAddLaneTool',
			label: 'AddLane',
			class: 'toolbar-button',
			toolType: ToolType.LaneAdd,
			action: 'add-lane-tool',
			icon: 'playlist_add',
			title: 'ADD-LANE-TOOL-TITLE',
			description: 'ADD-LANE-TOOL-DESCRIPTION',
			track: 'button',
			tooltip: 'ADD-LANE-TOOL-TITLE',
			click: () => this.setToolType( ToolType.LaneAdd ),
			enabled: true,
		},
		{
			id: 'showLaneMarkingTool',
			label: 'LaneMarking',
			class: 'toolbar-button border-right',
			toolType: ToolType.LaneMarking,
			action: 'lane-marking-tool',
			icon: 'format_align_center',
			title: 'LANE-MARKING-TOOL-TITLE',
			description: 'LANE-MARKING-TOOL-DESCRIPTION',
			track: 'button',
			tooltip: 'LANE-MARKING-TOOL-TITLE',
			click: () => this.setToolType( ToolType.LaneMarking ),
			enabled: true,
		},
		{
			id: 'showMarkingPointTool',
			label: 'MarkingPoint',
			class: 'toolbar-button',
			toolType: ToolType.MarkingPoint,
			action: 'marking-point-tool',
			icon: 'call_split',
			title: 'Marking Point Tool',
			description: 'Tool to create road marking points <br/> Select a roadmarking from ProjectBrowser <br/> Then use SHIFT + LEFT CLICK on road to create a roadmarking point',
			track: 'button',
			tooltip: 'Marking Point Tool',
			click: () => this.setToolType( ToolType.MarkingPoint ),
			enabled: false,
		},
		{
			id: 'showCrosswalkTool',
			label: 'Crosswalk',
			class: 'toolbar-button',
			toolType: ToolType.Crosswalk,
			action: 'crosswalk-tool',
			icon: 'reorder', // 'call_split', receipt
			title: 'CROSSWALK-TITLE',
			track: 'button',
			tooltip: 'CROSSWALK-TITLE',
			click: () => this.setToolType( ToolType.Crosswalk ),
			enabled: true,
		},
		{
			id: 'showManeueverTool',
			label: 'Maneuver',
			class: 'toolbar-button border-right',
			toolType: ToolType.Maneuver,
			action: 'maneuver-tool',
			icon: 'fullscreen_exit',
			title: 'MANEUVER-TITLE',
			description: 'MANEUVER-DESCRIPTION',
			descriptionHtml: '<br/><br/> <img src="assets/Maneuver-Tool.gif"/>',
			track: 'button',
			tooltip: 'MANEUVER-TITLE',
			click: () => this.setToolType( ToolType.Maneuver ),
			enabled: true,
		},
		{
			id: 'showPropPointTool',
			label: 'PropPoint',
			class: 'toolbar-button',
			toolType: ToolType.PropPoint,
			action: 'prop-point-tool',
			icon: 'category',
			track: 'button',
			tooltip: 'PROP-POINT-TOOL-TITLE',
			title: 'PROP-POINT-TOOL-TITLE',
			description: 'PROP-POINT-TOOL-DESCRIPTION',
			click: () => this.setToolType( ToolType.PropPoint ),
			enabled: true,
		},
		{
			id: 'showPropCurveTool',
			label: 'PropCurve',
			class: 'toolbar-button',
			toolType: ToolType.PropCurve,
			action: 'prop-curve-tool',
			icon: 'category',
			track: 'button',
			tooltip: 'PROP-CURVE-TOOL-TITLE',
			title: 'PROP-CURVE-TOOL-TITLE',
			description: 'PROP-CURVE-TOOL-DESCRIPTION',
			click: () => this.setToolType( ToolType.PropCurve ),
			enabled: true,
		},
		{
			id: 'showPropPolygonTool',
			label: 'PropPolygon',
			class: 'toolbar-button',
			toolType: ToolType.PropPolygon,
			action: 'prop-polygon-tool',
			icon: 'category',
			track: 'button',
			tooltip: 'PROP-POLYGON-TOOL-TITLE',
			title: 'PROP-POLYGON-TOOL-TITLE',
			description: 'PROP-POLYGON-TOOL-DESCRIPTION',
			click: () => this.setToolType( ToolType.PropPolygon ),
			enabled: true,
		},
		{
			id: 'signal',
			label: 'Signal',
			class: 'toolbar-button border-right',
			toolType: ToolType.RoadSignalTool,
			action: 'signal-tool',
			icon: 'directions', // signpost,directions
			track: 'menu',
			tooltip: 'Signal Tool',
			click: () => this.setToolType( ToolType.RoadSignalTool ),
			enabled: false,
		},
		{
			id: 'showSurfaceTool',
			label: 'Surface',
			class: 'toolbar-button',
			toolType: ToolType.Surface,
			action: 'surface-tool',
			icon: 'landscape',
			track: 'button',
			tooltip: 'SURFACE-TITLE',
			title: 'SURFACE-TITLE',
			description: 'SURFACE-DESCRIPTION',
			descriptionHtml: '<br/><br/> <img src="assets/Surface-Tool.gif"/>',
			click: () => this.setToolType( ToolType.Surface ),
			enabled: true,
		},
		{
			id: 'vehicle',
			label: 'VehicleTool',
			class: 'toolbar-button',
			toolType: ToolType.Vehicle,
			action: 'vehicle-tool',
			icon: 'directions_car',
			track: 'menu',
			tooltip: 'Vehicle Tool',
			click: () => this.setToolType( ToolType.Vehicle ),
			enabled: false,
		},
		{
			id: 'environment',
			label: 'Environment',
			class: 'toolbar-button',
			toolType: ToolType.Environment,
			action: 'environment-tool',
			icon: 'light_mode',
			track: 'menu',
			tooltip: 'Environment',
			click: () => {

				const environment = this.threeService.environment;

				const command = new SetInspectorCommand( EnvironmentInspectorComponent, environment )

				CommandHistory.execute( command );

			},
			enabled: false,
		},
		// add more tools here...
	];

	enabledTools = this.tools.filter( tool => tool.enabled );

	constructor (
		private threeService: ThreeService,
		private viewContainerRef: ViewContainerRef,
	) {
	}

	ngOnInit () {

		ToolManager.toolChanged.subscribe( ( tool: BaseTool ) => {

			this.currentTool = tool;

		} );

	}

	getClass ( tool ) {

		if ( !this.currentTool ) return tool.class;

		return this.currentTool.toolType == tool.toolType ? 'mat-accent ' + tool.class : tool.class;

	}

	onMouseOver ( tool: any ) {

		if ( tool.description ) {

			const element = document.getElementById( tool.id );

			this.popover.setCustomAnchor( this.viewContainerRef, element );

			// bug fix to avoid auto selection of tool and buttons
			// which makes them appear as selected
			this.popover.open( {
				restoreFocus: false,
				autoFocus: false
			} );

			this.selectedTool = tool;

		} else {

			this.popover.close();

			this.selectedTool = null;

		}

	}

	onMouseOut ( tool: any ) {

		this.popover.anchor = null;

		this.popover.close();

		this.selectedTool = null;

	}

	setToolType ( type: ToolType ) {

		CommandHistory.execute( new SetToolCommand( ToolFactory.createTool( type ) ) );

	}

}
