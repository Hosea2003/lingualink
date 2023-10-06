import React, { useState } from 'react'
import CustomInput, { CustomInputProps } from './CustomInput'
import Check from '../assets/images/check.png'
import Close from '../assets/images/close.png'

type InputWithMarkProps = {
  error?: boolean;
} & CustomInputProps;

function InputWithMark({ error, ...props }: InputWithMarkProps) {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <CustomInput {...props} onChangeText={(text) =>{
        setShow(text.length>0)
        props.onChangeText && props.onChangeText(text)
      }} >
      {show && (
              <img src={error ? Close : Check} alt="" height={20} />
            )}
      </CustomInput>
    </>
  );
}

export default InputWithMark;
