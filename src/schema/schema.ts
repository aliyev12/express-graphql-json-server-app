import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';
import axios, { AxiosResponse } from 'axios';
import { User, Company } from '../interfaces';

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: (): {} => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      async resolve(parentValue: { id: string }, args: {}) {
        return await axios
          .get(`http://localhost:5000/companies/${parentValue.id}/users`)
          .then((res: AxiosResponse): Company => res.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: (): {} => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      async resolve(parentValue: User, args: {}) {
        return await axios
          .get(`http://localhost:5000/companies/${parentValue.companyId}`)
          .then((res: AxiosResponse) => res.data);
      }
    }
  })
});

const query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args: { id?: string }) {
        return await axios
          .get(`http://localhost:5000/users/${args.id}`)
          .then((res: AxiosResponse): User => res.data);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      args: {},
      async resolve(parentValue, args) {
        return await axios
          .get(`http://localhost:5000/users`)
          .then((res: AxiosResponse): User[] => res.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args: { id?: string }) {
        return await axios
          .get(`http://localhost:5000/companies/${args.id}`)
          .then((res: AxiosResponse) => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    /*=== ADD USER ===*/
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      async resolve(parentValue, { firstName, age }) {
        console.log('parentValue = ', parentValue);
        return await axios
          .post('http://localhost:5000/users', { firstName, age })
          .then((res: AxiosResponse): User => res.data);
      }
    },
    /*=== DELETE USER ===*/
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parentValue, { id }) {
        return await axios
          .delete(`http://localhost:5000/users/${id}`)
          .then((): { id: string } => ({ id }));
      }
    },
    /*=== EDIT USER ===*/
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      async resolve(parentValue, { id, firstName, age, companyId }: User) {
        return await axios
          .patch(`http://localhost:5000/users/${id}`, {
            firstName,
            age,
            companyId
          })
          .then((res: AxiosResponse): User => res.data);
      }
    }
    /*=== X ===*/
    /*=== X ===*/
  }
});

export const schema = new GraphQLSchema({ query, mutation });
