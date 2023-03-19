const path = require("path");
const { Users } = require("../Data");
const lod = require("lodash");
const { Movies } = require("../Movies");
const cloudinary = require("cloudinary");
const UserModel = require("../Models/Users");

require("dotenv").config();

//? Cloudinary Config

cloudinary.config({
  cloud_name: "dcwuchkjz",
  api_key: "789361884369324",
  api_secret: "UqrErOVO9NUNhGnWOSs2lSN8gI8",
});

//< Mongo SetUp
const { ObjectId, MongoClient } = require("mongodb");
const { exit } = require("process");
const url =
  "mongodb+srv://victorbiju9:Victor007@graphqltest.rn91pi2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

const resolvers = {
  Query: {
    users() {
      // get Users to MongoDb
      // try {
      //   Users.forEach((user) => {
      //     const newUser = new UserModel({
      //       name: user.name,
      //       username: user.username,
      //       age: user.age,
      //       ntl: user.ntl,
      //       photo: user.photo,
      //     });
      //     newUser.save();
      //   });
      // } catch (err) {
      //   console.log(err);
      // }
      return Users;
    },
    user: (parent, args) => {
      const id = args.id;
      const user = lod.find(Users, { id: Number(id) });
      return user;
    },
    movies: () => {
      return Movies;
    },
    movie: (parent, args) => {
      const name = args.name;
      const movie = lod.find(Movies, { name });
      return movie;
    },
  },
  User: {
    favoriteMovies: () => {
      return lod.filter(Movies, (movie) => movie.isReleased == true);
    },
  },
  Mutation: {
    // Create
    createUser: async (parent, args) => {
      const user = args.input;
      const lastId = Users[Users.length - 1].id;
      user.id = lastId + 1;
      // console.log(args.input.photo);
      const mainDir = path.dirname(require.main.filename);
      const filename = `${mainDir}/uploads/${args.input.photo}`;
      try {
        const photo = await cloudinary.v2.uploader.upload(filename);
        // console.log(photo);
        user.photo = `${photo.public_id}.${photo.format}`;
        const newUser = new UserModel({
          name: user.name,
          username: user.username,
          age: user.age,
          ntl: user.ntl,
          photo: user.photo,
        });
        newUser.save();
        Users.push(user);
        return user;
      } catch (err) {
        console.log(err);
      }
    },
    // Update
    updateUser: (parent, args) => {
      const { id, newName, newUsername, newAge } = args.input;
      let updatedUser;
      Users.forEach((user) => {
        if (user.id === Number(id)) {
          user.name = newName;
          user.username = newUsername;
          user.age = newAge;
          updatedUser = user;
        }
        return updatedUser;
      });
    },
    // Delete
    deleteUser: (parent, args) => {
      const id = args.id;
      lod.remove(Users, (user) => user.id === Number(id));
      return null;
    },
    // Upload image
    uploadImage: async (parent, { filename }) => {
      // const mainDir = path.dirname(require.main.filename);
      // filename = `${mainDir}/uploads/${filename}`;
      filename = `${filename}`;
      try {
        const photo = await cloudinary.v2.uploader.upload(filename);
        // console.log(photo);
        lod.update(Users, {
          photo: `${photo.public_id}.${photo.format}`,
        });
      } catch (err) {
        console.log(err);
      }
    },
    // Update image
    updateImage: (parent, { input }) => {
      const { name, username, filename } = input;
      let updatedUser;
      const mainDir = path.dirname(require.main.filename);
      const file = `${mainDir}/Uploads/${filename}`;
      Users.forEach(async (user) => {
        if (user.name == name && user.username == username) {
          try {
            const photo = await cloudinary.v2.uploader.upload(file);
            user.photo = `${photo.public_id}.${photo.format}`;
            const updateFilters = { name: name, username: username };
            client.connect().then(() => {
              const db = client.db("test");
              const collection = db.collection("users");
              collection.updateOne(updateFilters, {
                $set: { photo: user.photo },
              });
            });
            updatedUser = user;
            console.log(updatedUser);
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log("Check your inputs again !");
        }
        return updatedUser;
      });
    },
  },
};

module.exports = { resolvers };
