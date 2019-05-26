import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloClient } from "apollo-boost"
import { ApolloProvider, Query, Mutation } from "react-apollo"
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from "graphql-tag"

import { Table, Card, Form, Button } from "react-bootstrap"

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "https://pm2.adamlass.com/apollo"
})

const client = new ApolloClient({
  cache,
  link
})

const GET_USERS = gql`
{
  getAllUsers{
    id
    userName
    email
    job{
      company
    }
  }
}
`



const UserList = () => {
  return (
    <Table striped bordered hover style={{ margin: 0 }}>
      <thead>
        <tr>
          <th>#</th>
          <th>UserName</th>
          <th>Email</th>
          <th>Company</th>
        </tr>
      </thead>
      <tbody>
        <Query
          query={GET_USERS}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            return data.getAllUsers.map(({ id, userName, email, job }) => {
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{userName}</td>
                  <td>{email}</td>
                  <td>{job && job.map(job => job.company).join(", ")}</td>
                </tr>
              )
            })
          }}
        </Query>

      </tbody>
    </Table>
  )
}

const ADD_USER = gql`
  mutation AddUser(
        $firstName: String!,
        $lastName: String!,
        $userName: String!,
        $password: String!,
        $email: String!
  ){
    addUser(
        input: {
          firstName: $firstName,
          lastName: $lastName,
          userName: $userName,
          password: $password,
          email: $email
        }
    ){
      id
      firstName
    }
  }
`


const AddUser = () => {
  let input = {}

  function handleKeyPressed(e){
    input[e.target.name] = e.target.value
  }

  return (
    <Mutation
      mutation={ADD_USER}
      update={(cache, { data: { addUser } }) => {
        const users = cache.readQuery({ query: GET_USERS })
        cache.writeQuery({
          query: GET_USERS,
          data: { getAllUsers: users.concat([addUser]) }
        })
      }}
    >
      {addUser => (
      <Form onSubmit={e => {
          e.preventDefault()
          addUser({
            variables: {
              userName: input.username
            }
          })
          input = {}
        }
      }
      >
        <Form.Group controlId="formBasicEmail">
        <Form.Label>UserName</Form.Label>
        <Form.Control type="text" name="userName" value={input.userName} onKeyUp={handleKeyPressed} placeholder="Enter desired username" />
        
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name="email" value={input.email} onKeyUp={handleKeyPressed} placeholder="Enter email" />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" value={input.password} onKeyUp={handleKeyPressed} placeholder="Password" />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Fistname</Form.Label>
        <Form.Control type="text" name="firstName" value={input.firstName} onKeyUp={handleKeyPressed} placeholder="Enter firstname" />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Lastname</Form.Label>
        <Form.Control type="text" name="lastName" value={input.lastName} onKeyUp={handleKeyPressed} placeholder="Enter lastname" />
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

function App() {
  return (
    <ApolloProvider client={client}>
      <Card style={{ margin: 10 }}>
        <Card.Header>
          <h1>Apollo Client - Mini-Project - Users</h1>
          <Card.Subtitle className="mb-2 text-muted">by Adam Lass</Card.Subtitle>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          <UserList />

        </Card.Body>
        <Card.Footer>
          <Card.Title>Create new user</Card.Title>
          <AddUser />

        </Card.Footer>
      </Card>
    </ApolloProvider>
  );
}

export default App;
