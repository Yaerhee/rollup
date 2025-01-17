import type ExternalModule from '../../ExternalModule';
import type { NodeInteraction } from '../NodeInteractions';
import { INTERACTION_ACCESSED } from '../NodeInteractions';
import type Identifier from '../nodes/Identifier';
import type { ObjectPath } from '../utils/PathTracker';
import Variable from './Variable';

export default class ExternalVariable extends Variable {
	isNamespace: boolean;
	module: ExternalModule;
	referenced = false;

	constructor(module: ExternalModule, name: string) {
		super(name);
		this.module = module;
		this.isNamespace = name === '*';
	}

	addReference(identifier: Identifier): void {
		this.referenced = true;
		if (this.name === 'default' || this.name === '*') {
			this.module.suggestName(identifier.name);
		}
	}

	hasEffectsOnInteractionAtPath(path: ObjectPath, { type }: NodeInteraction): boolean {
		return type !== INTERACTION_ACCESSED || path.length > (this.isNamespace ? 1 : 0);
	}

	include(): void {
		if (!this.included) {
			this.included = true;
			this.module.used = true;
		}
	}
}
