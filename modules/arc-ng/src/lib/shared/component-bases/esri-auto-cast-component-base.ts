import { AutoCast, isDependantChild } from '../type-utils';

export abstract class EsriAutoCastComponentBase<T> {
  instance: AutoCast<T>;

  protected constructor(autoCastType: string) {
    this.instance = {
      type: autoCastType,
      ...this.instance
    };
  }

  protected changeField<K extends keyof AutoCast<T>>(fieldName: K, value: AutoCast<T>[K]): void {
    this.instance[fieldName] = value;
    if (isDependantChild(this)) {
      this.childChanged.emit();
    }
  }
}
