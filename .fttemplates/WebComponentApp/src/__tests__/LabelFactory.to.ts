// TODO: replace with the corresponding module factories
import ObjectFactory, {
  type ListMapFunction,
} from '@monorepo/common-lib/__tests__/ObjectFactory.to';
import {
  Label,
  LabelType,
  LabelVariant,
  type LabelObj,
  type NullableFlatLabelData,
} from '@monorepo/design-hub/common/classes/Label';

export default class LabelFactory extends ObjectFactory<
  Label,
  Partial<LabelObj>
> {
  constructor(args: Partial<LabelObj>) {
    if (!args.type) args.type = LabelType.DYMO30252;
    if (!args.variant) args.variant = LabelVariant.ESSENTIAL;
    super(Label, args);
  }

  static get allPossibleLabels(): LabelObj[] {
    return Object.values(LabelType).flatMap((type) =>
      Label.getVariantsByType(type).map((variant) => ({
        type,
        variant,
        templateName: `${
          Label.readableVariants[variant]
        } ${Label.readableTypes[type]}`,
      })),
    );
  }

  setData(data: NullableFlatLabelData) {
    this.item.setDataValues(data);
    return this;
  }

  static default(): LabelFactory {
    return new LabelFactory({
      type: LabelType.DYMO30252,
      variant: LabelVariant.ESSENTIAL,
    });
  }

  static create(args: Partial<LabelObj>): LabelFactory {
    return new LabelFactory({
      type: LabelType.DYMO30252,
      variant: LabelVariant.ESSENTIAL,
      ...args,
    });
  }

  build(): Readonly<LabelObj> {
    return this.item.toObject();
  }

  static listDefault(
    length: number,
    mapFunction?: ListMapFunction<LabelFactory>,
  ): Readonly<LabelObj>[] {
    return super.list<Label, LabelObj, LabelFactory>(
      length,
      () => LabelFactory.default(),
      mapFunction,
    );
  }

  static fromBaseArray(
    base: Partial<LabelObj>[],
    mapFunction?: ListMapFunction<LabelFactory>,
  ) {
    return super.list<Label, LabelObj, LabelFactory>(
      base.length,
      (index) => new LabelFactory(base[index]),
      mapFunction,
    );
  }

  static listAllPossibleLabels(mapFunction?: ListMapFunction<LabelFactory>) {
    return this.fromBaseArray(this.allPossibleLabels, mapFunction);
  }
}
