const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;

//Tell GraphQL what fields and types of data to expect

const CompanyType = new GraphQLObjectType({
    name: "company",
    // This will allow the UserType variable to be defined even though it is declared after the function runs
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(res => res.data)
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                //console log parentValue to see the object of the user with the id used in the query.  companyId is availbe in the object
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(res => res.data)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
               //request to JSON server
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    //axios nests data under a key called data
                    .then(resp => resp.data)
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
               //request to JSON server
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    //axios nests data under a key called data
                    .then(resp => resp.data)
            }
        }         
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});