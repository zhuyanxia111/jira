import { Select } from "antd";
import React from "react";
import { Raw } from "types";
type SelectProps = React.ComponentProps<typeof Select>; //扒下select身上所有的属性
interface IdSelectProps
  extends Omit<SelectProps, "value" | "onChange" | "options"> {
  //继承select所有除了'value' | 'onChange' | 'options'属性之外的属性
  value?: Raw | null | undefined;
  onChange?: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options, ...restProps } = props;
  return (
    <Select
      value={options?.length ? toNumber(value) : 0}
      onChange={(value) => onChange?.(toNumber(value) || undefined)}
      {...restProps}
    >
      {defaultOptionName ? (
        <Select.Option value={0}> {defaultOptionName} </Select.Option>
      ) : null}
      {options?.map((options) => (
        <Select.Option key={options.id} value={options.id}>
          {options.name}
        </Select.Option>
      ))}
    </Select>
  );
};
const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));
