import React from 'react'
import {fetchProperties, fetchPropertyDetails, getAvailablePropertyTypes} from './api'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class MainPage extends React.Component {

    state = {
        selectedProperties: [],
        propertyTypes: [],
        rowData: []
    }

    componentDidMount() {
        getAvailablePropertyTypes()
        .then(response => {
            this.setState({
                propertyTypes: response.propertyTypes
            })
        })
    }

    handlePropertyFilter = event => {
        let propertyDetailsFilter = []
        let propertyDetailsLengthFilter = ''
        if(event.target.id === 'all') {
            let propertyDetails = []
        let propertyDetailsLength = ''
        fetchProperties({ address: document.getElementById('formBasicEmail').value})
        .then(response => {
            propertyDetailsLength = response.properties.length
            response.properties.forEach(property => {
                fetchPropertyDetails(property.id)
                .then(response => {
                    propertyDetails.push(response.property)
                    if(propertyDetailsLength === propertyDetails.length) {
                        this.setState({
                            rowData: propertyDetails
                        })
                    }
                })
            })
        })
        }
        // else if(fetchProperties({ address: document.getElementById('formBasicEmail').value})
        //     .then(response => {
        //         response.properties.find(data => data.propertyType === event.target.id)
        //     }) === undefined) {
        //         debugger
        //         this.setState({
        //             rowData: []
        //         })
        //     }
        else {
            fetchProperties({ address: document.getElementById('formBasicEmail').value})
            .then(response => {
                let filterResponse = response.properties.filter(property => property.propertyType === event.target.id)
                propertyDetailsLengthFilter = filterResponse.length
                if(propertyDetailsLengthFilter === 0) {
                    this.setState({
                        rowData: []
                    })
                }
                filterResponse.forEach(property => {
                    fetchPropertyDetails(property.id)
                    .then(response => {
                        propertyDetailsFilter.push(response.property)
                        if(propertyDetailsLengthFilter === propertyDetailsFilter.length) {
                            this.setState({
                                rowData: propertyDetailsFilter
                            })
                        }
                    })
                })
            })
        }
    }

    handleSubmit = event => {
        event.preventDefault()
        this.setState({
            rowData: []
        })
        let propertyDetails = []
        let propertyDetailsLength = ''
        fetchProperties({ address: event.target[0].value})
        .then(response => {
            propertyDetailsLength = response.properties.length
            response.properties.forEach(property => {
                fetchPropertyDetails(property.id)
                .then(response => {
                    propertyDetails.push(response.property)
                    if(propertyDetailsLength === propertyDetails.length) {
                        this.setState({
                            rowData: propertyDetails
                        })
                    }
                })
            })
        })
    }
    render() {
        const onCellTicked = event => {
            let selectedDetails = []
            if(event.api.getSelectedNodes().length === 0){
                this.setState({
                    selectedProperties: []
                })
            }
            event.api.getSelectedNodes().forEach(node => {
                selectedDetails.push(node.data)
                if(selectedDetails.length === event.api.getSelectedNodes().length){
                    this.setState({
                        selectedProperties: selectedDetails
                    })
                }
            })
        }
        const columnDefs = [
            {headerName: '✔', field: 'id', checkboxSelection: true, width: '50px'},
            {headerName: 'Address', field: 'address'},
            {headerName: 'Postcode', field: 'postcode'},
            {headerName: 'Property Type', field: 'propertyType'},
            {headerName: 'Number of rooms', field: 'numberOfRooms'},
            {headerName: 'Floor Area', field: 'floorArea'}   
        ]
        const columnDefsSelected = [
            {headerName: 'Address', field: 'address'},
            {headerName: 'Postcode', field: 'postcode'},
            {headerName: 'Number of rooms', field: 'numberOfRooms'},
            {headerName: 'Floor Area', field: 'floorArea'}   
        ]
        let renderButtons = () => {
        }
        return(
            <div>
                <Container fluid>
                    <Row>
                        <Col xs={4} md={2}>
                            <Card style={{ marginTop: '100%' }}>
                                <Card.Body>
                                    <Card.Title>Property Types</Card.Title>
                                    <ButtonGroup vertical>
                                        {renderButtons()}
                                        <Button onClick={this.handlePropertyFilter} variant="outline-dark" id="all">All</Button>
                                        <Button onClick={this.handlePropertyFilter} variant="outline-dark" id="semi-detached">Semi-detached</Button>
                                        <Button onClick={this.handlePropertyFilter} variant="outline-dark" id="detached">Detached house</Button>
                                        <Button onClick={this.handlePropertyFilter} variant="outline-dark" id="terraced">Terraced house</Button>
                                        <Button onClick={this.handlePropertyFilter} variant="outline-dark" id="flat">Flat</Button>
                                    </ButtonGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={14} md={10}>
                            <div>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label style={{display: 'block', textAlign: 'left'}}>Search</Form.Label>
                                        <Form.Control type="search" placeholder="Address" />
                                    </Form.Group>
                                    <Button variant="warning" type="submit" >
                                        Search
                                    </Button>
                                </Form>
                                <p style={{marginTop: '20px', textAlign: 'left'}}>Selected Properties</p>
                                <div className="ag-theme-alpine" style={{ width: '100%', height: '200px' }}>
                                <AgGridReact
                                        rowData={this.state.selectedProperties}
                                        rowSelection={'multiple'}
                                        columnDefs={columnDefsSelected}
                                        >
                                    </AgGridReact>
                                </div>  
                                <p style={{marginTop: '20px', textAlign: 'left'}}>Search Results</p>
                                <div className="ag-theme-alpine" style={{ width: '100%', height: '400px' }}>
                                    <AgGridReact
                                        rowData={this.state.rowData}
                                        rowSelection={'multiple'}
                                        columnDefs={columnDefs}
                                        onSelectionChanged={onCellTicked}
                                        groupSelectsChildren={true}
                                        >
                                    </AgGridReact>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default MainPage