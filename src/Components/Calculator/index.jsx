import React, { Component } from 'react';
import { Col, Grid, Row, ButtonGroup, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import './style.css';
import Textbox from '../Textbox';

class Calculator extends Component {

  state={
    inputTextboxCount:0,
    inputTextboxesSet:[],
    validation: {
      errorState: false,
      errorMessage:''
    },
    output:{
      arrayFormat: [],
      stringFormat: ''
    },
    lastAddedOperation: null
  }

  addInputTextbox = () => {
    const {
      inputTextboxCount,
      inputTextboxesSet,
      lastAddedOperation
    } = this.state
    if (inputTextboxCount === 0 || lastAddedOperation!==null) {
      const newTextboxesSet = new Set()
      const newTextbox = {
        key: inputTextboxCount + (lastAddedOperation ? inputTextboxCount+1 : 1)
      }
      newTextboxesSet.add(newTextbox)
      const prevTextboxesSet = [...inputTextboxesSet]
      let newInputTextboxesSet = []
      newInputTextboxesSet = [
        ...prevTextboxesSet,
        ...[...newTextboxesSet],
      ]
      return this.setState({
        inputTextboxCount: inputTextboxCount + 1,
        inputTextboxesSet: newInputTextboxesSet,
        lastAddedOperation: null
      })
    }
  }

  renderInputTextbox = () => {
    return this.state.inputTextboxesSet.map(textboxItem => (
      <Textbox 
        key={textboxItem.key}
        handleChange={this.handleChange}
        data={textboxItem}
      />
    ))
  }

  createNewOutput = (newInputTextsData) => {
    const oldOutput = {...this.state.output}
    let {
      arrayFormat
    } = oldOutput
    newInputTextsData.forEach((inputData) => {
      if (inputData.value) {
        arrayFormat[inputData.key-1] = inputData.value
      }
    })
    const newStringFormat = {
      stringFormat: arrayFormat.join(' ')
    }
    const newOutput = {
      ...oldOutput,
      ...newStringFormat
    }

    return newOutput
  }

  handleChange = (value, textboxKey) => {
    const {
      validation,
      inputTextboxesSet,
      output
    } =  this.state

    const inputString =  value 
    const validationState = {
      ...validation
    }
    const newInputTextboxesSet = [
      ...inputTextboxesSet
    ]
    let newOutput = {...output}
    if (isNaN(inputString)) {
      validationState.errorState= true
      validationState.errorMessage = `The value "${inputString}" provided is a String. Please provide a valid number"`
    } else {
      validationState.errorState= false
      validationState.errorMessage= ''

      newInputTextboxesSet.forEach(textboxData => {
        if (textboxData.key === textboxKey) {
          textboxData.value = inputString
        }
      })

      newOutput = this.createNewOutput(newInputTextboxesSet)
    }
    
    this.setState({
      validation: validationState,
      inputTextboxesSet: newInputTextboxesSet,
      output: newOutput,
      lastAddedOperation: null
    })
  }

  selectLogicOperation = (evt) => {
    const {
      inputTextboxCount,
      output,
      lastAddedOperation
    } = this.state
    const newOutput = { ...output }
    const {
      arrayFormat
    } = newOutput
    const keyOfLastTextAdded = arrayFormat.length
    let latestAddedOperation = null
    if (inputTextboxCount !== 0 && lastAddedOperation === null && !isNaN(arrayFormat[keyOfLastTextAdded - 1])) {
      switch (evt) {
        case 'sum':
          arrayFormat.push('+')
          latestAddedOperation = '+'
          break;
        case 'substract':
          arrayFormat.push('-')
          latestAddedOperation = '-'
          break;
        case 'multiply':
          arrayFormat.push('*')
          latestAddedOperation = '*'
          break;
        case 'divide':
          arrayFormat.push('/')
          latestAddedOperation = '/'
          break;   
        default:
      }
      const newStringFormat = {
        stringFormat: arrayFormat.join(' ')
      }
      const newOutputSet = {
        ...newOutput,
        ...newStringFormat
      }
      this.setState({
        output: newOutputSet,
        lastAddedOperation: latestAddedOperation
      })
    }
  }

  onSubmit = () => {
    const {
      output
    } = this.state


    const newOutput = {...output}
    const calcArr = [...newOutput.arrayFormat]

    //Handle Multiply
    for (let i = 0; i <= calcArr.length; i++) {
      const calcItem = calcArr[i];
      if (calcItem === '*') {
        const tLeft = parseFloat(calcArr[i - 1]);
        const tRight = parseFloat(calcArr[i + 1]);
    
        const nVal = tLeft * tRight;
        calcArr[i - 1] = nVal;
        calcArr.splice(i, 2);
        i = calcArr.length;
      }
    }
  
    //Handle Divide
    for (let i = 0; i <= calcArr.length; i++) {
      const calcItem = calcArr[i];
      if (calcItem === '/') {
        const tLeft = parseFloat(calcArr[i - 1]);
        const tRight = parseFloat(calcArr[i + 1]);
    
        const nVal = tLeft / tRight;
        calcArr[i - 1] = nVal;
        calcArr.splice(i, 2);
        i = calcArr.length;
      }
    }
  
    //Handle Plus and Minus
    let tResult = parseFloat(calcArr[0]);
    for (let i = 1; i < calcArr.length; i++) {
      if (calcArr[i] === '+') {
        tResult = tResult + parseFloat(calcArr[i + 1]);
      } else if (calcArr[i] === '-') {
        tResult = tResult - parseFloat(calcArr[i + 1]);
      }
      i++;
    }

    const finalString = newOutput.arrayFormat.join(' ').concat(` = ${tResult}`)
    newOutput.stringFormat = finalString

    this.setState({
      output: newOutput
    })
  }


  render() {
    const {
      validation, 
      output
    } = this.state
    return (
      <Grid className='calculatorWrapper'>
        <Row>
          <Col xs={12}>
            <Textbox 
              value={output.stringFormat}  
              autoFocus 
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {validation.errorState && (<div>{validation.errorMessage}</div>)}
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="inputTextBoxesWrapper">
            {this.renderInputTextbox()}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ButtonGroup className='buttonsWrapper'>
              <Button onClick={this.onSubmit}>Submit</Button>
              <Button
                onClick={this.addInputTextbox}
              >
                Add Input
              </Button>
              <DropdownButton 
                onSelect={this.selectLogicOperation} 
                title="Dropdown" 
                id="bg-nested-dropdown"
              >
                <MenuItem eventKey="sum">Sum</MenuItem>
                <MenuItem eventKey="substract">Substract</MenuItem>
                <MenuItem eventKey="multiply">Multiply</MenuItem>
                <MenuItem eventKey="divide">Divide</MenuItem>
              </DropdownButton>
            </ButtonGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Calculator;
