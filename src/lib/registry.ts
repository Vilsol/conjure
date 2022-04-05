import type { BaseElement, BaseInput, Header, Input, Resolvable, Select, Textarea } from '$lib/types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import HeaderComponent from '$lib/types/Header.svelte';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import InputComponent from '$lib/types/Input.svelte';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SelectComponent from '$lib/types/Select.svelte';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TextareaComponent from '$lib/types/Textarea.svelte';
import type { Readable, Unsubscriber, Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import * as zod from 'zod';

export class FormGenerator<T extends BaseElement<string> = never> {
  constructor(
    private typeRegistry: Map<string, unknown> = new Map(),
    private defaultParams: Map<string, { [key: string]: string }> = new Map()
  ) {}

  /**
   * Extend generator with a new element type
   * @param type Type name
   * @param component Type component
   */
  withType<M extends BaseElement<string>>(
    type: M extends BaseElement<infer S> ? S : never,
    component: unknown
  ): FormGenerator<T | M> {
    const newTypeRegistry = new Map(this.typeRegistry);
    newTypeRegistry.set(type, component);
    return new FormGenerator<T | M>(newTypeRegistry, new Map(this.defaultParams));
  }

  /**
   * Retrieve a component from the type registry
   * @param typeName Name of the component
   */
  getComponent(typeName: string): unknown | undefined {
    return this.typeRegistry.get(typeName);
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

type ReMapper<E extends Readonly<BaseElement<string>[]>> = {
  // TODO Replace unknown with calculated value somehow E[number]['value']
  [key in Extract<E[number], BaseInput<string>> as key['name']]: unknown;
};

export class FormInstance<T extends FormGenerator, E extends Readonly<BaseElement<string>[]>> {
  private readonly data: Writable<ReMapper<E>>;
  private dataSubscriber: Unsubscriber | undefined;

  constructor(public generator: T, public elements: E) {
    this.data = writable({} as ReMapper<E>);
  }

  setData(data: Readable<ReMapper<E>>) {
    if (this.dataSubscriber) {
      this.dataSubscriber();
      this.dataSubscriber = undefined;
    }

    this.dataSubscriber = data.subscribe((d) => this.data.set(d));
  }

  getData(): Readable<ReMapper<E>> {
    return this.data;
  }

  // TODO Figure out how to return actual params not map of strings
  resolveParams<X extends { [key: string]: unknown }>(
    input: BaseElement<string> & { params?: Resolvable<X>; schema?: ZodTypeAny }
  ): Readable<{ [key: string]: string }> {
    const result = writable({
      // TODO ...(input.schema ? fromZod(input.schema) : {}),
      ...(this.generator.getDefaultParams(input.type) || {})
    });

    if (input.params) {
      const params = input.params;

      if (typeof params === 'function') {
        this.getData().subscribe((data) => {
          Promise.resolve(params(data)).then((resolvedParams) => {
            result.set({
              // TODO ...(input.schema ? fromZod(input.schema) : {}),
              ...(this.generator.getDefaultParams(input.type) || {}),
              ...resolvedParams
            });
          });
        });
      } else {
        Promise.resolve(params).then((resolvedParams) => {
          result.set({
            // TODO ...(input.schema ? fromZod(input.schema) : {}),
            ...(this.generator.getDefaultParams(input.type) || {}),
            ...resolvedParams
          });
        });
      }
    }

    return result;
  }

  resolveField<X>(field: Resolvable<X>): Readable<X> {
    const result = writable<X>();

    if (typeof field === 'function') {
      this.getData().subscribe((data) => {
        const resolvableParams = (field as (data: unknown) => X | PromiseLike<X>)(data);

        Promise.resolve(resolvableParams).then((resolvedParams) => {
          result.set(resolvedParams);
        });
      });
    } else {
      Promise.resolve(field).then((resolvedParams) => {
        result.set(resolvedParams);
      });
    }

    return result;
  }

  getValidationSchema() {
    return zod.object(
      this.elements.reduce((base, value) => {
        if ('schema' in value && 'name' in value) {
          base[value['name']] = value['schema'];
        }
        return base;
      }, {})
    );
  }
}

export const Base = new FormGenerator()
  .withType<Input>('input', InputComponent)
  .withType<Textarea>('textarea', TextareaComponent)
  .withType<Select>('select', SelectComponent)
  .withType<Header>('header', HeaderComponent);
