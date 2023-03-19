import React, { useState } from "react";
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";

//< Material
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

//< Cloudinary
import { Image } from "cloudinary-react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Query_All_Users = gql`
  query GetAllUsers {
    users {
      id
      name
      username
      age
      photo
    }
  }
`;
const Query_All_Movies = gql`
  query GetAllMovies {
    movies {
      id
      name
      isReleased
      releaseDate
    }
  }
`;
const Get_Movie_By_Name = gql`
  query GetMovieByName($name: String!) {
    movie(name: $name) {
      name
      isReleased
      releaseDate
    }
  }
`;

const Create_User_Mutation = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      id
    }
  }
`;

function DisplayData() {
  const [SearchMovie, setSearchMovie] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [ntl, setNtl] = useState("");
  const [image, setImage] = useState("");
  const { data, loading, error, refetch } = useQuery(Query_All_Users);
  const { data: movieData } = useQuery(Query_All_Movies);
  const [fetchMovie, { data: fetchedMovie, error: fetchError }] =
    useLazyQuery(Get_Movie_By_Name);
  const [createAUser] = useMutation(Create_User_Mutation);
  // if (movieData) {
  //   console.log(movieData);
  // }
  if (error) {
    console.log(error);
  }
  return (
    <>
      <h1>Create a User</h1>
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        onChange={(e) => setAge(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Nationality"
        onChange={(e) => setNtl(e.target.value)}
      />
      <input
        type="file"
        placeholder="upload image"
        onChange={(e) => setImage(e.target.files[0].name)}
      />
      <button
        onClick={() => {
          createAUser({
            variables: {
              input: {
                name,
                username,
                age,
                ntl,
                photo: image,
              },
            },
          });
          refetch();
        }}
      >
        Create
      </button>
      <div className="DisplayData">
        <h1 className="heading">List of Users</h1>
        {loading ? (
          <h2>Loading....</h2>
        ) : (
          <>
            <Grid
              container
              rowSpacing={8}
              columnSpacing={10}              
              sx={{ padding: "0 2rem", maxWidth: "90rem",margin:'0 auto' }}
            >
              {data &&
                data.users.map((user) => (
                  // <div className="Users" key={user.id}>
                  //   <h4>name : {user.name}</h4>
                  //   <h4>username : {user.username}</h4>
                  //   <h4>age : {user.age}</h4>
                  // </div>
                  <Grid item xs={12} sm={6} lg={4} xl={3}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component="img"
                        height="294"
                        image={`https://res.cloudinary.com/dcwuchkjz/image/upload/v1678955435/${user.photo}`}
                        alt={user.name}                        
                      />
                      {/* <Image
                        cloudName="dcwuchkjz"
                        publicId={`https://res.cloudinary.com/dcwuchkjz/image/upload/v1678955435/${user.photo}`}
                      /> */}
                      <CardContent>
                        <Typography variant="h6" color="text.primary">
                          Name : {user.name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Username : {user.username}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Age : {user.age}
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                          <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="share">
                          <ShareIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </>
        )}
        <h1>Movies data</h1>
        {movieData &&
          movieData.movies.map((movie) => (
            <div className="movie">
              <h4>name: {movie.name}</h4>
              <h4>isReleased: {movie.isReleased.toString()}</h4>
              <h4>ReleaseDate: {movie.releaseDate}</h4>
            </div>
          ))}

        <input
          type="text"
          placeholder="Seach your movie"
          onChange={(e) => {
            setSearchMovie(e.target.value);
          }}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: SearchMovie,
              },
            });
          }}
        >
          Search Movie
        </button>
        {fetchedMovie && (
          <div>
            <h1>Movie Name : {fetchedMovie.movie.name}</h1>
            <h1>isReleased : {fetchedMovie.movie.isReleased.toString()}</h1>
            <h1>releaseDate: {fetchedMovie.movie.releaseDate}</h1>
          </div>
        )}
        {fetchError && <h2>There was an errror fetching the data</h2>}
      </div>
    </>
  );
}

export default DisplayData;
