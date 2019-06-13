import React from 'react';
import { ApolloProvider, Query, Mutation } from "react-apollo"
import gql from "graphql-tag"
import { Table, Card, Form, Button } from "react-bootstrap"

const ADD_USER = gql`
  mutation AddUser(
        $firstName: Int!,
        $lastName: String!,
        $userName: String!,
        $password: String!,
        $email: String!
  ){
    addUser(
        input: {
          firstName: $firstName,
          lastName: $lastName,
          password: $password,
          email: $email,
          userName: $userName,
        }
    ){
        id
        userName
        email
        job{
        company
        }
    }
  }
`


export default class AddUser extends React.Component {
    constructor(props) {
        super(props)
        this.state = { input: { firstName: "", lastName: "", userName: "", password: "", email: "" } }
    }

    handleKeyPressed = (e) => {
        let input = Object.assign({}, this.state.input)
        input[e.target.name] = e.target.value
        this.setState({ input })
    }

    render() {
        const GET_USERS = this.props.GET_USERS

        var input = this.state.input
        return (
            <Mutation
                mutation={ADD_USER}
                update={(cache, { data: { addUser } }) => {
                    try {
                        const users = cache.readQuery({ query: GET_USERS }).getAllUsers
                        cache.writeQuery({
                            query: GET_USERS,
                            data: { getAllUsers: users.concat([addUser]) }
                        })
                    } catch (error) {
                        console.log(error)
                    }
                }}
                onError={(error) => alert(error)}
            >
                {addUser => (
                    <Form onSubmit={e => {
                        e.preventDefault()
                        addUser({
                            variables: {
                                userName: this.state.input.userName,
                                firstName: this.state.input.firstName,
                                lastName: this.state.input.lastName,
                                password: this.state.input.password,
                                email: this.state.input.email,

                            }
                        })
                        this.setState({ input: { firstName: "", lastName: "", userName: "", password: "", email: "" } })
                    }
                    }
                    >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>UserName</Form.Label>
                            <Form.Control type="text" name="userName" value={this.state.input.userName} onChange={this.handleKeyPressed} placeholder="Enter desired username" />

                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" name="email" value={this.state.input.email} onChange={this.handleKeyPressed} placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" value={this.state.input.password} onChange={this.handleKeyPressed} placeholder="Password" />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Fistname</Form.Label>
                            <Form.Control type="text" name="firstName" value={this.state.input.firstName} onChange={this.handleKeyPressed} placeholder="Enter firstname" />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Lastname</Form.Label>
                            <Form.Control type="text" name="lastName" value={this.state.input.lastName} onChange={this.handleKeyPressed} placeholder="Enter lastname" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Create new user
              </Button>

                    </Form>
                )
                }

            </Mutation >
        )
    }

}