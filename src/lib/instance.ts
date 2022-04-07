import type { Extender } from '@felte/common';
import { reporter as svelteReporter } from '@felte/reporter-svelte';
import { validator as zodValidator } from '@felte/validator-zod';
import type { Readable, Unsubscriber, Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import * as zod from 'zod';

import type { FormGenerator } from './generator';
import type { BaseElement, BaseInput, Resolvable } from './types';
import { fromZod } from './validators';

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
    let base = {
      ...(this.generator.getDefaultParams(input.type) || {})
    };

    if (input.schema) {
      const fromValidator = this.generator.getFromValidator<X>(input.type);
      if (fromValidator) {
        // TODO Support various validators
        base = fromValidator(base as X, fromZod(input.schema)) as { [key: string]: string };
      }
    }

    const result = writable(base);

    if (input.params) {
      const params = input.params;

      if (typeof params === 'function') {
        this.getData().subscribe((data) => {
          Promise.resolve(params(data)).then((resolvedParams) => {
            result.set({
              ...base,
              ...resolvedParams
            });
          });
        });
      } else {
        Promise.resolve(params).then((resolvedParams) => {
          result.set({
            ...base,
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

  // TODO Support various validators
  getValidationSchema(): ZodObject<ZodRawShape> {
    return zod.object(
      this.elements.reduce((base, value) => {
        if ('schema' in value && 'name' in value) {
          base[value['name']] = value['schema'];
        }
        return base;
      }, {})
    );
  }

  // TODO Support various validators
  getValidator(): Extender {
    return zodValidator({
      schema: this.getValidationSchema()
    });
  }

  // TODO Support various reporters
  getReporter(): Extender {
    return svelteReporter;
  }

  getExtensions(): Extender[] {
    return [this.getValidator(), this.getReporter()];
  }
}
