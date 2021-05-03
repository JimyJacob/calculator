import React from 'react';
import { FormControl, FormGroup } from 'react-bootstrap';
import './style.css';


export default function Textbox(props) {
  const {
    value,
    handleChange,
    data
  } = props

  const handleInputChange = (evt) => {
    if(data) {
      const {key} = data
      const enteredValue = evt.target.value
      handleChange(enteredValue, key)
    }
  }
  return (
    <FormGroup 
    className='textbox'
    >
      
      <FormControl
        type="text"
        value={value}
        placeholder="0"
        autoFocus
        onChange={(evt) => handleInputChange(evt)}
      />
    </FormGroup>

  )
}
