import React from 'react'
import Logo from './immo-logo.jpg'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'

class TopBar extends React.Component {
    render() {
        return(
            <div>
                <Navbar bg="light" expand="lg">
                <img src={Logo} style={{height: "120px"}} ></img>
                    <Container style={{justifyContent: 'center'}}>
                        <Navbar.Brand href="#home">Property Search Tool</Navbar.Brand>
                    </Container>
                </Navbar>
            </div>
        )
    }
}

export default TopBar