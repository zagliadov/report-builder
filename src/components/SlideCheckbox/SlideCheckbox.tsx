import React, { useId } from "react";

import classnames from "classnames/bind";

import styles from "./SlideCheckbox.module.scss";

const cx = classnames.bind(styles);

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked: boolean;
  index: number;
  checkboxNumber: number;
  onChange: (
    checked: boolean,
    index: number,
    checkboxNumber: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}


function SlideCheckbox({
  checked,
  disabled,
  onChange,
  index,
  checkboxNumber,
  ...attributes
}: Props) {
  const inputId = useId();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!disabled) {
      onChange(event.target.checked, index, checkboxNumber, event);
    }
  }

  return (
    <div className={cx("slide-checkbox")}>
      <label
        htmlFor={inputId}
        className={cx({
          disabled,
        })}
      >
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            {...attributes}
          />

        <div className={cx("checkbox-wrapper")}>
          <div className={cx("circle")} />
        </div>
      </label>
    </div>
  );
}

export default SlideCheckbox;
