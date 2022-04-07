import { FormInstance } from '$lib';
import type { BaseElement } from '$lib/types';
import type { ValidatorDefinition } from '$lib/validators';

interface TypeRegistryElement<P> {
  component: unknown;
  fromValidator: (params: P, definition: ValidatorDefinition) => P;
}

export class FormGenerator<T extends BaseElement<string> = never> {
  constructor(
    private typeRegistry: Map<string, TypeRegistryElement<unknown>> = new Map(),
    private defaultParams: Map<string, { [key: string]: string }> = new Map()
  ) {}

  /**
   * Extend generator with a new element type
   * @param type Type name
   * @param component Type component
   * @param fromValidator Converter from validator definition
   */
  withType<M extends BaseElement<string>, P = unknown>(
    type: M extends BaseElement<infer S> ? S : never,
    component: unknown,
    fromValidator?: (params: P, definition: ValidatorDefinition) => P
  ): FormGenerator<T | M> {
    const newTypeRegistry = new Map(this.typeRegistry);
    newTypeRegistry.set(type, {
      component,
      fromValidator
    });
    return new FormGenerator<T | M>(newTypeRegistry, new Map(this.defaultParams));
  }

  /**
   * Retrieve a component from the type registry
   * @param typeName Name of the element type
   */
  getComponent(typeName: string): unknown | undefined {
    return this.typeRegistry.get(typeName)?.component;
  }

  /**
   * Retrieve a component validator parameter converter from the type registry
   * @param typeName Name of the element type
   */
  getFromValidator<P = unknown>(typeName: string): (params: P, definition: ValidatorDefinition) => P | undefined {
    return this.typeRegistry.get(typeName)?.fromValidator as (params: P, definition: ValidatorDefinition) => P;
  }

  /**
   * Add a parameter on an element type as a default parameter
   * @param type Element type name
   * @param param Parameter name
   * @param value Default value
   */
  withDefaultParam(type: T['type'], param: string, value: string): FormGenerator<T> {
    const newDefaultParams = new Map(this.defaultParams);
    const allParams = newDefaultParams.get(type) || {};
    allParams[param] = value;
    newDefaultParams.set(type, allParams);
    return new FormGenerator(new Map(this.typeRegistry), newDefaultParams);
  }

  /**
   * Get all the default params for a type
   * @param type The type name
   */
  getDefaultParams(type: string): { [key: string]: string } {
    return this.defaultParams.get(type);
  }

  /**
   * Create a new form instance of provided schema
   * @param elements Elements of the schema
   */
  newForm<E extends Readonly<T[]>>(elements: E): FormInstance<FormGenerator<T>, E> {
    // TODO Validate no duplicate names
    return new FormInstance<FormGenerator<T>, E>(this, elements);
  }
}
