import React from 'react';
import { ApolloProvider, Query, Mutation } from "react-apollo"
import gql from "graphql-tag"
import { Table, Card, Form, Button } from "react-bootstrap"

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!){
    removeUser(id: $id)
  }
`

export default ({GET_USERS}) => {
        return (
            <Table striped bordered hover style={{ margin: 0 }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>UserName</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Delete</th>
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
                                        <td>
                                            <Mutation
                                                mutation={DELETE_USER}
                                                onError={(error) => alert(error)}
                                                update={(cache) => {
                                                    try {
                                                        var users = cache.readQuery({ query: GET_USERS }).getAllUsers
                                                        users = users.filter(user => user.id != id)
                                                        console.log('users', users)
                                                        cache.writeQuery({
                                                            query: GET_USERS,
                                                            data: { getAllUsers: users }
                                                        })

                                                    } catch (error) {
                                                        console.log(error)
                                                    }
                                                }}
                                            >
                                                {removeUser => (
                                                    <Button
                                                        style={{ width: "100%", height: "100%", margin: 0 }}
                                                        variant="danger"
                                                        type="submit"
                                                        onClick={e => {
                                                            e.preventDefault()

                                                            removeUser({ variables: { id } })
                                                        }}>
                                                        Delete
                                                    </Button>
                                                )}

                                            </Mutation>
                                        </td>
                                    </tr>
                                )
                            })
                        }}
                    </Query>

                </tbody>
            </Table>
        )
    }


