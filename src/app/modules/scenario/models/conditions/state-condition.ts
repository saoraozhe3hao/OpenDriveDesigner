/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { ConditionCategory } from '../tv-enums';
import { Condition } from './tv-condition';

export abstract class StateCondition extends Condition {

	public category: ConditionCategory = ConditionCategory.ByState;

}
