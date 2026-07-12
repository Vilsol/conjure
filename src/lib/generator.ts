import { FormInstance } from './instance.js';
import type { FormOptions, ReMapper } from './instance.js';
import type { ArrayElement, BaseElement, BaseProps, ExtractBaseElement, ObjectElement } from './types.js';
import type { ValidatorDefinition } from './validators/index.js';
import type { Component } from 'svelte';

interface TypeRegistryElement<P> {
	component: Component<BaseProps<BaseElement<string>>>;
	fromValidator?: (params: P, definition: ValidatorDefinition) => P;
}

export type CommonSlot = 'wrapper' | 'label';

/**
 * Used to create a form generator that can be extended with new element types.
 * It allows you to define new element types, retrieve components and validators, and create new form instances.
 *
 * The class is immutable, so any modification will return a new instance of the class.
 *
 * @template T - The type of the elements in the form generator.
 */
export class FormGenerator<T extends BaseElement<string> = never> {
	constructor(
		private typeRegistry: Map<string, TypeRegistryElement<unknown>> = new Map(),
		private defaultParams: Map<string, { [key: string]: unknown }> = new Map(),
		private commonParams: Map<CommonSlot, { [key: string]: unknown }> = new Map()
	) {}

	/**
	 * Extend generator with a new element type
	 * @param type Type name
	 * @param component Type component
	 * @param fromValidator Converter from validator definition
	 */
	withType<M extends BaseElement<string>, P = unknown>(
		type: ExtractBaseElement<M>,
		component: Component<BaseProps<M>>,
		fromValidator?: (params: P, definition: ValidatorDefinition) => P
	): FormGenerator<T | M> {
		const newTypeRegistry = new Map(this.typeRegistry);
		newTypeRegistry.set(type, {
			component: component as Component<BaseProps<BaseElement<string>>>,
			fromValidator: fromValidator as (params: unknown, definition: ValidatorDefinition) => unknown
		});
		return new FormGenerator<T | M>(newTypeRegistry, new Map(this.defaultParams), new Map(this.commonParams));
	}

	/**
	 * Register a structural container component (array/object) without
	 * adding it to the element type union.
	 * Overwrites any existing registration for `type`, including its validator converter.
	 * @param type Container type name
	 * @param component Container component
	 */
	withContainer<M extends BaseElement<string>>(type: string, component: Component<BaseProps<M>>): FormGenerator<T> {
		const newTypeRegistry = new Map(this.typeRegistry);
		newTypeRegistry.set(type, {
			component: component as Component<BaseProps<BaseElement<string>>>
		});
		return new FormGenerator(newTypeRegistry, new Map(this.defaultParams), new Map(this.commonParams));
	}

	/**
	 * Retrieve a component from the type registry
	 * @param typeName Name of the element type
	 */
	getComponent(typeName: T['type']): Component<BaseProps<BaseElement<string>>> | undefined {
		return this.typeRegistry.get(typeName)?.component;
	}

	/**
	 * Retrieve a component validator parameter converter from the type registry
	 * @param typeName Name of the element type
	 */
	getFromValidator<P = unknown>(typeName: T['type']): ((params: P, definition: ValidatorDefinition) => P) | undefined {
		return this.typeRegistry.get(typeName)?.fromValidator as
			((params: P, definition: ValidatorDefinition) => P) | undefined;
	}

	/**
	 * Add a parameter on an element type as a default parameter
	 * @param typeName Element type name
	 * @param param Parameter name
	 * @param value Default value
	 */
	withDefaultParam(typeName: T['type'], param: string, value: unknown): FormGenerator<T> {
		const newDefaultParams = new Map(this.defaultParams);
		const allParams = { ...(newDefaultParams.get(typeName) || {}) };
		allParams[param] = value;
		newDefaultParams.set(typeName, allParams);
		return new FormGenerator(new Map(this.typeRegistry), newDefaultParams, new Map(this.commonParams));
	}

	/**
	 * Get all the default params for a type
	 * @param typeName The type name
	 */
	getDefaultParams(typeName: T['type']): { [key: string]: unknown } {
		return { ...(this.defaultParams.get(typeName) || {}) };
	}

	/**
	 * Set an attribute rendered on the built-in Wrapper or Label of every element
	 * @param slot Common component slot
	 * @param param Parameter name
	 * @param value Value
	 */
	withCommonParam(slot: CommonSlot, param: string, value: unknown): FormGenerator<T> {
		const newCommonParams = new Map(this.commonParams);
		newCommonParams.set(slot, { ...(newCommonParams.get(slot) || {}), [param]: value });
		return new FormGenerator(new Map(this.typeRegistry), new Map(this.defaultParams), newCommonParams);
	}

	/**
	 * Get all params for a common component slot
	 * @param slot Common component slot
	 */
	getCommonParams(slot: CommonSlot): { [key: string]: unknown } {
		return { ...(this.commonParams.get(slot) || {}) };
	}

	/**
	 * Create a new form instance of provided schema
	 * @param elements Elements of the schema
	 * @param options Form behavior such as the submit handler
	 */
	newForm<E extends Readonly<(T | ArrayElement<T> | ObjectElement<T>)[]>>(
		elements: E,
		options?: FormOptions<ReMapper<E>>
	): FormInstance<FormGenerator<T>, E> {
		// TODO Validate no duplicate names
		return new FormInstance<FormGenerator<T>, E>(this, elements, options);
	}
}
