import type { Extender, FieldsSetter } from '@felte/common';
import { reporter as svelteReporter } from '@felte/reporter-svelte';
import { validator as zodValidator } from '@felte/validator-zod';
import { createForm } from 'felte';
import type { Readable, Unsubscriber, Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import * as zod from 'zod';

import type { FormGenerator } from './generator';
import type { ArrayElement, BaseElement, ObjectElement, Resolvable } from './types';
import { fromZod } from './validators';

// TODO Replace unknown with calculated value somehow E[number]['value']
// TODO Figure out why this falls back to unknown with more than one element

type SubRemap<T> = T extends ObjectElement<BaseElement<string>>
  ? ReMapper<T['elements']>
  : T extends ArrayElement<BaseElement<string>>
  ? T['element'] extends Omit<ObjectElement<BaseElement<string>>, 'name'>
    ? ReMapper<T['element']['elements']>[]
    : unknown[]
  : unknown;

type ReMapper<E extends Readonly<BaseElement<string>[]>> = {
  [key in Extract<E[number], { name: string }> as key['name']]: E[number] extends { name: string }
    ? SubRemap<E[number]>
    : never;
};

export class FormInstance<T extends FormGenerator, E extends Readonly<BaseElement<string>[]>> {
  private readonly data: Writable<ReMapper<E>>;
  private setFields: FieldsSetter<Record<string, unknown>>;
  private dataSubscriber: Unsubscriber | undefined;
  private updating = false;

  constructor(public generator: T, public elements: E) {
    this.data = writable({} as ReMapper<E>);

    this.data.subscribe((value) => {
      if (!this.updating && this.setFields) {
        this.setFields(value);
      }
      this.updating = false;
    });
  }

  createForm() {
    const { form, data, setFields } = createForm({
      initialValues: {}, // TODO Initial values
      extend: this.getExtensions(),
      onSubmit: console.log // TODO Submit handling
    });

    if (this.dataSubscriber) {
      this.dataSubscriber();
      this.dataSubscriber = undefined;
    }

    this.setFields = setFields;
    this.dataSubscriber = data.subscribe((d) => {
      // TODO Figure out a cleaner way
      this.updating = true;
      this.data.set(d);
    });

    return form;
  }

  getData(): Writable<ReMapper<E>> {
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
      } else if (typeof params === 'object' && 'subscribe' in params) {
        return params as Readable<{ [key: string]: string }>;
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
    } else if (typeof field === 'object' && 'subscribe' in field) {
      return field;
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

  // TODO Expandable extensions
  getExtensions(): Extender[] {
    return [this.getValidator(), this.getReporter()];
  }
}
